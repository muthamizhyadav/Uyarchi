const httpStatus = require('http-status');
const { usableStock } = require('../models/usableStock.model');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const { Product, Stock, ConfirmStock, LoadingExecute, BillRaise, ManageBill, ShopList } = require('../models/product.model');

const createusableStock = async (body) => {
  let usable = await usableStock.create(body);
  return usable;
};

const getAllusableStock = async () => {
  return await usableStock.find();
};

const getusableStockById = async (id) => {
  let usable = await usableStock.findById(id);
  if (!usable || usable.active == false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Usable Stock Not Found');
  }
  return usable;
};

const updateusableStockbyId = async (id, updateBody) => {
  let usable = await usableStock.findById(id);
  if (!usable || usable.active == false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Usable Stock Not Found');
  }
  usable = await usableStock.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return usable;
};

const getAssignStockbyId = async (id) => {
  return await usableStock.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'assignstocks',
        localField: '_id',
        foreignField: 'usablestockId',
        pipeline: [{ $match: { type: 'b2b' } }, { $group: { _id: null, Total: { $sum: '$quantity' } } }],
        as: 'b2bAssign',
      },
    },
    {
      $lookup: {
        from: 'assignstocks',
        localField: '_id',
        foreignField: 'usablestockId',
        pipeline: [{ $match: { type: 'b2c' } }, { $group: { _id: null, Total: { $sum: '$quantity' } } }],
        as: 'b2cAssign',
      },
    },
    {
      $lookup: {
        from: 'assignstocks',
        localField: '_id',
        foreignField: 'usablestockId',
        as: 'assignHistory',
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'productsdata',
      },
    },
    {
      $unwind: '$productsdata',
    },
    {
      $project: {
        _id: 1,
        b2cassignTotal: { $sum: '$b2cAssign.Total' },
        b2bassignTotal: { $sum: '$b2bAssign.Total' },
        b2bStock: 1,
        b2cStock: 1,
        productId: 1,
        date: 1,
        time: 1,
        FQ1: 1,
        FQ2: 1,
        FQ3: 1,
        totalStock: 1,
        wastage: 1,
        ProductName: '$productsdata.productTitle',
        assignHistory: '$assignHistory',
      },
    },
  ]);
};

const getStocks = async () => {
  const today = moment().format('DD-MM-YYYY');
  console.log(today);
  const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
  const Today = moment().format('YYYY-MM-DD');
  let values = await Product.aggregate([
    {
      $lookup: {
        from: 'usablestocks',
        localField: '_id',
        foreignField: 'productId',
        pipeline: [{ $match: { date: today } }],
        as: 'stocks',
      },
    },
    {
      $unwind: { path: '$stocks', preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'productid',
        pipeline: [
          {
            $lookup: {
              from: 'shoporderclones',
              localField: 'orderId',
              foreignField: '_id',
              pipeline: [
                {
                  $match: {
                    $and: [{ delivery_type: { $eq: 'NDD' } }, { date: { $eq: yesterday } }],
                  },
                },
              ],
              as: 'shops',
            },
          },
          {
            $unwind: '$shops',
          },
          {
            $group: {
              _id: null,
              NDD: { $sum: { $multiply: ['$finalQuantity', '$packKg'] } },
            },
          },
        ],
        as: 'productorder',
      },
    },
    {
      $unwind: {
        path: '$productorder',
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'productid',
        pipeline: [
          {
            $lookup: {
              from: 'shoporderclones',
              localField: 'orderId',
              foreignField: '_id',
              pipeline: [
                {
                  $match: {
                    $and: [{ delivery_type: { $eq: 'IMD' } }, { status: { $ne: 'Rejected' } }, { date: { $eq: Today } }],
                  },
                },
              ],
              as: 'shops',
            },
          },
          {
            $unwind: '$shops',
          },
          {
            $group: {
              _id: null,
              IMD: { $sum: { $multiply: ['$finalQuantity', '$packKg'] } },
            },
          },
        ],
        as: 'Imd',
      },
    },
    {
      $unwind: {
        path: '$Imd',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        productTitle: 1,
        availableStocks: '$stocks.totalStock',
        TodayDeliveryStock: '$productorder.NDD',
        Imd: '$Imd.IMD',
      },
    },
  ]);
  return values;
};

const getstockDetails = async (id) => {
  let today = moment().format('YYYY-MM-DD');
  let value = await usableStock.aggregate([
    {
      $sort: { created: -1 },
    },
    {
      $match: {
        productId: { $eq: id },
      },
    },
    {
      $addFields: {
        todaydate: { $dateToString: { format: '%Y-%m-%d', date: '$created' } },
      },
    },
    {
      $addFields: {
        yesterdate: {
          $dateSubtract: {
            startDate: '$created',
            unit: 'day',
            amount: 1,
          },
        },
      },
    },
    {
      $addFields: {
        yesterday: { $dateToString: { format: '%Y-%m-%d', date: '$yesterdate' } },
      },
    },
    {
      $addFields: {
        yesterdate: {
          $dateSubtract: {
            startDate: '$created',
            unit: 'day',
            amount: 1,
          },
        },
      },
    },
    {
      $addFields: {
        yesterday: { $dateToString: { format: '%Y-%m-%d', date: '$yesterdate' } },
      },
    },
    {
      $lookup: {
        from: 'productorderclones',
        localField: 'todaydate',
        foreignField: 'date',
        pipeline: [
          {
            $match: {
              productid: id,
            },
          },
          {
            $lookup: {
              from: 'shoporderclones',
              localField: 'orderId',
              foreignField: '_id',
              pipeline: [
                {
                  $match: {
                    delivery_type: 'IMD',
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
            $group: {
              _id: null,
              Imd: { $sum: { $multiply: ['$finalQuantity', '$packKg'] } },
            },
          },
        ],
        as: 'productorderclones',
      },
    },
    {
      $unwind: {
        path: '$productorderclones',
        preserveNullAndEmptyArrays: true,
      },
    },
    // {
    //   $unwind: '$productorderclones',
    // },

    {
      $lookup: {
        from: 'productorderclones',
        localField: 'yesterday',
        foreignField: 'date',
        pipeline: [
          {
            $match: {
              productid: id,
            },
          },
          {
            $lookup: {
              from: 'shoporderclones',
              localField: 'orderId',
              foreignField: '_id',
              pipeline: [
                {
                  $match: {
                    delivery_type: 'NDD',
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
            $group: {
              _id: null,
              NDD: { $sum: { $multiply: ['$finalQuantity', '$packKg'] } },
            },
          },
        ],
        as: 'Ndd',
      },
    },
    {
      $unwind: {
        path: '$Ndd',
        preserveNullAndEmptyArrays: true,
      },
    },
    // {
    //   $unwind: '$Ndd',
    // },
    {
      $lookup: {
        from: 'pettystockmodels',
        localField: 'date',
        foreignField: 'date',
        pipeline: [
          {
            $match: { productId: id },
          },
          {
            $group: { _id: null, pettyStock: { $sum: '$pettyStock' } },
          },
        ],
        as: 'pettyStock',
      },
    },
    {
      $unwind: {
        path: '$pettyStock',
        preserveNullAndEmptyArrays: true,
      },
    },

    // Today Delivered Stock Work Flow with Ndd And Imd

    {
      $lookup: {
        from: 'productorderclones',
        localField: 'yesterday',
        foreignField: 'date',
        pipeline: [
          {
            $match: {
              productid: id,
            },
          },
          {
            $lookup: {
              from: 'shoporderclones',
              localField: 'orderId',
              foreignField: '_id',
              pipeline: [
                {
                  $match: {
                    $and: [{ delivery_type: 'NDD' }, { status: 'Delivered' }],
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
            $group: {
              _id: null,
              delivered: { $sum: { $multiply: ['$finalQuantity', '$packKg'] } },
            },
          },
        ],
        as: 'Ndd_delivered',
      },
    },
    {
      $unwind: {
        path: '$Ndd_delivered',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'productorderclones',
        localField: 'todaydate',
        foreignField: 'date',
        pipeline: [
          {
            $match: {
              productid: id,
            },
          },
          {
            $lookup: {
              from: 'shoporderclones',
              localField: 'orderId',
              foreignField: '_id',
              pipeline: [
                {
                  $match: {
                    $and: [{ delivery_type: 'IMD' }, { status: 'Delivered' }],
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
            $group: {
              _id: null,
              ImdDelivered: { $sum: { $multiply: ['$finalQuantity', '$packKg'] } },
            },
          },
        ],
        as: 'Imd_delivered',
      },
    },
    {
      $unwind: {
        path: '$Imd_delivered',
        preserveNullAndEmptyArrays: true,
      },
    },

    // Rejected Stocks

    {
      $lookup: {
        from: 'productorderclones',
        localField: 'todaydate',
        foreignField: 'date',
        pipeline: [
          {
            $match: {
              productid: id,
            },
          },
          {
            $lookup: {
              from: 'shoporderclones',
              localField: 'orderId',
              foreignField: '_id',
              pipeline: [
                {
                  $match: {
                    $and: [{ status: 'Rejected' }],
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
            $group: {
              _id: null,
              Rejected: { $sum: { $multiply: ['$finalQuantity', '$packKg'] } },
            },
          },
        ],
        as: 'rejectedStock',
      },
    },
    {
      $unwind: {
        path: '$rejectedStock',
        preserveNullAndEmptyArrays: true,
      },
    },

    // Un Delivered stocks
    {
      $lookup: {
        from: 'productorderclones',
        localField: 'todaydate',
        foreignField: 'date',
        pipeline: [
          {
            $match: {
              productid: id,
            },
          },
          {
            $lookup: {
              from: 'shoporderclones',
              localField: 'orderId',
              foreignField: '_id',
              pipeline: [
                {
                  $match: {
                    $and: [{ status: 'UnDelivered' }],
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
            $group: {
              _id: null,
              unDelivered: { $sum: { $multiply: ['$finalQuantity', '$packKg'] } },
            },
          },
        ],
        as: 'UnDelivered_Stocks',
      },
    },
    {
      $unwind: {
        path: '$UnDelivered_Stocks',
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $lookup: {
        from: 'returnstocks',
        localField: 'todaydate',
        foreignField: 'date',
        pipeline: [
          { $match: { productId: id } },
          {
            $group: {
              _id: null,
              return: { $sum: '$actualStock' },
            },
          },
        ],
        as: 'returnstocks',
      },
    },
    {
      $unwind: {
        path: '$returnstocks',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        closingStock: 1,
        oldStock: 1,
        openingStock: 1,
        active: 1,
        archive: 1,
        b2bStock: 1,
        b2cStock: 1,
        productId: 1,
        date: 1,
        time: 1,
        totalStock: 1,
        wastage: 1,
        todaydate: 1,
        yesterdate: 1,
        yesterday: 1,
        imd: '$productorderclones.Imd',
        pettyStock: '$pettyStock.pettyStock',
        Imd_delivered: '$Imd_delivered.ImdDelivered',
        UnDelivered_Stocks: '$UnDelivered_Stocks.unDelivered',
        Ndd_delivered: '$Ndd_delivered.delivered',
        rejectedStock: '$rejectedStock.Rejected',
        returnstocks: '$returnstocks.return',
      },
    },
  ]);
  return value;
};
module.exports = {
  createusableStock,
  getAllusableStock,
  getusableStockById,
  updateusableStockbyId,
  getAssignStockbyId,
  getStocks,
  getstockDetails,
};
