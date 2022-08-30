const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { ShopOrderClone } = require('../models/shopOrder.model');
const moment = require('moment');
const { ProductorderClone } = require('../models/shopOrder.model');
const { Shop } = require('../models/b2b.ShopClone.model');
const { Users } = require('../models/B2Busers.model');
const Roles = require('../models/roles.model');
const wardAdminGroup = require('../models/b2b.wardAdminGroup.model');
const wardAdminGroupDetails = require('../models/b2b.wardAdminGroupDetails.model');

// GET DETAILS


const getdetails =async (limit,page) => {
  let values = await ShopOrderClone.aggregate([
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId', //Uid
        foreignField: '_id', //Uid
        as: 'userData',
      },
    },
    {
      $unwind: '$userData',
    },
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'orderId',
        as: 'orderData',
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'Uid',
        foreignField: '_id',
        as: 'userNameData',
      },
    },
    //    { unwind: '$userNameData'},

    {
      $project: {
        shopId: 1,
        OrderId: 1,
        status: 1,
        overallTotal: 1,
        name: '$userNameData.name',

        shopType: '$userData.type',
        shopName: '$userData.SName',
        // UserName: '$userData.name',
        // orderId: '$orderData.orderId',
        totalItems: { $size: '$orderData' },
      },
    },
    { $skip: parseInt(limit) * page },
    { $limit: parseInt(limit) },
  ]);

  let total = await ShopOrderClone.find().count();
  //   {
  //     $lookup: {
  //       from: 'b2bshopclones',
  //       localField: 'shopId', //Uid
  //       foreignField: '_id', //Uid
  //       as: 'userData',
  //     },
  //   },
  //   {
  //     $unwind: '$userData',
  //   },
  //   {
  //     $lookup: {
  //       from: 'productorderclones',
  //       localField: '_id',
  //       foreignField: 'orderId',
  //       as: 'orderData',
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: 'b2busers',
  //       localField: 'Uid',
  //       foreignField: '_id',
  //       as: 'userNameData',
  //     },
  //   },
  // ]).limit(parseInt(limit));

  return { values: values, total: total };
};

// GET PRODUCT DETAILS

// const getproductdetails = async (id) => {
//     let getproduct = await ShopOrderClone.findById(id)
//     return getproduct;
// }

const getproductdetails = async (id) => {
  let values = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shopData',
      },
    },
    {
      $unwind: '$shopData',
    },

    {
      $project: {
        shopName: '$shopData.SName',
        product: 1,
        shopId: 1,
        status: 1,
        OrderId: 1,
        overallTotal: 1,
        // deliveryExecutiveId:1,
      },
    },
  ]);
  return values;
};

// UPDATE PRODUCT DETAILS

const updateProduct = async (id, updateBody) => {
  let product = await ProductorderClone.findById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'product not found');
  }
  product = await ProductorderClone.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return product;
};

const updateStatusApprovedOrModified = async (id , updateBody) =>{
  let product = await ShopOrderClone.findById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'product not found');
  }
  product = await ShopOrderClone.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return product;
}

//  UPDATE STATUS REJECTION

const updateRejected = async (body) => {
  // let rejected = await ShopOrderClone.findById(id);
  // console.log(rejected);
  // if (!rejected) {
  //   throw new ApiError(httpStatus.NOT_FOUND, ' not found');
  // }
  // rejected = await ShopOrderClone.findByIdAndUpdate({ _id: id }, { status: status }, { new: true });
  // console.log(rejected);
  // return rejected;
  // statusUpdate = await ShopOrderClone.updateMany(  { $set: { status: "Acknowledged"}})
  // return statusUpdate;

  // var IdDatas = [];
  // IdDatas.forEach(async (e) =>{
  //   await ShopOrderClone.findByIdAndUpdate( {status: "Acknowledged"});

  // });
  // return "successfully Updated";

  let { arr } = JSON.stringify(body);
  console.log(body);
  body.arr.forEach(async (e) => {
    await ShopOrderClone.findByIdAndUpdate({ _id: e }, { status: 'Acknowledged' }, { new: true });
  });

  return 'status updated successfully';
};

//WARD LOADING EXECUTIVE

const wardloadExecutive = async (page) => {
  let data = await ShopOrderClone.aggregate([
    {
      $match: {
        $or: [
          { status: { $eq: 'Approved' } },
          { status: { $eq: 'Modified' } },
          { status: { $eq: 'Packed' } },
          { status: { $eq: 'Billed' } },
          { status: { $eq: 'Assigned' } },
        ],
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId', //Uid
        foreignField: '_id', //Uid
        as: 'b2bshopclonesData',
      },
    },
    {
      $unwind: '$b2bshopclonesData',
    },

    {
      $project: {
        shopId: 1,
        status: 1,
        OrderId: 1,
        SName: '$b2bshopclonesData.SName',
        type: '$b2bshopclonesData.type',
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  let total = await ShopOrderClone.aggregate([
    {
      $match: {
        $or: [
          { status: { $eq: 'Approved' } },
          { status: { $eq: 'Modified' } },
          { status: { $eq: 'Packed' } },
          { status: { $eq: 'Billed' } },
          { status: { $eq: 'Assigned' } },
        ],
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId', //Uid
        foreignField: '_id', //Uid
        as: 'b2bshopclonesData',
      },
    },
    {
      $unwind: '$b2bshopclonesData',
    },
    {
      $project: {
        shopId: 1,
        status: 1,
        OrderId: 1,
        SName: '$b2bshopclonesData.SName',
        type: '$b2bshopclonesData.type',
      },
    },
  ]);
  return { data: data, total: total.length };
};

const updateStatusForAssugnedAndPacked = async (id, status) => {
  let statusUpdate = await ShopOrderClone.findById(id);
  console.log(statusUpdate);
  if (!statusUpdate) {
    throw new ApiError(httpStatus.NOT_FOUND, ' not found');
  }
  statusUpdate = await ShopOrderClone.findByIdAndUpdate({ _id: id }, { status: status }, { new: true });
  console.log(statusUpdate);
  return statusUpdate;
};

// TRACK STATUS FOR PRODUCT STATUS
const updateBilled = async (id) => {
  let serverdates = moment().format('YYYY-MM-DD');
  let servertime = moment().format('hh:mm a');

  let productOrderBilled = await ShopOrderClone.findById(id);
  if (!productOrderBilled || productOrderBilled.status == 'Billed') {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'productOrderBilled not found OR Already Billed');
  }
  let createBill = await ShopOrderClone.find({ billDate: serverdates }).count();
  console.log(createBill);
  if (createBill < 9) {
    center = '0000';
  }
  if (createBill < 99 && createBill >= 9) {
    center = '000';
  }
  if (createBill < 999 && createBill >= 99) {
    center = '00';
  }
  if (createBill < 9999 && createBill >= 999) {
    center = '0';
  }
  let billId = '';
  let total = parseInt(createBill) + 1;
  let concat = center + total;
  billId = concat;
  await ShopOrderClone.findByIdAndUpdate(
    { _id: id },
    { billNo: billId, billDate: serverdates, billTime: servertime, status: 'Billed', AssignedStatus: 'Billed' },
    { new: true }
  );
  return productOrderBilled;
};

const deliveryExecutive = async (id, body) => {
  const { deliveryExecutiveId } = body;
  let delivery = await ShopOrderClone.findById(id);
  if (!delivery) {
    throw new ApiError(httpStatus.NOT_FOUND, 'delivery not found');
  }
  delivery = await ShopOrderClone.findByIdAndUpdate(
    { _id: id },
    { deliveryExecutiveId: deliveryExecutiveId, status: 'Assigned' },
    { new: true }
  );
  return delivery;
};

const createdata = async (Orderdatas) => {
  const { Orderdatass, deliveryExecutiveId } = Orderdatas;
  console.log(Orderdatas);
  Orderdatass.forEach(async (e) => {
    await ShopOrderClone.findByIdAndUpdate({ _id: e._id }, { deliveryExecutiveId: deliveryExecutiveId, status: 'Assigned' });
  });
  // const data = await ShopOrderClone.create(Orderdatas)
  return 'success';
};

const createArrayData = async (pettyStockData) => {
  var Orderdatass = [];
  var groupId;
  // const { Orderdatass, _id } = pettyStockData;
  console.log(pettyStockData);
  Orderdatass.forEach(async (e) => {
    await wardAdminGroupDetails.findByIdAndUpdate({ _id: e._id }, { groupId: groupId, status: 'Assigned' });
  });
  const data = await wardAdminGroupDetails.create(pettyStockData);
  return 'success';
};

// AFTER PACKED BY WARD LOADING EXECUTE

const wardloadExecutivePacked = async (page) => {
  let data = await ShopOrderClone.aggregate([
    {
      $match: {
        status: {
          $in: ['Packed'],
        },
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shopData',
      },
    },
    { $unwind: '$shopData' },
    {
      $lookup: {
        from: 'streets',
        localField: 'shopData.Strid',
        foreignField: '_id',
        as: 'streetsData',
      },
    },
    { $unwind: '$streetsData' },
    {
      $lookup: {
        from: 'wards',
        localField: 'streetsData.wardId',
        foreignField: '_id',
        as: 'wardData',
      },
    },
    { $unwind: '$wardData' },

    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [{ $group: { _id: null, Qty: { $sum: '$quantity' } } }],
        as: 'orderData',
      },
    },
    { $unwind: '$orderData' },
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'orderId',
        as: 'orderDatafortotal',
      },
    },
    // shoporderClon
    {
      $project: {
        _id: 1,
        date: 1,
        time: 1,
        shopId: 1,
        productStatus: 1,
        status: 1,
        OrderId: 1,
        type: '$shopData.type',
        Slat: '$shopData.Slat',
        Slong: '$shopData.Slong',
        street: '$streetsData.street',
        // orderId: '$orderDatafortotal.orderId',
        // orderDate: '$orderDatafortotal.date',
        // orderTime: '$orderDatafortotal.time',
        totalItems: { $size: '$orderDatafortotal' },
        Qty: '$orderData.Qty',
        // totalcount: '$orderData.totalItems'
        shopcloneId: '$shopData._id',
        shopName: '$shopData.SName', //
        streetName: '$shopData.street',
        ward: '$wardData.ward',
      },
    },

    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  let total = await ShopOrderClone.aggregate([
    {
      $match: {
        status: {
          $in: ['Packed'],
        },
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shopData',
      },
    },
    { $unwind: '$shopData' },
    {
      $lookup: {
        from: 'streets',
        localField: 'shopData.Strid',
        foreignField: '_id',
        as: 'streetsData',
      },
    },
    { $unwind: '$streetsData' },
    {
      $lookup: {
        from: 'wards',
        localField: 'streetsData.wardId',
        foreignField: '_id',
        as: 'wardData',
      },
    },
    { $unwind: '$wardData' },

    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [{ $group: { _id: null, Qty: { $sum: '$quantity' } } }],
        as: 'orderData',
      },
    },
    { $unwind: '$orderData' },
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'orderId',
        as: 'orderDatafortotal',
      },
    },
  ]);
  return { data: data, total: total.length };
};
const wardDeliveryExecutive = async () => {
  let data = await Roles.aggregate([
    {
      $match: {
        roleName: {
          $in: ['Ward delivery execute(WDE)'],
        },
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: '_id',
        foreignField: 'userRole',
        as: 'deliveryExecutiveName',
      },
    },

    // {
    //     $project: {
    //         _id:1,
    //         roleName: 1,
    //         deliveryExecutiveName: '$deliveryExecutiveName.name',
    //         deliveryExecutive: '$deliveryExecutiveName._id'
    //     }
    // }
  ]);
  return data;
};

module.exports = {
  getdetails,
  getproductdetails,
  updateProduct,
  // updateAcknowledge,
  deliveryExecutive,
  // updateApproved,
  // updateModified,
  updateRejected,

  //WARD LOADING EXECUTIVE
  wardloadExecutive,
  updateBilled,

  wardloadExecutivePacked,
  wardDeliveryExecutive,

  // create data
  createdata,
  createArrayData,
  updateStatusForAssugnedAndPacked,

  updateStatusApprovedOrModified,
};
