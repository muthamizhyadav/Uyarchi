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

const updateAcknowledgeSingle = async (id, updateBody) => {
  let product = await ShopOrderClone.findById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  product = await ShopOrderClone.findByIdAndUpdate(
    { _id: id },
    { status: 'Acknowledged', statusUpdate: moment() },
    { new: true }
  );
  return product;
};

const updateApprovedMultiSelect = async (body) => {
  body.arr.forEach(async (e) => {
    await ShopOrderClone.findByIdAndUpdate({ _id: e }, { status: 'Approved', statusUpdate: moment() }, { new: true });
  });

  return 'status updated successfully';
};
const updateRejectMultiSelect = async (body) => {
  body.arr.forEach(async (e) => {
    await ShopOrderClone.findByIdAndUpdate({ _id: e }, { status: 'Rejected', statusUpdate: moment() }, { new: true });
  });
  return 'status updated successfully';
};

const updatePackedMultiSelect = async (body) => {
  body.arr.forEach(async (e) => {
    await ShopOrderClone.findByIdAndUpdate({ _id: e }, { status: 'Packed', statusUpdate: moment() }, { new: true });
  });
  return 'status updated successfully';
};

const updateStatusApprovedOrModified = async (id, updateBody) => {
  let product = await ShopOrderClone.findById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  product = await ShopOrderClone.findByIdAndUpdate(
    { _id: id },
    { status: 'Approved', statusUpdate: moment() },
    { new: true }
  );
  return product;
};
const updateStatusModifiedOrModified = async (id, updateBody) => {
  let product = await ShopOrderClone.findById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  product = await ShopOrderClone.findByIdAndUpdate(
    { _id: id },
    { status: 'Modified', statusUpdate: moment() },
    { new: true }
  );
  return product;
};
const updateStatusrejectOrModified = async (id) => {
  let product = await ShopOrderClone.findById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  product = await ShopOrderClone.findByIdAndUpdate(
    { _id: id },
    { status: 'Rejected', statusUpdate: moment() },
    { new: true }
  );
  return product;
};

const updateStatusForAssugnedAndPacked = async (id, updateBody) => {
  let statusUpdate = await ShopOrderClone.findById(id);
  console.log(statusUpdate);
  if (!statusUpdate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  statusUpdate = await ShopOrderClone.findByIdAndUpdate(
    { _id: id },
    { status: 'Packed', statusUpdate: moment() },
    { new: true }
  );
  // console.log(statusUpdate);
  return statusUpdate;
};

// GET PRODUCT DETAILS

const getproductdetails = async (id) => {
  let values = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    // {
    //   $unwind: '$product',
    // },
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $match: { $and: [{ finalQuantity: { $ne: null } }, { finalQuantity: { $ne: 0 } }] },
          },
          {
            $lookup: {
              from: 'products',
              localField: 'productid',
              foreignField: '_id',
              as: 'nameData',
            },
          },
          {
            $unwind: '$nameData',
          },
          {
            $project: {
              finalQuantity: 1,
              priceperkg: 1,
              productid: 1,
              productTitle: '$nameData.productTitle',
              productpacktypeId: 1,
            },
          },
        ],
        as: 'productData',
      },
    },
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $group: {
              _id: null,
              amount: {
                $sum: {
                  $multiply: ['$finalQuantity', '$priceperkg'],
                },
              },
            },
          },
        ],
        as: 'productDatadetails',
      },
    },
    {
      $unwind: {
        path: '$productDatadetails',
        preserveNullAndEmptyArrays: true,
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
        productData: '$productData',
        shopName: '$shopData.SName',
        shopAddress: '$shopData.address',
        shopId: 1,
        status: 1,
        OrderId: 1,
        total: '$productDatadetails.amount',
      },
    },
  ]);
  if (values.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'order not found');
  }
  return values[0];
};

// UPDATE PRODUCT DETAILS

const updateProduct = async (id, updateBody) => {
  let product = await ShopOrderClone.findById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'order not found');
  }
  updateBody.product.forEach(async (e) => {
    if ((await ProductorderClone.findById(e._id).finalQuantity) != e.quantity) {
      await ProductorderClone.findByIdAndUpdate(
        { _id: e._id },
        { finalQuantity: e.quantity, status: 'Modified' },
        { new: true }
      );
    }
  });
  product = await ShopOrderClone.findByIdAndUpdate({ _id: id }, { status: 'Modified' }, { new: true });
  return product;
};

//  UPDATE STATUS REJECTION

const updateRejected = async (body) => {
  body.arr.forEach(async (e) => {
    await ShopOrderClone.findByIdAndUpdate({ _id: e }, { status: 'Acknowledged', statusUpdate: moment() }, { new: true });
  });

  return 'status updated successfully';
};

//WARD LOADING EXECUTIVE

const wardloadExecutivepacked = async (status, date, page) => {
  if (status == 'null') {
  } else {
  }
  let data = await ShopOrderClone.aggregate([
    {
      $match: {
        $or: [
          { status: { $eq: 'Approved' } },
          { status: { $eq: 'Modified' } },
          // { status: { $eq: 'Packed' } },
          // { status: { $eq: 'Billed' } },
          // { status: { $eq: 'Assigned' } },
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
        completeStatus: 1,
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
          // { status: { $eq: 'Packed' } },
          // { status: { $eq: 'Billed' } },
          // { status: { $eq: 'Assigned' } },
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
const wardloadExecutive = async (page) => {
  let data = await ShopOrderClone.aggregate([
    {
      $match: {
        $or: [
          { status: { $eq: 'Approved' } },
          { status: { $eq: 'Modified' } },
          // { status: { $eq: 'Packed' } },
          // { status: { $eq: 'Billed' } },
          // { status: { $eq: 'Assigned' } },
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
        completeStatus: 1,
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
          // { status: { $eq: 'Packed' } },
          // { status: { $eq: 'Billed' } },
          // { status: { $eq: 'Assigned' } },
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

const wardloadExecutivePacked = async (range, page) => {
  console.log(range);
  // console.log(status);
  let today = moment().format('yyyy-MM-DD');
  let yesterday = moment().subtract(1, 'days').format('yyyy-MM-DD');
  let dateMatch = {
    $or: [
      { date: { $eq: yesterday }, delivery_type: { $eq: 'NDD' } },
      { date: { $eq: today }, delivery_type: { $eq: 'IMD' } },
    ],
  };

  let data = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: ['Approved', 'Modified'],
            },
          },
          {
            time_of_delivery: { $eq: range },
          },
          dateMatch,
        ],
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
        delivery_type: 1,
        time_of_delivery: 1,
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
        locality: '$streetsData.locality',
        area: '$streetsData.area',
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
        $and: [
          {
            status: {
              $in: ['Approved', 'Modified'],
            },
          },
          {
            time_of_delivery: { $eq: range },
          },
          dateMatch,
        ],
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
//   let data = await wardAdminGroup.aggregate([
//              {
//             $match: {
//               $and: [
//                 {
//                   manageDeliveryStatus: {
//                     $nin : [
//                       'Delivery start',
//                     ],
//                   },
//                 },
//         ],
//       },
//     },
//     {
//       $lookup: {
//         from :'b2busers',
//         localField: 'deliveryExecutiveId',
//         foreignField: '_id',
//         as: 'deliveryExecutiveName',
//       }
//     },
//     {
//       $unwind: "$deliveryExecutiveName"
//     },
// //     {
// //       $match: {
// //         roleName: {
// //           $in: ['Ward delivery execute(WDE)'],
// //         },
// //       },
// //     },
// //     {
// //       $lookup: {
// //         from: 'b2busers',
// //         localField: '_id',
// //         foreignField: 'userRole',
// //         as: 'deliveryExecutiveName',
// //       },
// //     },
// //     {
// //       $lookup: {
// //         from: 'shoporderclones',
// //         localField: 'deliveryExecutiveName._id',
// //         foreignField: 'deliveryExecutiveId',
// //         pipeline: [
// //           {
// //             $match: {
// //               $and: [
// //                 {
// //                   status: {
// //                     $nin : [
// //                       'Delivery start',
// //                     ],
// //                   },
// //                 },
// //         ],
// //       },
// //     },
// //   ] ,
// //   as:'statusData'
// //   }
// // }

//   ]);
//   return data;
// };

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
      $lookup: {
        from: 'orderassigns',
        localField: '_id',
        foreignField: 'wardAdminGroupID',
        pipeline: [
          {
            $lookup: {
              from: 'productorderclones',
              localField: 'orderId',
              foreignField: 'orderId',
              pipeline: [
                {
                  $group: { _id: '$unit', value: { $sum: '$finalQuantity' } },
                },
              ],
              as: 'productorderclones',
            },
          },

          {
            $project: {
              productorderclones: '$productorderclones',

              _id: 1,
            },
          },
        ],
        as: 'orderassigns',
      },
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
        orderassigns: '$orderassigns',
        route: 1,
      },
    },
  ]);
  return values;
};

const getdetailsDataStatusOdered = async (type, time, status, limit, page) => {
  // console.log(status);
  let today = moment().format('yyyy-MM-DD');
  let yesterday = moment().subtract(1, 'days').format('yyyy-MM-DD');
  console.log(yesterday);
  let dateMatch = { date: { $eq: today } };
  let typeMatch = { delivery_type: { $eq: type } };
  if (type == 'All') {
    typeMatch = {
      $or: [
        { date: { $eq: yesterday }, delivery_type: { $eq: 'NDD' } },
        { date: { $eq: today }, delivery_type: { $eq: 'IMD' } },
      ],
    };
    dateMatch = {
      $or: [
        { date: { $eq: yesterday }, delivery_type: { $eq: 'NDD' } },
        { date: { $eq: today }, delivery_type: { $eq: 'IMD' } },
      ],
    };
  }
  if (type == 'NDD') {
    dateMatch = { date: { $eq: yesterday } };
  }
  // console.log(dateMatch);
  let statusMatch;
  if (status != 'null') {
    statusMatch = {
      status: { $eq: status },
    };
  }
  let values = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [statusMatch, { time_of_delivery: { $eq: time } }, typeMatch, dateMatch],
      },
    },
    {
      $sort: {
        date: -1,
        time: -1,
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
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
    {
      $project: {
        shopId: 1,
        OrderId: 1,
        status: 1,
        Payment: 1,
        delivery_type: 1,
        overallTotal: 1,
        name: '$userNameData.name',
        shopType: '$userData.type',
        shopName: '$userData.SName',
        totalItems: { $size: '$orderData' },
        created: 1,
      },
    },
    { $skip: parseInt(limit) * page },
    { $limit: parseInt(limit) },
  ]);
  let total = await ShopOrderClone.aggregate([
    {
      $sort: {
        date: -1,
        time: -1,
      },
    },
    {
      $match: {
        $and: [statusMatch, { time_of_delivery: { $eq: time } }, typeMatch, dateMatch],
      },
    },
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
  let AcknowledgedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'Acknowledged' } }, { time_of_delivery: { $eq: time } }, typeMatch, dateMatch] } },
  ]);
  let orderedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'ordered' } }, { time_of_delivery: { $eq: time } }, typeMatch, dateMatch] } },
  ]);
  let ApprovedStatusCount = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: [
                'Approved',
                'Modified',
                'Packed',
                'Assigned',
                'Order Picked',
                'Delivery start',
                'Delivered',
                'UnDelivered',
              ],
            },
          },
          { time_of_delivery: { $eq: time } },
          typeMatch,
          dateMatch,
        ],
      },
    },
  ]);
  let ModifiedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'Modified' } }, { time_of_delivery: { $eq: time } }, typeMatch, dateMatch] } },
  ]);
  let rejectedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'Rejected' } }, { time_of_delivery: { $eq: time } }, typeMatch, dateMatch] } },
  ]);
  let count = {
    AcknowledgedStatusCount: AcknowledgedStatusCount.length,
    orderedStatusCount: orderedStatusCount.length,
    ApprovedStatusCount: ApprovedStatusCount.length,
    ModifiedStatusCount: ModifiedStatusCount.length,
    rejectedStatusCount: rejectedStatusCount.length,
  };
  return { values: values, total: total.length, count: count };
};
// req.params.type, req.params.time, req.params.status, req.params.limit, req.params.page;
const getdetailsDataStatusAcknowledged = async (type, time, status, limit, page) => {
  let today = moment().format('yyyy-MM-DD');
  let yesterday = moment().subtract(1, 'days').format('yyyy-MM-DD');
  console.log(yesterday);
  let dateMatch = { date: { $eq: today } };
  let typeMatch = { delivery_type: { $eq: type } };
  if (type == 'All') {
    typeMatch = {
      $or: [
        { date: { $eq: yesterday }, delivery_type: { $eq: 'NDD' } },
        { date: { $eq: today }, delivery_type: { $eq: 'IMD' } },
      ],
    };
    dateMatch = {
      $or: [
        { date: { $eq: yesterday }, delivery_type: { $eq: 'NDD' } },
        { date: { $eq: today }, delivery_type: { $eq: 'IMD' } },
      ],
    };
  }
  if (type == 'NDD') {
    dateMatch = { date: { $eq: yesterday } };
  }
  // console.log(dateMatch);
  let statusMatch;
  if (status != 'null') {
    statusMatch = {
      status: { $eq: status },
    };
  }

  let values = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [statusMatch, { time_of_delivery: { $eq: time } }, typeMatch, dateMatch],
      },
    },
    {
      $sort: {
        date: -1,
        time: -1,
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
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
        pipeline: [
          {
            $match: { $and: [{ finalQuantity: { $ne: null } }, { finalQuantity: { $ne: 0 } }] },
          },
        ],
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
    {
      $project: {
        shopId: 1,
        OrderId: 1,
        status: 1,
        Payment: 1,
        delivery_type: 1,
        overallTotal: 1,
        name: '$userNameData.name',
        shopType: '$userData.type',
        shopName: '$userData.SName',
        totalItems: { $size: '$orderData' },
        created: 1,
      },
    },
    { $skip: parseInt(limit) * page },
    { $limit: parseInt(limit) },
  ]);
  let total = await ShopOrderClone.aggregate([
    {
      $sort: {
        date: -1,
        time: -1,
      },
    },
    {
      $match: {
        $and: [statusMatch, { time_of_delivery: { $eq: time } }, typeMatch, dateMatch],
      },
    },
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
    //  { unwind: '$userNameData'},
  ]);
  let AcknowledgedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'Acknowledged' } }, { time_of_delivery: { $eq: time } }, typeMatch, dateMatch] } },
  ]);
  let orderedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'ordered' } }, { time_of_delivery: { $eq: time } }, typeMatch, dateMatch] } },
  ]);
  let ApprovedStatusCount = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: [
                'Approved',
                'Modified',
                'Packed',
                'Assigned',
                'Order Picked',
                'Delivery start',
                'Delivered',
                'UnDelivered',
              ],
            },
          },
          { time_of_delivery: { $eq: time } },
          typeMatch,
          dateMatch,
        ],
      },
    },
  ]);
  let ModifiedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'Modified' } }, { time_of_delivery: { $eq: time } }, typeMatch, dateMatch] } },
  ]);
  let rejectedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'Rejected' } }, { time_of_delivery: { $eq: time } }, typeMatch, dateMatch] } },
  ]);
  let count = {
    AcknowledgedStatusCount: AcknowledgedStatusCount.length,
    orderedStatusCount: orderedStatusCount.length,
    ApprovedStatusCount: ApprovedStatusCount.length,
    ModifiedStatusCount: ModifiedStatusCount.length,
    rejectedStatusCount: rejectedStatusCount.length,
  };

  return { values: values, total: total.length, count: count };
};

const getdetailsDataStatusRejected = async (type, time, status, limit, page) => {
  let today = moment().format('yyyy-MM-DD');
  let yesterday = moment().subtract(1, 'days').format('yyyy-MM-DD');
  console.log(yesterday);
  let dateMatch = { date: { $eq: today } };
  let typeMatch = { delivery_type: { $eq: type } };
  if (type == 'All') {
    typeMatch = {
      $or: [
        { date: { $eq: yesterday }, delivery_type: { $eq: 'NDD' } },
        { date: { $eq: today }, delivery_type: { $eq: 'IMD' } },
      ],
    };
    dateMatch = {
      $or: [
        { date: { $eq: yesterday }, delivery_type: { $eq: 'NDD' } },
        { date: { $eq: today }, delivery_type: { $eq: 'IMD' } },
      ],
    };
  }
  if (type == 'NDD') {
    dateMatch = { date: { $eq: yesterday } };
  }
  // console.log(dateMatch);
  let statusMatch;
  if (status != 'null') {
    statusMatch = {
      status: { $eq: status },
    };
  }
  let values = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [statusMatch, { time_of_delivery: { $eq: time } }, typeMatch, dateMatch],
      },
    },
    {
      $sort: {
        date: -1,
        time: -1,
      },
    },
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
    //  { unwind: '$userNameData'},
    {
      $project: {
        shopId: 1,
        OrderId: 1,
        status: 1,
        Payment: 1,
        delivery_type: 1,
        overallTotal: 1,
        name: '$userNameData.name',
        shopType: '$userData.type',
        shopName: '$userData.SName',
        // UserName: '$userData.name',
        // orderId: '$orderData.orderId',
        totalItems: { $size: '$orderData' },
        created: 1,
      },
    },
    { $skip: parseInt(limit) * page },
    { $limit: parseInt(limit) },
  ]);
  let total = await ShopOrderClone.aggregate([
    {
      $sort: {
        date: -1,
        time: -1,
      },
    },
    {
      $match: {
        $and: [statusMatch, { time_of_delivery: { $eq: time } }, typeMatch, dateMatch],
      },
    },
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
    //  { unwind: '$userNameData'},
  ]);
  let AcknowledgedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'Acknowledged' } }, { time_of_delivery: { $eq: time } }, typeMatch, dateMatch] } },
  ]);
  let orderedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'ordered' } }, { time_of_delivery: { $eq: time } }, typeMatch, dateMatch] } },
  ]);
  let ApprovedStatusCount = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: [
                'Approved',
                'Modified',
                'Packed',
                'Assigned',
                'Order Picked',
                'Delivery start',
                'Delivered',
                'UnDelivered',
              ],
            },
          },
          { time_of_delivery: { $eq: time } },
          typeMatch,
          dateMatch,
        ],
      },
    },
  ]);
  let ModifiedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'Modified' } }, { time_of_delivery: { $eq: time } }, typeMatch, dateMatch] } },
  ]);
  let rejectedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'Rejected' } }, { time_of_delivery: { $eq: time } }, typeMatch, dateMatch] } },
  ]);
  let count = {
    AcknowledgedStatusCount: AcknowledgedStatusCount.length,
    orderedStatusCount: orderedStatusCount.length,
    ApprovedStatusCount: ApprovedStatusCount.length,
    ModifiedStatusCount: ModifiedStatusCount.length,
    rejectedStatusCount: rejectedStatusCount.length,
  };
  return { values: values, total: total.length, count: count };
};
const getAppOrModifiedStatus = async (type, time, status, limit, page) => {
  let today = moment().format('yyyy-MM-DD');
  let yesterday = moment().subtract(1, 'days').format('yyyy-MM-DD');
  console.log(yesterday);
  let dateMatch = { date: { $eq: today } };
  let typeMatch = { delivery_type: { $eq: type } };
  if (type == 'All') {
    typeMatch = {
      $or: [
        { date: { $eq: yesterday }, delivery_type: { $eq: 'NDD' } },
        { date: { $eq: today }, delivery_type: { $eq: 'IMD' } },
      ],
    };
    dateMatch = {
      $or: [
        { date: { $eq: yesterday }, delivery_type: { $eq: 'NDD' } },
        { date: { $eq: today }, delivery_type: { $eq: 'IMD' } },
      ],
    };
  }
  if (type == 'NDD') {
    dateMatch = { date: { $eq: yesterday } };
  }
  // console.log(typeMatch);
  // console.log(dateMatch);
  // console.log({ time_of_delivery: { $eq: time } });

  let statusMatch;
  if (status != 'null') {
    statusMatch = {
      // status: { $eq: status }
      status: {
        $in: ['Approved', 'Modified', 'Packed', 'Assigned', 'Order Picked', 'Delivery start', 'Delivered', 'UnDelivered'],
      },
    };
  }
  console.log(statusMatch);

  let values = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [statusMatch, { time_of_delivery: { $eq: time } }, typeMatch, dateMatch],
      },
    },
    {
      $sort: {
        date: -1,
        time: -1,
      },
    },
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
        pipeline: [
          {
            $match: { $and: [{ finalQuantity: { $ne: null } }, { finalQuantity: { $ne: 0 } }] },
          },
        ],
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
    //  { unwind: '$userNameData'},
    {
      $project: {
        shopId: 1,
        OrderId: 1,
        status: 1,
        Payment: 1,
        delivery_type: 1,
        overallTotal: 1,
        name: '$userNameData.name',
        shopType: '$userData.type',
        shopName: '$userData.SName',
        // UserName: '$userData.name',
        // orderId: '$orderData.orderId',
        totalItems: { $size: '$orderData' },
        created: 1,
      },
    },
    { $skip: parseInt(limit) * page },
    { $limit: parseInt(limit) },
  ]);
  let total = await ShopOrderClone.aggregate([
    {
      $sort: {
        date: -1,
        time: -1,
      },
    },
    {
      $match: {
        $and: [statusMatch, { time_of_delivery: { $eq: time } }, typeMatch, dateMatch],
      },
    },
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
    //  { unwind: '$userNameData'},
  ]);
  let AcknowledgedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'Acknowledged' } }, { time_of_delivery: { $eq: time } }, typeMatch, dateMatch] } },
  ]);
  let orderedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'ordered' } }, { time_of_delivery: { $eq: time } }, typeMatch, dateMatch] } },
  ]);
  let ApprovedStatusCount = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: [
                'Approved',
                'Modified',
                'Packed',
                'Assigned',
                'Order Picked',
                'Delivery start',
                'Delivered',
                'UnDelivered',
              ],
            },
          },
          { time_of_delivery: { $eq: time } },
          typeMatch,
          dateMatch,
        ],
      },
    },
  ]);
  let ModifiedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'Modified' } }, { time_of_delivery: { $eq: time } }, typeMatch, dateMatch] } },
  ]);
  let rejectedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'Rejected' } }, { time_of_delivery: { $eq: time } }, typeMatch, dateMatch] } },
  ]);
  let count = {
    AcknowledgedStatusCount: AcknowledgedStatusCount.length,
    orderedStatusCount: orderedStatusCount.length,
    ApprovedStatusCount: ApprovedStatusCount.length,
    ModifiedStatusCount: ModifiedStatusCount.length,
    rejectedStatusCount: rejectedStatusCount.length,
  };
  return { values: values, total: total.length, count: count };
};
const countStatus = async () => {
  let AcknowledgedStatusCount = await ShopOrderClone.find({ status: 'Acknowledged' }).count();
  let orderedStatusCount = await ShopOrderClone.find({ status: 'ordered' }).count();
  let ApprovedStatusCount = await ShopOrderClone.find({ status: 'Approved' }).count();
  let ModifiedStatusCount = await ShopOrderClone.find({ status: 'Modified' }).count();
  let rejectedStatusCount = await ShopOrderClone.find({ status: 'Rejected' }).count();
  return {
    AcknowledgedStatusCount: AcknowledgedStatusCount,
    orderedStatusCount: orderedStatusCount,
    ApprovedStatusCount: ApprovedStatusCount,
    ModifiedStatusCount: ModifiedStatusCount,
    rejectedStatusCount: rejectedStatusCount,
  };
};
module.exports = {
  getdetails,
  getproductdetails,
  updateProduct,
  deliveryExecutive,
  updateRejected,
  //WARD LOADING EXECUTIVE
  wardloadExecutive,
  updateBilled,
  wardloadExecutivePacked,
  wardDeliveryExecutive,
  // create data
  createdata,
  getAssigned_details,
  getdetailsDataStatusOdered,
  getdetailsDataStatusAcknowledged,
  getdetailsDataStatusRejected,
  getAppOrModifiedStatus,
  countStatus,
  updateAcknowledgeSingle,
  updateApprovedMultiSelect,
  updateRejectMultiSelect,
  updateStatusApprovedOrModified,
  updateStatusForAssugnedAndPacked,
  updatePackedMultiSelect,
  updateStatusrejectOrModified,
  updateStatusModifiedOrModified,
  wardloadExecutivepacked,
};
