const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
let currentDate = moment().format('DD-MM-YYYY');
const { Shop } = require('../models/b2b.ShopClone.model');
const { ShopOrderClone } = require('../models/shopOrder.model');
const { ProductorderClone } = require('../models/shopOrder.model');
const wardAdminGroup = require('../models/b2b.wardAdminGroup.model');
const wardAdminGroupDetails = require('../models/b2b.wardAdminGroupDetails.model');

const createGroup = async (body, userid) => {
  let serverdates = moment().format('DD-MM-yyyy');
  const group = await wardAdminGroup.find({ date: serverdates });
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
  let { product } = body;
  let values = { ...body, ...{ Uid: userId } };
  let wardAdminGroupcreate = await wardAdminGroup.create(values);
  let serverdate = moment().format('DD-MM-yyyy');
  let servertime = moment().format('hh:mm a');
  if (product.length == 0) {
    throw new ApiError(httpStatus.NO_CONTENT, 'Fields Missing');
  }
  console.log(wardAdminGroupcreate);
  product.forEach(async (e) => {
    wardAdminGroupDetails.create({
      shopId: e.shopId,
      // OrderId: OrderId,
      // assignDate: assignDate,
      // assignTime: assignTime,
      // groupId: values.Uid,
      productid: e.productid,
      quantity: e.quantity,
      priceperkg: e.priceperkg,
      orderedTime: servertime,
      date: serverdate,
      wardadmingroupsId: wardAdminGroupcreate.id,
    });
  });
  return wardAdminGroupcreate;
};

const updateOrderStatus = async (id, status) => {
  let deliveryStatus = await wardAdminGroup.findById(id);
  console.log(deliveryStatus);
  if (!deliveryStatus) {
    throw new ApiError(httpStatus.NOT_FOUND, 'status not found');
  }
  deliveryStatus = await wardAdminGroup.findByIdAndUpdate({ _id: id }, { status: status }, { new: true });
  console.log(deliveryStatus);
  return deliveryStatus;
};

// GET ORDER DETAILS FROM GROUP BY ID

const getOrderFromGroupById = async (id) => {
  let getDetails = await wardAdminGroup.findById(id);
  return getDetails;
};

// const getPettyStock = async (id) => {
//   let values = await wardAdminGroup.aggregate([

//     {
//       $group: {
//         _id: "$productName",
//         TotalQuantity: { $sum: "$quantity" }
//       }
//     }
//   ])
//   return values;
// }

const getPettyStock = async (id) => {
  let values = await wardAdminGroup.aggregate([
    {
      $match: {
        _id: { $eq: id },
      },
    },
  ]);
  // console.log(values);
  return values;
};

// const updateOrderStatus = async (id,status)=>{
//   let deliveryStatus = await wardAdminGroup.findById(id);

//   if(!deliveryStatus){
//     throw new ApiError(httpStatus.NOT_FOUND, 'not found')
//   }
//   deliveryStatus = await wardAdminGroup.findByIdAndUpdate({_id: id},status, { new: true });
//   console.log(deliveryStatus)
//   return deliveryStatus;
// }

// const getDeliveryDetails = async(page) =>{

//   let values = await ShopOrderClone.aggregate([
//     {
//       $lookup: {
//           from: 'b2bshopclones',
//           localField: 'shopId',
//           foreignField: '_id',
//           as: 'shopData',
//       }
//   },
//   { $unwind: '$shopData' },
//   {
//       $lookup: {
//           from: 'streets',
//           localField: 'shopData.Strid',
//           foreignField: '_id',
//           as: 'streetsData',
//       }
//   },
//   { $unwind: '$streetsData'},

//   {
//       $lookup: {
//           from: 'productorderclones',
//           localField: '_id',
//           foreignField: 'orderId',
//           pipeline: [
//               { $group: { _id: null, Qty: { $sum: '$quantity' }, } },
//           ],
//           as: 'orderData',
//       }
//   },
//   { $unwind: '$orderData' },
//   {
//       $lookup: {
//           from: 'productorderclones',
//           localField: '_id',
//           foreignField: 'orderId',
//           as: 'orderDatafortotal',
//       }
//   },

//   {
//       $project: {
//           _id:1,
//           date:1,
//           time:1,
//           // productStatus:1,
//           status:1,
//           OrderId:1,
//           type: '$shopData.type',
//           street: '$streetsData.street',
//           // orderId: '$orderDatafortotal.orderId',
//           // orderDate: '$orderDatafortotal.date',
//           // orderTime: '$orderDatafortotal.time',
//           totalItems: { $size: "$orderDatafortotal" },
//           // Qty: "$orderData.Qty",
//           // totalcount: '$orderData.totalItems'
//       }
//   },
//   { $skip: 10 * page },
//   { $limit: 10 },
//   ]);
//   return values;

// }

module.exports = {
  createGroup,
  updateOrderStatus,
  getOrderFromGroupById,

  getPettyStock,

  // DELEIVERY DETAILS
  // getDeliveryDetails,
};
