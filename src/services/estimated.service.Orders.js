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

module.exports = { createEstimatedOrders, getEstimatedByDate };
