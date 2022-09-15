const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
let currentDate = moment().format('DD-MM-YYYY');
const { Shop } = require('../models/b2b.ShopClone.model');
const { ShopOrderClone } = require('../models/shopOrder.model');
const { ProductorderClone } = require('../models/shopOrder.model');
const pettyStockModel = require('../models/b2b.pettyStock.model');
const { wardAdminGroup, wardAdminGroupModel_ORDERS } = require('../models/b2b.wardAdminGroup.model');
const wardAdminGroupDetails = require('../models/b2b.wardAdminGroupDetails.model');
const { Product } = require('../models/product.model');

const createGroup = async (body) => {
  let serverdates = moment().format('YYYY-MM-DD');
  let servertime = moment().format('hh:mm a');
  let num = 1;
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

  let values = {
    ...body,
    ...{
      groupId: userId,
      assignDate: serverdates,
      assignTime: servertime,
      pettyStockAllocateStatusNumber: num,
      created: moment(),
    },
  };
  let wardAdminGroupcreate = await wardAdminGroup.create(values);
  body.Orderdatas.forEach(async (e) => {
    let productId = e._id;

    await ShopOrderClone.findByIdAndUpdate(
      { _id: productId },
      {
        status: 'Assigned',
        completeStatus: 'Assigned',
        deliveryExecutiveId: body.deliveryExecutiveId,
        WA_assigned_Time: moment(),
      },
      { new: true }
    );
    await wardAdminGroupModel_ORDERS.create({ orderId: productId, wardAdminGroupID: wardAdminGroupcreate._id });
  });
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
  console.log(orderPicked);
  if (orderPicked.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, ' id not found');
  }

  orderPicked.forEach(async (e) => {
    let statusUpdate = e.deliveryExecutiveId;
    await ShopOrderClone.findByIdAndUpdate({ deliveryExecutiveId: statusUpdate }, { status: 'Order Picked' }, { new: true });
  });

  return 'success';
};
const getById = async (id) => {
  return wardAdminGroup.findById(id);
};

const updateManageStatus = async (id, updateBody) => {
  let Manage = await getById(id);
  if (!Manage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data not found');
  }
  Manage = await wardAdminGroup.findByIdAndUpdate(
    { _id: id },
    updateBody,
    // { status: 'Delivery start', manageDeliveryStatus: 'Delivery start' },
    { new: true }
  );
  return Manage;
};

const updateShopOrderCloneById = async (id, updatebody) => {
  let shoporderClone = await ShopOrderClone.findById(id);
  if (!shoporderClone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ShopOrderClone Not Found');
  }
  shoporderClone = await ShopOrderClone.findByIdAndUpdate({ _id: id }, updatebody, { new: true });
  return shoporderClone;
};

// GET ORDER DETAILS FROM GROUP BY ID

const getOrderFromGroupById = async (id) => {
  let getDetails = await wardAdminGroup.findById(id);
  return getDetails;
};

const getPettyStock = async (id) => {
  console.log(id);
  let values = await Product.aggregate([
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
                  $lookup: {
                    from: 'orderassigns',
                    localField: '_id',
                    foreignField: 'orderId',
                    pipeline: [{ $match: { wardAdminGroupID: id } }],
                    as: 'orderassigns',
                  },
                },
                {
                  $unwind: '$orderassigns',
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
              Qty: { $sum: '$quantity' },
              finalQuantity: { $sum: '$finalPricePerKg' },
            },
          },
        ],
        as: 'productorderclones',
      },
    },
    {
      $unwind: '$productorderclones',
    },
    {
      $unwind: {
        path: '$productorderclones',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        productTitle: 1,
        overAllQuantity: '$productorderclones.Qty',
        finalQuantity: '$productorderclones.finalQuantity',
      },
    },
  ]);

  return values;
};

const returnStock = async (id) => {
  console.log(id);
  let values = await Product.aggregate([
    // Delivered count

    {
      $lookup: {
        from: 'pettystockmodels',
        localField: '_id',
        foreignField: 'productId',
        as: 'totalpetty',
      },
    },
    {
      $unwind: '$totalpetty',
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
                    $and: [{ customerDeliveryStatus: { $eq: 'Delivered' } }],
                  },
                },
                {
                  $lookup: {
                    from: 'orderassigns',
                    localField: '_id',
                    foreignField: 'orderId',
                    pipeline: [{ $match: { wardAdminGroupID: id } }],
                    as: 'orderassigns',
                  },
                },
                {
                  $unwind: '$orderassigns',
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
              Qty: { $sum: '$finalQuantity' },
              finalQuantity: { $sum: '$finalPricePerKg' },
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

    //  Un Delivered count

    {
      $lookup: {
        from: 'pettystockmodels',
        localField: '_id',
        foreignField: 'productId',
        as: 'totalpetty',
      },
    },
    {
      $unwind: '$totalpetty',
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
                    $and: [{ customerDeliveryStatus: { $eq: 'Un Delivered' } }],
                  },
                },
                {
                  $lookup: {
                    from: 'orderassigns',
                    localField: '_id',
                    foreignField: 'orderId',
                    pipeline: [{ $match: { wardAdminGroupID: id } }],
                    as: 'orderassigns',
                  },
                },
                {
                  $unwind: '$orderassigns',
                },
              ],
              as: 'shoporderclonesData',
            },
          },
          {
            $unwind: '$shoporderclonesData',
          },

          {
            $group: {
              _id: null,
              UnQty: { $sum: '$finalQuantity' },
              UnfinalQuantity: { $sum: '$finalPricePerKg' },
            },
          },
        ],
        as: 'productorderclonesData',
      },
    },

    {
      $unwind: {
        path: '$productorderclonesData',
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $project: {
        _id: 1,
        productTitle: 1,
        productid: 1,
        pettyStock: '$totalpetty.pettyStock',
        custoQtyPetty: '$totalpetty.totalQtyIncludingPettyStock',
        DeliveryQuantity: '$productorderclones.Qty',

        productorderclones: { $eq: ['$productorderclones._id', null] },
        UndeliveryQuantity: '$productorderclonesData.UnQty',
        //   UndeliveryQuantity:{
        //     $sum: {
        //             $or: ['$productorderclonesData.UnQty', 0]
        //         }
        // },

        // UndeliveredPerSystem: { $subtract: [ "$totalpetty.totalQtyIncludingPettyStock", "$productorderclones.Qty"] },

        productorderclonesData: { $eq: ['$productorderclonesData._id', null] },
      },
    },
    {
      $match: {
        $or: [{ productorderclones: true }, { productorderclonesData: true }],
      },
    },
  ]);

  return values;
};

const pettyStockSubmit = async (id, updateBody) => {
  let deliveryStatus = await wardAdminGroup.findById(id);
  if (!deliveryStatus) {
    throw new ApiError(httpStatus.NOT_FOUND, 'status not found');
  }
  deliveryStatus = await wardAdminGroup.findByIdAndUpdate(
    { _id: id },
    { manageDeliveryStatus: updateBody.manageDeliveryStatus },
    { new: true }
  );

  let valueStatus = await wardAdminGroupModel_ORDERS.find({ orderId: id });
  console.log(valueStatus);
  valueStatus.forEach(async (e) => {
    await ShopOrderClone.findByIdAndUpdate({ _id: e.orderId }, { status: 'Delivery Completed' }, { new: true });
  });

  // updateBody.arr.forEach(async (e) => {
  //   await ShopOrderClone.findByIdAndUpdate({ _id: e }, { status: 'Delivery Completed' }, { new: true });

  // })
  return deliveryStatus;
};

const pettyCashSubmit = async (id, updateBody) => {
  let deliveryStatus = await wardAdminGroup.findById(id);
  if (!deliveryStatus) {
    throw new ApiError(httpStatus.NOT_FOUND, 'status not found');
  }
  deliveryStatus = await wardAdminGroup.findByIdAndUpdate(
    { _id: id },
    { pettyCash: updateBody.pettyCash, pettyCashAllocateStatus: updateBody.pettyCashAllocateStatus },
    { new: true }
  );
  return deliveryStatus;
};

const getGroupdetails = async () => {
  return wardAdminGroup.find();
};

// GET ASSIGN DATA BY DEVIVERY EXECUTIVE NAME

const getstatus = async (id) => {
  let details = await wardAdminGroup.aggregate([
    {},
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
};

const getBillDetails = async (id) => {
  let values = await wardAdminGroup.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'orderassigns',
        localField: '_id',
        foreignField: 'wardAdminGroupID',
        pipeline: [
          {
            $lookup: {
              from: 'shoporderclones',
              localField: 'orderId',
              foreignField: '_id',
              pipeline: [
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
                    as: 'datass',
                  },
                },
                {
                  $unwind: '$datass',
                },

                {
                  $project: {
                    totalAmount: '$datass.amount',
                  },
                },
              ],
              as: 'shopDatas',
            },
          },
          {
            $unwind: '$shopDatas',
          },

          {
            $lookup: {
              from: 'shoporderclones',
              localField: 'orderId',
              foreignField: '_id',
              pipeline: [
                {
                  $lookup: {
                    from: 'productorderclones',
                    localField: '_id',
                    foreignField: 'orderId',
                    pipeline: [
                      {
                        $lookup: {
                          from: 'products',
                          localField: 'productid',
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
                          productTitle: '$productsdata.productTitle',
                          finalQuantity: 1,
                          finalPricePerKg: 1,
                          HSN_Code: 1,
                          GST_Number: 1,
                          total: {
                            $multiply: ['$finalQuantity', '$finalPricePerKg'],
                          },
                        },
                      },
                    ],
                    as: 'products',
                  },
                },

                {
                  $lookup: {
                    from: 'b2bshopclones',
                    localField: 'shopId',
                    foreignField: '_id',
                    pipeline: [
                      {
                        $lookup: {
                          from: 'streets',
                          localField: 'Strid',
                          foreignField: '_id',
                          as: 'streetDatasss',
                        },
                      },
                      {
                        $unwind: '$streetDatasss',
                      },
                      {
                        $project: {
                          street: '$streetDatasss.street',
                          _id: 1,
                          SName: 1,
                          SOwner: 1,
                        },
                      },
                    ],
                    as: 'b2bshopclones',
                  },
                },
                {
                  $unwind: '$b2bshopclones',
                },
                {
                  $project: {
                    _id: 1,
                    OrderId: 1,
                    products: '$products',
                    b2bshopclones: '$b2bshopclones',
                    SName: '$b2bshopclones.SName',
                    SOwner: '$b2bshopclones.SOwner',
                  },
                },
              ],
              as: 'shopDatasDetails',
            },
          },
          {
            $unwind: '$shopDatasDetails',
          },

          {
            $project: {
              _id: 1,
              totalAmount: '$shopDatas.totalAmount',
              OrderId: '$shopDatasDetails.OrderId',
              product: '$shopDatasDetails.products',

              SName: '$shopDatasDetails.SName',
              SOwner: '$shopDatasDetails.SOwner',
              street: '$shopDatasDetails.street',
            },
          },
        ],
        as: 'orderassigns',
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'deliveryExecutiveId',
        foreignField: '_id',
        as: 'b2bsersData',
      },
    },
    {
      $unwind: '$b2bsersData',
    },

    {
      $project: {
        groupId: 1,
        assignDate: 1,
        assignTime: 1,
        totalOrders: 1,
        orderassigns: '$orderassigns',
        deliveryExecutivename: '$b2bsersData.name',
      },
    },
  ]);
  if (values.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'not found');
  }
  return values[0];
};

const assignOnly = async (page) => {
  console.log(page);
  let values = await wardAdminGroup.aggregate([
    // { $sort: { pettyStockAllocateStatusNumber: 1 } },
    { $match: { status: 'Assigned' } },

    {
      $lookup: {
        from: 'orderassigns',
        localField: '_id',
        foreignField: 'wardAdminGroupID',
        pipeline: [
          {
            $lookup: {
              from: 'shoporderclones',
              localField: 'orderId',
              foreignField: '_id',
              pipeline: [
                {
                  $match: {
                    $and: [{ customerDeliveryStatus: { $eq: 'Pending' } }],
                  },
                },
                {
                  $group: {
                    _id: null,
                  },
                },
              ],
              as: 'shopdata',
            },
          },
          { $unwind: '$shopdata' },
          {
            $project: {
              pending: { $eq: ['$shopdata._id', null] },
              shopdata: '$shopdata.deliveryExecutiveId',
            },
          },
        ],
        as: 'dataDetails',
      },
    },

    { $addFields: { Pending: { $arrayElemAt: ['$dataDetails', 0] } } },

    {
      $lookup: {
        from: 'b2busers',
        localField: 'deliveryExecutiveId',
        foreignField: '_id',
        as: 'UserName',
      },
    },
    {
      $unwind: '$UserName',
    },
    // {
    //   $lookup: {
    //     from: 'shoporderclones',
    //     localField: 'Orderdatas._id',
    //     foreignField: '_id',
    //     as: 'wdfsaf'

    //   }
    // },

    {
      $project: {
        shopOrderCloneId: '$wdfsaf._id',
        groupId: 1,
        // Orderdatas:1,
        totalOrders: 1,
        assignDate: 1,
        assignTime: 1,
        manageDeliveryStatus: 1,
        Pending: '$Pending.pending',
        deliveryExecutiveId: 1,
        deliveryExecutiveName: '$UserName.name',
        pettyCashAllocateStatus: 1,
        pettyStockAllocateStatus: 1,
      },
    },

    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await wardAdminGroup.aggregate([
    // { $sort: { pettyStockAllocateStatusNumber:1} },
    { $match: { status: 'Assigned' } },

    {
      $lookup: {
        from: 'orderassigns',
        localField: '_id',
        foreignField: 'wardAdminGroupID',
        pipeline: [
          {
            $lookup: {
              from: 'shoporderclones',
              localField: 'orderId',
              foreignField: '_id',
              pipeline: [
                {
                  $match: {
                    $and: [{ customerDeliveryStatus: { $eq: 'Pending' } }],
                  },
                },
                {
                  $group: {
                    _id: null,
                  },
                },
              ],
              as: 'shopdata',
            },
          },
          { $unwind: '$shopdata' },
          {
            $project: {
              pending: { $eq: ['$shopdata._id', null] },
              shopdata: '$shopdata.deliveryExecutiveId',
            },
          },
        ],
        as: 'dataDetails',
      },
    },

    { $addFields: { Pending: { $arrayElemAt: ['$dataDetails', 0] } } },

    {
      $lookup: {
        from: 'b2busers',
        localField: 'deliveryExecutiveId',
        foreignField: '_id',
        as: 'UserName',
      },
    },
    {
      $unwind: '$UserName',
    },
  ]);
  return { values: values, total: total.length };
};

const getDeliveryOrderSeparate = async (id, page) => {
  let datas = await wardAdminGroup.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $unwind: '$Orderdatas',
    },
    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'Orderdatas._id',
        foreignField: '_id',
        as: 'shopDatas',
      },
    },
    { $unwind: '$shopDatas' },
    {
      $project: {
        type: '$Orderdatas.type',
        orderId: '$Orderdatas.OrderId',
        orderedDate: '$Orderdatas.date',
        orderedTime: '$Orderdatas.time',
        streetName: '$Orderdatas.street',
        totalItems: '$Orderdatas.totalItems',
        shopName: '$Orderdatas.shopName',
        customerDeliveryStatus: '$shopDatas.customerDeliveryStatus',
        shopordercloneId: '$shopDatas._id',
        inititalPaymentType: '$shopDatas.Payment',
      },
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
    {
      $unwind: '$Orderdatas',
    },
    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'Orderdatas._id',
        foreignField: '_id',
        as: 'shopDatas',
      },
    },
    { $unwind: '$shopDatas' },
  ]);
  return { datas: datas, total: total.length };
};

const groupIdClick = async (id) => {
  let data = [];
  let getDetails = await wardAdminGroup.findById(id);
  getDetails.Orderdatas.forEach((e) => {
    data.push(e);
  });
  return data;
};

const getpettyStockData = async (id, body) => {
  let data = [];
  let pettyStockData = await wardAdminGroup.findByIdAndUpdate({ _id: id }, body, { new: true });
  pettyStockData.pettyStockData.forEach((e) => {
    data.push(e);
  });
  return data;
};
const orderIdClickGetProduct = async (id) => {
  console.log(id);

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
      },
    },
    {
      $unwind: '$productsData',
    },
    {
      $project: {
        quantity: 1,
        priceperkg: 1,
        product: '$productsData.productTitle',
        productId: '$productsData._id',
      },
    },
  ]);

  return getDetails;
};

const getDetailsAfterDeliveryCompletion = async (id) => {
  let values = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [{ deliveryExecutiveId: { $eq: id } }],
      },
    },
  ]);
  return values;
};

const getBillDetailsPerOrder = async (id) => {
  let datas = await ProductorderClone.aggregate([
    {
      $match: {
        $and: [{ orderId: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'orderId',
        foreignField: '_id',
        as: 'shopData',
      },
    },

    { $unwind: '$shopData' },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'shopData.deliveryExecutiveId',
        foreignField: '_id',
        as: 'deliveryExecutiveName',
      },
    },
    { $unwind: '$deliveryExecutiveName' },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopData.shopId',
        foreignField: '_id',
        as: 'b2bshopclonedatas',
      },
    },
    { $unwind: '$b2bshopclonedatas' },
    {
      $lookup: {
        from: 'productorderclones',
        localField: 'shopData._id',
        foreignField: 'orderId',
        pipeline: [{ $group: { _id: null, Qty: { $sum: '$finalQuantity' } } }],
        as: 'TotalQuantityData',
      },
    },
    { $unwind: '$TotalQuantityData' },
    {
      $lookup: {
        from: 'products',
        localField: 'productid',
        foreignField: '_id',
        as: 'productName',
      },
    },
    { $unwind: '$productName' },

    {
      $project: {
        productid: 1,
        finalPricePerKg: 1,
        finalQuantity: 1,
        GST_Number: 1,
        HSN_Code: 1,
        productTitle: '$productName.productTitle',
        billNo: '$shopData.billNo',
        billDate: '$shopData.billDate',
        billTime: '$shopData.billTime',
        OrderId: '$shopData.OrderId',
        shopName: '$b2bshopclonedatas.SName',
        address: '$b2bshopclonedatas.address',
        mobile: '$b2bshopclonedatas.mobile',
        shopType: '$b2bshopclonedatas.type',
        SOwner: '$b2bshopclonedatas.SOwner',
        Amount: { $multiply: ['$finalQuantity', '$finalPricePerKg'] },
        // total: { $sum: "$Amount"},
        totalQuantity: '$TotalQuantityData.Qty',
        OperatorName: '$deliveryExecutiveName.name',
        CGSTAmount: { $divide: ['$GST_Number', 2] },
        SGSTAmount: { $divide: ['$GST_Number', 2] },
      },
    },
  ]);
  return datas;
};

const getReturnWDEtoWLE = async (id, page) => {
  let datas = await wardAdminGroup.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'Orderdatas._id',
        foreignField: '_id',
        as: 'detailsData',
      },
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
  return { datas: datas, total: total.length };
};

const getPettyStockDetails = async (id, page) => {
  let details = await wardAdminGroup.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    { $unwind: '$pettyStock' },
    {
      $project: {
        pettyStock: 1,
      },
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
  return { details: details, total: total.length };
};

const getdetailsAboutPettyStockByGroupId = async (id, page) => {
  let details = await wardAdminGroup.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $project: {
        pettyStock: 1,
        totalQtyIncludingPettyStock: 1,
      },
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

  return { details: details, total: total.length };
};
const getPettyCashDetails = async (id, page) => {
  let values = await wardAdminGroup.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },

    { $unwind: '$Orderdatas' },

    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'Orderdatas.OrderId',
        foreignField: 'OrderId',
        as: 'datas',
      },
    },
    { $unwind: '$datas' },
    { $skip: 10 * page },
    { $limit: 10 },

    {
      $project: {
        groupId: 1,
        orderId: '$datas.OrderId',
        Amount: '$datas.overallTotal',
        shopType: '$Orderdatas.type',
        shopName: '$Orderdatas.shopName',
        Deliverystatus: '$datas.customerDeliveryStatus',
        FinalPaymentType: '$datas.payType',
        pettyCashApporvedStatus: '$datas.pettyCashReceiveStatus',
        shopordercloneID: '$datas._id',
      },
    },
  ]);
  let total = await wardAdminGroup.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },

    { $unwind: '$Orderdatas' },

    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'Orderdatas.OrderId',
        foreignField: 'OrderId',
        as: 'datas',
      },
    },
    { $unwind: '$datas' },
  ]);
  return { values: values, total: total.length };
};

const getAllGroup = async (page) => {
  let values = await wardAdminGroup.aggregate([
    {
      $match: {
        $and: [{ manageDeliveryStatus: { $eq: 'Delivery Complete' } }],
      },
    },
    {
      $unwind: '$Orderdatas',
    },
    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'Orderdatas._id',
        foreignField: '_id',
        as: 'shopIDDatas',
      },
    },
    {
      $unwind: '$shopIDDatas',
    },
    {
      $project: {
        groupId: 1,
        assignDate: 1,
        assignTime: 1,
        deliveryExecutiveId: 1,
        manageDeliveryStatus: 1,
        totalOrders: 1,
        pettyCash: 1,
        status: 1,
        shoporderclonesId: '$shopIDDatas._id',
      },
    },

    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await wardAdminGroup.aggregate([
    {
      $match: {
        $and: [{ manageDeliveryStatus: { $eq: 'Delivery Complete' } }],
      },
    },
  ]);
  return { values: values, total: total.length };
};

const pettyStockCreate = async (id, pettyStockBody) => {
  let { product } = pettyStockBody;
  let wardadmin = await wardAdminGroup.findById(id);
  console.log(wardadmin);
  let createPetty = await wardAdminGroup.findByIdAndUpdate(
    { _id: id },
    { pettyStock: product, pettyStockAllocateStatus: 'Allocated' },
    { new: true }
  );
  product.forEach(async (e) => {
    pettyStockModel.create({
      wardAdminId: createPetty.id,
      product: e.productName,
      QTY: e.QTY,
      pettyStock: e.pettyStock,
      totalQtyIncludingPettyStock: e.totalQtyIncludingPettyStock,
    });
  });
  let afterUpdate = await wardAdminGroup.findById(id);
  return afterUpdate;
};

const getcashAmountViewFromDB = async (id) => {
  let values = await wardAdminGroup.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $unwind: '$Orderdatas',
    },
    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'Orderdatas._id',
        foreignField: '_id',
        as: 'datas',
      },
    },
    {
      $unwind: '$datas',
    },

    // {
    //   $group: {
    //     _id: '$datas.payType',
    //     totalCash: { $sum: '$datas.total' },
    //   },
    // },

    {
      $project: {
        pettyCash: 1,
        totalCashCaculation: {
          _id: '$datas.payType',
          totalCash: { $sum: '$datas.total' },
        },

        amount: {
          $sum: {
            $add: ['$pettyCash', '$totalCashCaculation.totalCash'],
          },
        },
      },
    },
  ]);

  return values;
};

const createDatasInPettyStockModel = async (id, updateBody) => {
  let datas = await getById(id);

  if (!datas) {
    throw new ApiError(httpStatus.NOT_FOUND, 'not found');
  }
  datas = await pettyStockModel.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return datas;
};

const getPEttyCashQuantity = async (id) => {
  let values = await wardAdminGroup.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $unwind: '$Orderdatas',
    },
    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'Orderdatas._id',
        foreignField: '_id',
        as: 'datas',
      },
    },
    {
      $unwind: '$datas',
    },

    {
      $project: {
        product: '$datas.product',
      },
    },
    {
      $unwind: '$product',
    },

    {
      $group: {
        _id: '$product.productTitle',
        Totalquantitysum: { $sum: '$product.quantity' },
      },
    },
  ]);
  return values;
};

const uploadWastageImage = async (body) => {
  let values = await wardAdminGroupDetails.create(body);
  return values;
};

const lastPettyStckAdd = async (id, updateBody) => {
  let product = await wardAdminGroup.findById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, ' not found');
  }
  updateBody.product.forEach(async (e) => {
    await pettyStockModel.create(
      { _id: e._id },
      {
        productName: e.productName,
        productId: e.productId,
        QTY: e.QTY,
        pettyStock: e.pettyStock,
        totalQtyIncludingPettyStock: e.totalQtyIncludingPettyStock,
      },
      { new: true }
    );
  });
  return product;
};

module.exports = {
  getPEttyCashQuantity,
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
  // pettyStockSubmit,
  pettyStockSubmit,
  pettyCashSubmit,
  getPettyStockDetails,
  getdetailsAboutPettyStockByGroupId,
  uploadWastageImage,
  getpettyStockData,
  getPettyCashDetails,
  getAllGroup,
  updateShopOrderCloneById,
  pettyStockCreate,
  getcashAmountViewFromDB,

  createDatasInPettyStockModel,
  returnStock,
  // createProduct,

  lastPettyStckAdd,
};
