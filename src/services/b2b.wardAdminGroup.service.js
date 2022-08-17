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
  return wardAdminGroupcreate;
};

// const updateOrderStatus = async (id, status) => {
//   let deliveryStatus = await wardAdminGroup.findById(id);
//   console.log(deliveryStatus);
//   if (!deliveryStatus) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'status not found');
//   }
//   deliveryStatus = await ShopOrderClone.findByIdAndUpdate({ deliveryExecutiveId: id }, { status: status }, { new: true });
//   console.log(deliveryStatus);
//   return deliveryStatus;
// };

const orderPicked =async (deliveryExecutiveId) => {
  let orderPicked = await ShopOrderClone.find({deliveryExecutiveId:deliveryExecutiveId});
  console.log(orderPicked)
  if (orderPicked.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, ' id not found');
  }
 
  
  orderPicked.forEach(async (e) =>{
     let statusUpdate = e.deliveryExecutiveId 
     await ShopOrderClone.findByIdAndUpdate({ deliveryExecutiveId:statusUpdate} , {status: "Order Picked"},{ new: true})
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
        as: 'productDatas'
      }
    },
    {
      $unwind: '$productDatas'

    },
    {
      $group: {
       _id : null,
       TotalBalance:{$sum:"$product.quantity"}
      }
      
    },
    {
      $project: {
        product: '$productDatas.product'
      }
    }

  ]);

  return values;
};



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


const assignOnly = async(page)=>{
  let values = await wardAdminGroup.aggregate([
    {
      $match:{
        status: {
          $in: ['Assigned'],
      }
    }
  },
  { $skip: 10 * page },
    { $limit: 10 },
  ]);
  return values;
}


const getDeliveryOrderSeparate = async (id, page)=>{
  let datas = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [{deliveryExecutiveId : { $eq: id } }],
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
          OrderId:1,
          shopId:1,
          date:1,
          time:1,
          OrderId:1,
          deliveryExecutiveId:1,
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
        $and: [{deliveryExecutiveId : { $eq: id } }],
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
  return {datas: datas, total: total.length};
};


const groupIdClick = async(id)=>{
  let data = []
  let getDetails = await wardAdminGroup.findById(id);
  getDetails.Orderdatas.forEach((e) =>{
 
    data.push(e)
  })
  return data;
}

const orderIdClickGetProduct = async(id)=>{
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
        localField:'productid',
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
        product:'$productsData.productTitle',
        productId:'$productsData._id',
      }
    }

  ]);

  return getDetails;

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

};
