const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { ShopOrderClone } = require('../models/shopOrder.model');
const { ProductorderClone } = require('../models/shopOrder.model');
const { Shop } = require('../models/b2b.ShopClone.model');
const { Users } = require('../models/B2Busers.model');
const Roles = require('../models/roles.model');
const { wardAdminGroup } = require('../models/b2b.wardAdminGroup.model');
const moment = require('moment');
// GET DETAILS

const getdetails = async (page) => {
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
    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  let total = await ShopOrderClone.aggregate([
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
  ]);

  return { values: values, total: total.length };
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

//  UPDATE STATUS REJECTION

const updateRejected = async (id, status) => {
  let rejected = await ShopOrderClone.findById(id);
  console.log(rejected);
  if (!rejected) {
    throw new ApiError(httpStatus.NOT_FOUND, ' not found');
  }
  rejected = await ShopOrderClone.findByIdAndUpdate({ _id: id }, { status: status }, { new: true });
  console.log(rejected);
  return rejected;
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
// TRACK STATUS FOR PRODUCT STATUS
const updateBilled = async (id, status) => {
  let productOrderBilled = await ShopOrderClone.findById(id);
  if (!productOrderBilled) {
    throw new ApiError(httpStatus.NOT_FOUND, 'productOrderBilled not found');
  }
  productOrderBilled = await ShopOrderClone.findByIdAndUpdate({ _id: id }, { status: status }, { new: true });
  console.log(productOrderBilled);
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

    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $lookup: {
              from: 'packtypes',
              localField: 'packtypeId',
              foreignField: '_id',
              as: 'packtypesData',
            },
          },
          { $unwind: '$packtypesData' },
          {
            $project: {
              total: {
                $sum: {
                  $multiply: ['$packtypesData.quantity', '$quantity'],
                },
              },
              unit: 1,
            },
          },
        ],
        as: 'productOrderCloneData',
      },
    },
    // { $unwind: '$productOrderCloneData' },
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
        productOrderCloneData: '$productOrderCloneData',
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

const getAssigned_details = async () => {
  const currentDate = moment().format('YYYY-MM-DD');
  let values = await wardAdminGroup.aggregate([
    {
      $match: { assignDate: currentDate, status: 'Assigned' },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'deliveryExecutiveId',
        foreignField: '_id',
        as: 'deliveryexecute',
      },
    },
    {
      $unwind: '$deliveryexecute',
    },
    {
      $project: {
        _id: 1,
        status: 1,
        deliveryExecutiveId: 1,
        totalOrders: 1,
        groupId: 1,
        assignDate: 1,
        assignTime: 1,
        deliveryexecuteName: '$deliveryexecute.name',
      },
    },
  ]);
  return values;
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
  getAssigned_details,
};
