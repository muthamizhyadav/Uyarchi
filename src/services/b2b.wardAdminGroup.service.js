const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
let currentDate = moment().format('DD-MM-YYYY');
const { Shop } = require('../models/b2b.ShopClone.model');
const { ShopOrderClone } = require('../models/shopOrder.model');
const { ProductorderClone } = require('../models/shopOrder.model');
const wardAdminGroup = require('../models/b2b.wardAdminGroup.model');
const wardAdminGroupDetails = require('../models/b2b.wardAdminGroupDetails.model');

const createGroup = async (body) => {

  let serverdates = moment().format('YYYY-MM-DD');
  let servertime = moment().format('hh:mm a');
  const group = await wardAdminGroup.find({ assignDate: serverdates });

  let center = '';

  if (group.length < 9) {
    center = '0000';
  }
  if (group.length < 99 && group.length >= 9) {
    center = '000';
  }
  if (group.length < 999 && group.length >= 99) {
    center = '00';
  }
  if (group.length < 9999 && group.length >= 999) {
    center = '0';
  }
  let userId = '';
  let totalcount = group.length + 1;
  console.log(totalcount);
  userId = 'G' + center + totalcount;

  let values = { ...body, ...{ groupId: userId, assignDate: serverdates, assignTime: servertime } };
  body.Orderdatas.forEach(async (e) => {
    let productId = e._id
    await ShopOrderClone.findByIdAndUpdate({ _id: productId }, { status: "Assigned" }, { new: true });
  });
  let wardAdminGroupcreate = await wardAdminGroup.create(values);
  await ShopOrderClone.findByIdAndUpdate({_id:productId}, { GroupId: wardAdminGroupcreate._id }, {new:true})
  return wardAdminGroupcreate;
};

const updateOrderStatus = async (id, updateBody) => {
  let deliveryStatus = await ShopOrderClone.findById(id);
  console.log(deliveryStatus);
  if (!deliveryStatus) {
    throw new ApiError(httpStatus.NOT_FOUND, 'status not found');
  }
  deliveryStatus = await ShopOrderClone.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  console.log(deliveryStatus);
  return deliveryStatus;
};

const orderPicked = async (deliveryExecutiveId) => {
  let orderPicked = await ShopOrderClone.find({ deliveryExecutiveId: deliveryExecutiveId });
  console.log(orderPicked)
  if (orderPicked.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, ' id not found');
  }

  orderPicked.forEach(async (e) => {
    let statusUpdate = e.deliveryExecutiveId
    await ShopOrderClone.findByIdAndUpdate({ deliveryExecutiveId: statusUpdate }, { status: "Order Picked" }, { new: true })
  })

  return "success";
};
const getById = async (id) => {
  return wardAdminGroup.findById(id);
};


const updateManageStatus = async (id, updateBody) => {
  let Manage = await getById(id);

  if (!Manage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data not found');
  }
  Manage = await wardAdminGroup.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return Manage;
};

// GET ORDER DETAILS FROM GROUP BY ID

const getOrderFromGroupById = async (id) => {
  let getDetails = await wardAdminGroup.findById(id);
  return getDetails;
};



const getPettyStock = async (id) => {
  let values = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [{ deliveryExecutiveId: { $eq: id } }],
      },
    },
    {
      $unwind: '$product'
    },
    {
      $group: {
        _id: "$product.productName",
        "Total quantity": { $sum: "$product.quantity" }
      }
    }

  ]);

  return values;
};

const pettyStockSubmit= async (id, updateBody) => {
  let deliveryStatus = await wardAdminGroup.findById(id);
  console.log(deliveryStatus);
  if (!deliveryStatus) {
    throw new ApiError(httpStatus.NOT_FOUND, 'status not found');
  }
  deliveryStatus = await wardAdminGroup.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  console.log(deliveryStatus);
  return deliveryStatus;
};

// const  pettyCashSubmit= async (id, updateBody) => {
//   let deliveryStatus = await wardAdminGroup.findById(id);
//   console.log(deliveryStatus);
//   if (!deliveryStatus) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'status not found');
//   }
//   deliveryStatus = await wardAdminGroup.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
//   console.log(deliveryStatus);
//   return deliveryStatus;
// };

const getGroupdetails = async () => {
  return wardAdminGroup.find();
};

// GET ASSIGN DATA BY DEVIVERY EXECUTIVE NAME

const getstatus = async (id) => {
  let details = await wardAdminGroup.aggregate([

    {

    }
    // {
    //   $lookup:{
    //     from: '',
    //     localField: '',
    //     foreignField: '',
    //     as: '',
    //   }

    // }

  ]);
  return details;
}


const getBillDetails = async (id) => {
  let values = await wardAdminGroup.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'deliveryExecutiveId',
        foreignField: 'deliveryExecutiveId',
        as: 'delivery',
      }
    },
    {
      $unwind: '$delivery'
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'deliveryExecutiveId',
        foreignField: '_id',
        as: 'b2busersData',
      }
    },
    {
      $unwind: '$b2busersData'
    },
    {
      $unwind: '$Orderdatas'
    },
    {
      $lookup: {
        from: 'productorderclones',
        localField: 'delivery._id',
        foreignField: 'orderId',
        as: 'datas',
      }
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'delivery.Uid',
        foreignField: '_id',
        as: 'UserName'
      }
    },
    {
      $unwind: '$UserName'
    },



    {
      $project: {
        // Orderdatas:1,
        assignDate: 1,
        assignTime: 1,
        groupId: 1,
        product: '$delivery.product',
        orderId: '$delivery.OrderId',
        deliveryExecutiveId: '$delivery.deliveryExecutiveId',
        shopId: '$delivery.shopId',
        street: '$Orderdatas.street',
        overAllTotal: '$delivery.overallTotal',
        // totalItems: '$Orderdatas.totalItems',
        type: '$Orderdatas.type',
        // Quantity: '$Orderdatas.Qty',
        shopName: '$Orderdatas.shopName',
        // totalproduct: '$delivery.Qty'
        totalItems: { $size: "$datas" },
        // totalAmount: '$datas.totalAmount',
        customerName: '$UserName.name',
        deliveryExecutiveName: '$b2busersData.name'


      }
    }



  ]);

  let total = await wardAdminGroup.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'deliveryExecutiveId',
        foreignField: 'deliveryExecutiveId',
        as: 'delivery',
      }
    },
    {
      $unwind: '$delivery'
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'deliveryExecutiveId',
        foreignField: '_id',
        as: 'b2busersData',
      }
    },
    {
      $unwind: '$b2busersData'
    },
    {
      $unwind: '$Orderdatas'
    },
    {
      $lookup: {
        from: 'productorderclones',
        localField: 'delivery._id',
        foreignField: 'orderId',
        as: 'datas',
      }
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'delivery.Uid',
        foreignField: '_id',
        as: 'UserName'
      }
    },
    {
      $unwind: '$UserName'
    },


  ])
  return { values: values, total: total.length }
}


const assignOnly = async (page) => {
  let values = await wardAdminGroup.aggregate([
    {
      $match: {
        status: {
          $in: ['Assigned'],
        }
      }
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await wardAdminGroup.aggregate([
      {
        $match: {
          status: {
            $in: ['Assigned'],
          }
        }
      },
  ])
  return {values: values, total: total.length};
}


const getDeliveryOrderSeparate = async (id, page) => {
  let datas = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [{ deliveryExecutiveId: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shopData',

      }
    },
    { $unwind: '$shopData' },
    {
      $lookup: {
        from: 'streets',
        localField: 'shopData.Strid',
        foreignField: '_id',
        as: 'streetsData',
      }
    },
    { $unwind: '$streetsData' },
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'orderId',
        // pipeline: [
        //     { $group: { _id: null, Qty: { $sum: '$quantity' }, } },
        // ],
        as: 'orderData',
      }
    },
    // { $unwind: '$orderData' },
    {
      $project: {
        status:1,
        OrderId: 1,
        shopId: 1,
        date: 1,
        time: 1,
        OrderId: 1,
        customerDeliveryStatus:1,
        deliveryExecutiveId: 1,
        streetName: '$streetsData.street',
        // Qty: "$orderData.Qty",
        type: '$shopData.type',
        // product:1,
        totalItems: { $size: '$orderData' },

      }
    },

    { $skip: 10 * page },
    { $limit: 10 },

  ]);
  let total = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [{ deliveryExecutiveId: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shopData',

      }
    },
    { $unwind: '$shopData' },
    {
      $lookup: {
        from: 'streets',
        localField: 'shopData.Strid',
        foreignField: '_id',
        as: 'streetsData',
      }
    },
    { $unwind: '$streetsData' },
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          { $group: { _id: null, Qty: { $sum: '$quantity' }, } },
        ],
        as: 'orderData',
      }
    },
    { $unwind: '$orderData' },
  ])
  return { datas: datas, total: total.length };
};


const groupIdClick = async (id) => {
  let data = []
  let getDetails = await wardAdminGroup.findById(id);
  getDetails.Orderdatas.forEach((e) => {

    data.push(e)
  })
  return data;
}

const orderIdClickGetProduct = async (id) => {
  console.log(id)

  let getDetails = await ProductorderClone.aggregate([
    {
      $match: {
        $and: [{ orderId: { $eq: id } }],
      },
    },
    // {
    //   $lookup: {
    //     from: 'productorderclones',
    //     localField: '_id',
    //     foreignField: 'orderId',
    //     as: 'productorderclonesData',
    //   }
    // },
    // {
    //   $unwind: '$productorderclonesData'
    // },
    {
      $lookup: {
        from: 'products',
        localField: 'productid',
        foreignField: '_id',
        as: 'productsData',
      }
    },
    {
      $unwind: '$productsData'
    },
    {
      $project: {
        quantity: 1,
        priceperkg: 1,
        product: '$productsData.productTitle',
        productId: '$productsData._id',
      }
    }

  ]);

  return getDetails;

}


const getDetailsAfterDeliveryCompletion = async (id) => {
  let values = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [{ deliveryExecutiveId: { $eq: id } }],
      },
    },
    // {
    //   $lookup: {
    //     from: 'wardadmingroups',
    //     localField: 'deliveryExecutiveId',
    //     foreignField: 'deliveryExecutiveId',
    //     as: 'datas'
    //   }
    // },
    // { $unwind: '$datas'},
  ]);
  return values;

}


const getBillDetailsPerOrder = async (id) => {
  let datas = await ProductorderClone.aggregate([
    {
      $match: {
        $and: [{
          orderId
            : { $eq: id }
        }],
      },
    },
    
    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'orderId',
        foreignField: '_id',
        as: 'productData'
      }
    },
    { $unwind: '$productData'},
    {
      $lookup :{
        from: 'productorderclones',
        localField: 'productData._id',
        foreignField: 'orderId',
        pipeline: [
          { $group: { _id: null, Qty: { $sum: '$quantity' }, } },
        ],
        as: 'quantityData',
      }
    },
    { $unwind: '$quantityData'},
    {
      $lookup:{
        from: 'products',
        localField: 'productid',
        foreignField: '_id',
        as: 'hsnData',
      }
    },
    {$unwind: '$hsnData'},
   
    {
      $lookup: {
        from: 'b2busers',
        localField: 'productData.Uid',
        foreignField: '_id',
        as: 'usersData',
      }
    },
    { $unwind: '$usersData'},
    {
      $lookup:{
        from: 'b2bshopclones',
        localField: 'usersData._id',
        foreignField: 'Uid',
        as: 'details',
      }
    },
    { $unwind: '$details'},
    {
      $lookup:{
        from: 'b2busers',
        localField: 'productData.deliveryExecutiveId',
        foreignField: '_id',
        as: 'data'
      }
    },
    { $unwind: '$data'},
    {
      $lookup: {
        from : 'hsns',
        localField: 'hsnData.HSN_Code',
        foreignField: '_id',
        as: 'hsnCode',
      }
    },
    { $unwind: '$hsnCode'},

    {
      $project: {
       productName:'$hsnData.productTitle',
       GST: '$hsnData.GST_Number',
       HSN:'$hsnCode.HSN_code',
       TotalAmount:'$productData.product.totalAmount',
       productid:1,
       quantity:1,
       priceperkg:1,
       total:'$productData.overallTotal',
       name : '$usersData.name',
       phoneNumber: '$usersData.phoneNumber',
       shopName: '$details.SName',
       Address: '$details.address',
       deliveryExecutiveName: '$data.name',
       BillNumber: '$productData.billNo',
       BillTime: '$productData.billTime',
       BillDate : '$productData.billDate',
      //  Nos: { $size: '$productData.product' },
       product: '$productData.product',
       Qty: '$quantityData.Qty',
      }
    }

  ]);
  return datas;
}

const getReturnWDEtoWLE = async (id , page) =>{
  let datas = await wardAdminGroup.aggregate([
    {
      $match: {
        $and: [{ deliveryExecutiveId: { $eq: id } }],
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await wardAdminGroup.aggregate([
    {
      $match: {
        $and: [{ deliveryExecutiveId: { $eq: id } }],
      },
    },
  ])
  return {datas: datas, total: total.length};
};


const getPettyStockDetails = async (id , page) =>{
  let details = await wardAdminGroup.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    { $unwind: '$pettyStock'},
    {
      $project: {
        pettyStock:1,
      }
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await wardAdminGroup.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
  ]);
  return { details: details, total: total.length}
}

const getdetailsAboutPettyStockByGroupId = async (id , page) =>{
  let details = await wardAdminGroup.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }]
      }
    },

    { $skip: 10 * page },
    { $limit: 10 },

  ]);
  let total = await wardAdminGroup.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }]
      }
    },
  ])

  return {details: details, total: total.length};

}




module.exports = {
  createGroup,
  // updateOrderStatus,
  getOrderFromGroupById,

  getPettyStock,

  // group Details
  getGroupdetails,

  // DELEIVERY DETAILS
  // getDeliveryDetails,

  getstatus,
  getBillDetails,
  assignOnly,


  orderPicked,

  getDeliveryOrderSeparate,

  updateManageStatus,
  groupIdClick,
  orderIdClickGetProduct,


  updateOrderStatus,

  getDetailsAfterDeliveryCompletion,
  getBillDetailsPerOrder,

  getReturnWDEtoWLE,

  pettyStockSubmit,
  // pettyCashSubmit,

  getPettyStockDetails,
  getdetailsAboutPettyStockByGroupId,



};
// 626931f6-c32c-4b42-a3cc-94c30aeabc70


// 2028cf31-8c9d-4e1f-a820-bd1ccb0add36

// 622ddffe-2da3-4f62-a986-ec5faad2fe6b