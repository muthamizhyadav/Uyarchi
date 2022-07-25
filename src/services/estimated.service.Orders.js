const httpStatus = require('http-status');
const Estimated = require('../models/estimatedOrders.mode');
const { ProductorderClone } = require('../models/shopOrder.model');
const { Product, Stock, ConfirmStock, LoadingExecute, BillRaise, ManageBill, ShopList } = require('../models/product.model');
const ApiError = require('../utils/ApiError');

const createEstimatedOrders = async (body) => {
  let estimate = await Estimated.create(body);
  await ProductorderClone.updateMany({ productid: body.productId, date: body.date }, { $set: { preOrderClose: true } });
  return estimate;
};

const getEstimatedByDate = async (date, page) => {
  let values = await Product.aggregate([
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'productid',
        pipeline: [
          { $match: { date: date } },
          { $group: { _id: null, Qty: { $sum: '$quantity' }, Avg: { $avg: '$priceperkg' } } },
        ],
        as: 'productDetails',
      },
    },
    {
      $unwind: '$productDetails',
    },
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'productid',
        pipeline: [
          { $match: { date: date, preOrderClose: { $eq: false } } },
          {
            $lookup: {
              from: 'b2bshopclones',
              localField: 'customerId',
              foreignField: '_id',
              as: 'shopData',
            },
          },
          {
            $unwind: '$shopData',
          },
          {
            $lookup: {
              from: 'shoporderclones',
              localField: 'orderId',
              foreignField: '_id',
              pipeline: [
                {
                  $lookup: {
                    from: 'b2busers',
                    localField: 'Uid',
                    foreignField: '_id',
                    as: 'UsersData',
                  },
                },
                {
                  $unwind: '$UsersData',
                },
                {
                  $project: {
                    userName: '$UsersData.name',
                  },
                },
              ],
              as: 'shoporderclones',
            },
          },
          {
            $unwind: '$shoporderclones',
          },

          {
            $project: {
              shopName: '$shopData.SName',
              orderby: '$shoporderclones.userName',
              quantity: 1,
              priceperkg: 1,
            },
          },
        ],
        as: 'liveStock',
      },
    },
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'productid',
        pipeline: [
          { $match: { date: date, preOrderClose: { $eq: true } } },
          {
            $lookup: {
              from: 'b2bshopclones',
              localField: 'customerId',
              foreignField: '_id',
              as: 'shopData',
            },
          },
          {
            $unwind: '$shopData',
          },
          {
            $lookup: {
              from: 'shoporderclones',
              localField: 'orderId',
              foreignField: '_id',
              pipeline: [
                {
                  $lookup: {
                    from: 'b2busers',
                    localField: 'Uid',
                    foreignField: '_id',
                    as: 'UsersData',
                  },
                },
                {
                  $unwind: '$UsersData',
                },
                {
                  $project: {
                    userName: '$UsersData.name',
                  },
                },
              ],
              as: 'shoporderclones',
            },
          },
          {
            $unwind: '$shoporderclones',
          },

          {
            $project: {
              shopName: '$shopData.SName',
              orderby: '$shoporderclones.userName',
              quantity: 1,
              priceperkg: 1,
            },
          },
        ],
        as: 'orderDetails',
      },
    },
    {
      $lookup: {
        from: 'estimatedorders',
        localField: '_id',
        foreignField: 'productId',
        pipeline: [{ $match: { date: date } }],
        as: 'estimatedDetails',
      },
    },
    {
      $unwind: '$estimatedDetails',
    },
    {
      $limit: 10,
    },
    {
      $skip: 10 * page,
    },
    {
      $project: {
        _id: 1,
        productTitle: 1,
        Qty: '$productDetails.Qty',
        Avg: '$productDetails.Avg',
        orderDetails: '$orderDetails',
        estimatedDetails: '$estimatedDetails',
        estimatedId: '$estimatedDetails._id',
        closedQty: '$estimatedDetails.closedQty',
        avgPrice: '$estimatedDetails.avgPrice',
        estimatedQty: '$estimatedDetails.estimatedQty',
        status: '$estimatedDetails.status',
        estimatedStatus: '$estimatedDetails.estimatedStatus',
        liveStock: '$liveStock',
      },
    },
  ]);
  let total = await Product.aggregate([
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'productid',
        pipeline: [
          { $match: { date: date } },
          { $group: { _id: null, Qty: { $sum: '$quantity' }, Avg: { $avg: '$priceperkg' } } },
        ],
        as: 'productDetails',
      },
    },
    {
      $unwind: '$productDetails',
    },
  ]);
  return { values: values, total: total.length };
};

const getEstimatedByDateforPH = async (date, page) => {
  let values = await Product.aggregate([
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'productid',
        pipeline: [
          { $match: { date: date } },
          { $group: { _id: null, Qty: { $sum: '$quantity' }, Avg: { $avg: '$priceperkg' } } },
        ],
        as: 'productDetails',
      },
    },
    {
      $unwind: '$productDetails',
    },
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'productid',
        pipeline: [
          { $match: { date: date, preOrderClose: { $eq: false } } },
          {
            $lookup: {
              from: 'b2bshopclones',
              localField: 'customerId',
              foreignField: '_id',
              as: 'shopData',
            },
          },
          {
            $unwind: '$shopData',
          },
          {
            $lookup: {
              from: 'shoporderclones',
              localField: 'orderId',
              foreignField: '_id',
              pipeline: [
                {
                  $lookup: {
                    from: 'b2busers',
                    localField: 'Uid',
                    foreignField: '_id',
                    as: 'UsersData',
                  },
                },
                {
                  $unwind: '$UsersData',
                },
                {
                  $project: {
                    userName: '$UsersData.name',
                  },
                },
              ],
              as: 'shoporderclones',
            },
          },
          {
            $unwind: '$shoporderclones',
          },

          {
            $project: {
              shopName: '$shopData.SName',
              orderby: '$shoporderclones.userName',
              quantity: 1,
              priceperkg: 1,
            },
          },
        ],
        as: 'liveStock',
      },
    },
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'productid',
        pipeline: [
          { $match: { date: date, preOrderClose: { $eq: true } } },
          {
            $lookup: {
              from: 'b2bshopclones',
              localField: 'customerId',
              foreignField: '_id',
              as: 'shopData',
            },
          },
          {
            $unwind: '$shopData',
          },
          {
            $lookup: {
              from: 'shoporderclones',
              localField: 'orderId',
              foreignField: '_id',
              pipeline: [
                {
                  $lookup: {
                    from: 'b2busers',
                    localField: 'Uid',
                    foreignField: '_id',
                    as: 'UsersData',
                  },
                },
                {
                  $unwind: '$UsersData',
                },
                {
                  $project: {
                    userName: '$UsersData.name',
                  },
                },
              ],
              as: 'shoporderclones',
            },
          },
          {
            $unwind: '$shoporderclones',
          },

          {
            $project: {
              shopName: '$shopData.SName',
              orderby: '$shoporderclones.userName',
              quantity: 1,
              priceperkg: 1,
            },
          },
        ],
        as: 'orderDetails',
      },
    },
    {
      $lookup: {
        from: 'estimatedorders',
        localField: '_id',
        foreignField: 'productId',
        pipeline: [{ $match: { date: date, estimatedStatus: 'Estimated' } }],
        as: 'estimatedDetails',
      },
    },
    {
      $unwind: '$estimatedDetails',
    },
    {
      $lookup: {
        from: 'status',
        let: { productid: '$productId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$$productid', '$productId'], // <-- This doesn't work. Dont want to use `$unwind` before `$match` stage
              },
            },
          },
          {
            $match: {
              $expr: {
                $eq: [date, '$date'],
              },
            },
          },
        ],
        as: 'productstatus',
      },
    },
    {
      $limit: 10,
    },
    {
      $skip: 10 * page,
    },
    {
      $project: {
        _id: 1,
        productTitle: 1,
        Qty: '$productDetails.Qty',
        Avg: '$productDetails.Avg',
        orderDetails: '$orderDetails',
        estimatedDetails: '$estimatedDetails',
        estimatedId: '$estimatedDetails._id',
        closedQty: '$estimatedDetails.closedQty',
        avgPrice: '$estimatedDetails.avgPrice',
        productstatus:'$productstatus',
        estimatedQty: '$estimatedDetails.estimatedQty',
        status: '$estimatedDetails.status',
        estimatedStatus: '$estimatedDetails.estimatedStatus',
        liveStock: '$liveStock',
      },
    },
  ]);
  let total = await Product.aggregate([
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'productid',
        pipeline: [
          { $match: { date: date } },
          { $group: { _id: null, Qty: { $sum: '$quantity' }, Avg: { $avg: '$priceperkg' } } },
        ],
        as: 'productDetails',
      },
    },
    {
      $unwind: '$productDetails',
    },
  ]);
  return { values: values, total: total.length };
};

const getSingleProductEstimations = async (id) => {
  let values = await Estimated.aggregate([
    {
      $match: { _id: id },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    {
      $unwind: '$productDetails',
    },
    {
      $lookup: {
        from: 'productorderclones',
        let: { date: '$date', productId: '$productId' },
        // localField: 'productId',
        // foreignField: 'productid',
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ['$productid', '$$productId'] }, { $eq: ['$date', '$$date'] }] } } },
          { $group: { _id: null, Qty: { $sum: '$quantity' }, Avg: { $avg: '$priceperkg' } } },
        ],
        as: 'productorders',
      },
    },
    {
      $unwind: '$productorders',
    },
    {
      $lookup: {
        from: 'estimatedorders',
        localField: 'productId',
        foreignField: 'productId',
        pipeline: [
          { $match: { _id: { $ne: id }, estimatedStatus: 'Estimated' } },
          {
            $lookup: {
              from: 'products',
              localField: 'productId',
              foreignField: '_id',
              as: 'productDetails',
            },
          },
          {
            $unwind: '$productDetails',
          },
          {
            $project: {
              status: 1,
              productId: 1,
              closedQty: 1,
              avgPrice: 21,
              date: 1,
              time: 1,
              estimatedQty: 1,
              estimatedStatus: 1,
              productTitle: '$productDetails.productTitle',
            },
          },
          {
            $limit: 5,
          },
          { $sort: { date: -1 } },
        ],
        as: 'oldestimatedorders',
      },
    },
    {
      $project: {
        status: 1,
        productId: 1,
        closedQty: 1,
        avgPrice: 21,
        date: 1,
        estimatedQty: 1,
        estimatedStatus: 1,
        time: 1,
        productTitle: '$productDetails.productTitle',
        stock: '$productDetails.stock',
        stock: '$productDetails.stock',
        image: '$productDetails.image',
        liveStock: '$productorders.Qty',
        liveAvg: '$productorders.Avg',
        oldestimatedorders: '$oldestimatedorders',
      },
    },
  ]);

  return values;
};

const updateEstimateById = async (id, updateBody) => {
  let estimate = await Estimated.findById(id);
  if (!estimate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Estimate Not Found');
  }
  estimate = await Estimated.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return estimate;
};

module.exports = {
  createEstimatedOrders,
  getEstimatedByDate,
  getSingleProductEstimations,
  updateEstimateById,
  getEstimatedByDateforPH,
};
