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
const orderPayment = require('../models/orderpayment.model');
const createGroup = async (body) => {
  let serverdates = moment().format('YYYY-MM-DD');
  console.log(typeof serverdates);
  let servertime = moment().format('hh:mm a');
  let num = 1;
  const group = await wardAdminGroup.find({ assignDate: serverdates });
  const Buy = await wardAdminGroup.find({ assignDate: serverdates });
  console.log(group);

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
  let centerdata = '';
  if (Buy.length < 9) {
    centerdata = '0000';
  }
  if (Buy.length < 99 && Buy.length >= 9) {
    centerdata = '000';
  }
  if (Buy.length < 999 && Buy.length >= 99) {
    centerdata = '00';
  }
  if (Buy.length < 9999 && Buy.length >= 999) {
    centerdata = '0';
  }
  let BillId = '';
  let totalcounts = Buy.length + 1;

  BillId = 'B' + centerdata + totalcounts;

  let values = {
    ...body,
    ...{
      groupId: userId,
      assignDate: serverdates,
      assignTime: servertime,
      pettyStockAllocateStatusNumber: num,
      created: moment(),
      GroupBillId: BillId,
      GroupBillDate: serverdates,
      GroupBillTime: servertime,
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
    await wardAdminGroupModel_ORDERS.create({
      orderId: productId,
      wardAdminGroupID: wardAdminGroupcreate._id,
      date: serverdates,
      time: servertime,
      created: moment(),
      AssignedstatusPerDay: 1,
    });
  });

  return wardAdminGroupcreate;
};

const updateOrderStatus = async (id, updateBody) => {
  let currentDate = moment().format('YYYY-MM-DD');
  let currenttime = moment().format('HHmmss');
  let body = {
    ...updateBody,
    ...{
      status: 'Delivered',
      customerDeliveryStatus: 'Delivered',
    },
  };
  let deliveryStatus = await ShopOrderClone.findById(id);
  console.log(deliveryStatus);
  if (!deliveryStatus) {
    throw new ApiError(httpStatus.NOT_FOUND, 'status not found');
  }
  deliveryStatus = await ShopOrderClone.findByIdAndUpdate({ _id: id }, body, { new: true });
  await orderPayment.create({
    paidAmt: updateBody.paidamount,
    date: currentDate,
    time: currenttime,
    created: moment(),
    orderId: deliveryStatus._id,
    type: updateBody.reason,
    pay_type: updateBody.pay_types,
    paymentMethod: updateBody.paymentMethods,
    paymentstutes: updateBody.paymentstutes,
  });
  return deliveryStatus;
};
const updateOrderStatus_forundelivey = async (id, updateBody) => {
  let body = {
    ...updateBody,
    ...{
      status: 'UnDelivered',
      customerDeliveryStatus: 'UnDelivered',
    },
  };
  let deliveryStatus = await ShopOrderClone.findById(id);
  console.log(deliveryStatus);
  if (!deliveryStatus) {
    throw new ApiError(httpStatus.NOT_FOUND, 'status not found');
  }
  deliveryStatus = await ShopOrderClone.findByIdAndUpdate({ _id: id }, body, { new: true });
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
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  Manage = await wardAdminGroup.findByIdAndUpdate(
    { _id: id },
    {
      pettyStockAllocateStatus: 'Un Allocate',
    },
    { new: true }
  );
  return Manage;
};
const updateordercomplete = async (id, updateBody) => {
  let Manage = await getById(id);
  if (!Manage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  Manage = await wardAdminGroup.findByIdAndUpdate(
    { _id: id },
    {
      manageDeliveryStatus: 'Order Picked',
    },
    { new: true }
  );
  let assign = await wardAdminGroupModel_ORDERS.find({ wardAdminGroupID: id });
  assign.forEach(async (e) => {
    await ShopOrderClone.findByIdAndUpdate({ _id: e.orderId }, { status: 'Order Picked' }, { new: true });
  });
  return Manage;
};
const delevery_start = async (id, updateBody) => {
  let Manage = await getById(id);
  if (!Manage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  Manage = await wardAdminGroup.findByIdAndUpdate(
    { _id: id },
    {
      manageDeliveryStatus: 'Delivery start',
    },
    { new: true }
  );
  let assign = await wardAdminGroupModel_ORDERS.find({ wardAdminGroupID: id });
  assign.forEach(async (e) => {
    await ShopOrderClone.findByIdAndUpdate({ _id: e.orderId }, { status: 'Delivery start' }, { new: true });
  });
  return Manage;
};

const updateManageStatuscashcollect = async (id, updateBody) => {
  let Manage = await getById(id);
  if (!Manage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  Manage = await wardAdminGroup.findByIdAndUpdate(
    { _id: id },
    {
      manageDeliveryStatus: 'petty cash picked',
    },
    { new: true }
  );
  return Manage;
};

const updateManageStatuscollected = async (id, updateBody) => {
  let Manage = await getById(id);
  if (!Manage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  Manage = await wardAdminGroup.findByIdAndUpdate(
    { _id: id },
    {
      manageDeliveryStatus: 'petty stock picked',
    },
    { new: true }
  );
  return Manage;
};

const updateManageStatuscash = async (id, updateBody) => {
  let Manage = await getById(id);
  if (!Manage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  Manage = await wardAdminGroup.findByIdAndUpdate(
    { _id: id },
    {
      pettyCashAllocateStatus: 'Un Allocate',
    },
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
        pipeline: [
          {
            $match: {
              wardAdminId: id,
            },
          },
        ],
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
                    $and: [{ customerDeliveryStatus: { $eq: 'UnDelivered' } }],
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
        // custoQtyPetty: '$totalpetty.totalQtyIncludingPettyStock',
        DeliveryQuantity: '$productorderclones.Qty',

        productorderclones: { $eq: ['$productorderclones._id', null] },
        UndeliveryQuantity: '$productorderclonesData.UnQty',
        totalSum: { $add: ['$productorderclones.Qty', '$productorderclonesData.UnQty'] },
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
    throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
  }
  deliveryStatus = await wardAdminGroup.findByIdAndUpdate(
    { _id: id },
    { manageDeliveryStatus: 'Delivery Completed' },
    { new: true }
  );

  // let valueStatus = await wardAdminGroupModel_ORDERS.find({ orderId: id });
  // console.log(valueStatus);
  // valueStatus.forEach(async (e) => {
  //   await ShopOrderClone.findByIdAndUpdate({ _id: e.orderId }, { status: 'Delivery Completed' }, { new: true });
  // });

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
    { pettyCash: updateBody.pettyCash, pettyCashAllocateStatus: 'Allocated' },
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
                          unit: 1,
                          packKg: 1,
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
                          mobile: 1,
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
                    Payment: 1,
                    customerBillId: 1,
                    customerBilldate: 1,
                    customerBilltime: 1,
                    products: '$products',
                    b2bshopclones: '$b2bshopclones',
                    SName: '$b2bshopclones.SName',
                    SOwner: '$b2bshopclones.SOwner',
                    street: '$b2bshopclones.street',
                    mobile: '$b2bshopclones.mobile',
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
              customerBillId: '$shopDatasDetails.customerBillId',
              customerBilldate: '$shopDatasDetails.customerBilldate',
              customerBilltime: '$shopDatasDetails.customerBilltime',
              Payment: '$shopDatasDetails.Payment',
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
      $lookup: {
        from: 'pettystockmodels',
        localField: '_id',
        foreignField: 'wardAdminId',
        as: 'pettystockmodels',
      },
    },

    {
      $project: {
        groupId: 1,
        assignDate: 1,
        assignTime: 1,
        totalOrders: { $size: '$orderassigns' },
        orderassigns: '$orderassigns',
        deliveryExecutivename: '$b2bsersData.name',
        pettystockmodels: '$pettystockmodels',
        pettyCash: 1,
        pettyCashAllocateStatus: 1,
        pettyStockAllocateStatus: 1,
      },
    },
  ]);
  if (values.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'not found');
  }
  return values[0];
};

const assignOnly = async (page, status) => {
  let macthStatus = { active: true };
  let statusMatch = { status: 'Packed' };
  if (status == 'stock') {
    macthStatus = { pettyStockAllocateStatus: 'Pending' };
  }
  if (status == 'cash') {
    macthStatus = { pettyCashAllocateStatus: 'Pending' };
  }
  if (status == 'delivery') {
    macthStatus = {
      // pettyCashAllocateStatus: { $ne: 'Pending' },
      // pettyStockAllocateStatus: { $ne: 'Pending' },
      manageDeliveryStatus: { $ne: 'Delivery Completed' },
    };
    statusMatch = { status: { $in: ['Assigned', 'Packed'] } };
  }
  console.log(statusMatch);
  let values = await wardAdminGroup.aggregate([
    { $match: { $and: [statusMatch, macthStatus] } },
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
                    from: 'b2bshopclones',
                    localField: 'shopId',
                    foreignField: '_id',
                    as: 'b2bshopclones',
                  },
                },
                {
                  $unwind: '$b2bshopclones',
                },
                {
                  $project: {
                    _id: 1,
                    SName: '$b2bshopclones.SName',
                    mobile: '$b2bshopclones.mobile',
                    status: 1,
                    productStatus: 1,
                    customerDeliveryStatus: 1,
                    delivery_type: 1,
                    time_of_delivery: 1,
                    paidamount: 1,
                    OrderId: 1,
                    date: 1,
                    created: 1,
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
              _id: '$shoporderclones._id',
              SName: '$shoporderclones.SName',
              mobile: '$shoporderclones.mobile',
              status: '$shoporderclones.status',
              productStatus: '$shoporderclones.productStatus',
              customerDeliveryStatus: '$shoporderclones.customerDeliveryStatus',
              delivery_type: '$shoporderclones.delivery_type',
              time_of_delivery: '$shoporderclones.time_of_delivery',
              paidamount: '$shoporderclones.paidamount',
              OrderId: '$shoporderclones.OrderId',
              date: '$shoporderclones.date',
              created: '$shoporderclones.created',
            },
          },
        ],
        as: 'groupOrders',
      },
    },
    {
      $project: {
        shopOrderCloneId: '$wdfsaf._id',
        groupId: 1,
        totalOrders: { $size: '$dataDetails' },
        assignDate: 1,
        assignTime: 1,
        manageDeliveryStatus: 1,
        Pending: '$Pending.pending',
        deliveryExecutiveId: 1,
        deliveryExecutiveName: '$UserName.name',
        pettyCashAllocateStatus: 1,
        pettyStockAllocateStatus: 1,
        status: 1,
        groupOrders: '$groupOrders',
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await wardAdminGroup.aggregate([
    { $match: { $and: [statusMatch, macthStatus] } },
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
                        $project: {
                          Amount: { $multiply: ['$finalQuantity', '$finalPricePerKg'] },
                          GST_Number: 1,
                        },
                      },
                      {
                        $project: {
                          sum: '$sum',
                          percentage: {
                            $divide: [
                              {
                                $multiply: ['$GST_Number', '$Amount'],
                              },
                              100,
                            ],
                          },
                          value: '$Amount',
                        },
                      },
                      {
                        $project: {
                          price: { $sum: ['$value', '$percentage'] },
                          value: '$value',
                          GST: '$percentage',
                        },
                      },
                      { $group: { _id: null, price: { $sum: '$price' } } },
                    ],
                    as: 'productorderclones',
                  },
                },
                {
                  $unwind: '$productorderclones',
                },
                {
                  $lookup: {
                    from: 'productorderclones',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'productorderclonescount',
                  },
                },
                {
                  $project: {
                    _id: 1,
                    status: 1,
                    productStatus: 1,
                    customerDeliveryStatus: 1,
                    receiveStatus: 1,
                    pettyCashReceiveStatus: 1,
                    AssignedStatus: 1,
                    completeStatus: 1,
                    UnDeliveredStatus: 1,
                    delivery_type: 1,
                    Payment: 1,
                    devevery_mode: 1,
                    time_of_delivery: 1,
                    total: 1,
                    gsttotal: 1,
                    subtotal: 1,
                    SGST: 1,
                    CGST: 1,
                    paidamount: 1,
                    Uid: 1,
                    OrderId: 1,
                    customerBillId: 1,
                    date: 1,
                    time: 1,
                    created: 1,
                    statusUpdate: 1,
                    WA_assigned_Time: 1,
                    deliveryExecutiveId: 1,
                    WL_Packed_Time: 1,
                    totalPrice: '$productorderclones.price',
                    productCount: {
                      $size: '$productorderclonescount',
                    },
                  },
                },
              ],
              as: 'shopDatas',
            },
          },
          { $unwind: '$shopDatas' },
          {
            $project: {
              _id: '$shopDatas._id',
              status: '$shopDatas.status',
              productStatus: '$shopDatas.productStatus',
              customerDeliveryStatus: '$shopDatas.customerDeliveryStatus',
              receiveStatus: '$shopDatas.receiveStatus',
              pettyCashReceiveStatus: '$shopDatas.pettyCashReceiveStatus',
              AssignedStatus: '$shopDatas.AssignedStatus',
              completeStatus: '$shopDatas.completeStatus',
              UnDeliveredStatus: '$shopDatas.UnDeliveredStatus',
              delivery_type: '$shopDatas.delivery_type',
              Payment: '$shopDatas.Payment',
              devevery_mode: '$shopDatas.devevery_mode',
              time_of_delivery: '$shopDatas.time_of_delivery',
              OrderId: '$shopDatas.OrderId',
              customerBillId: '$shopDatas.customerBillId',
              date: '$shopDatas.date',
              time: '$shopDatas.time',
              created: '$shopDatas.created',
              statusUpdate: '$shopDatas.statusUpdate',
              WA_assigned_Time: '$shopDatas.WA_assigned_Time',
              deliveryExecutiveId: '$shopDatas.deliveryExecutiveId',
              totalPrice: '$shopDatas.totalPrice',
              paidamount: '$shopDatas.paidamount',
              productCount: '$shopDatas.productCount',
            },
          },
        ],
        as: 'orderassigns',
      },
    },

    {
      $project: {
        orderassigns: '$orderassigns',
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
  if (datas.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'order not Found');
  }
  return { datas: datas[0].orderassigns, total: total.length };
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
        totalQuantity: '$TotalQuantityData.Qty',
        OperatorName: '$deliveryExecutiveName.name',
        GSTamount: { $divide: [{ $multiply: [{ $multiply: ['$finalQuantity', '$finalPricePerKg'] }, '$GST_Number'] }, 100] },
        totalRupees: {
          $add: [
            { $multiply: ['$finalQuantity', '$finalPricePerKg'] },
            { $divide: [{ $multiply: [{ $multiply: ['$finalQuantity', '$finalPricePerKg'] }, '$GST_Number'] }, 100] },
          ],
        },
        CGSTAmount: {
          $divide: [
            { $divide: [{ $multiply: [{ $multiply: ['$finalQuantity', '$finalPricePerKg'] }, '$GST_Number'] }, 100] },
            2,
          ],
        },
        SGSTAmount: {
          $divide: [
            { $divide: [{ $multiply: [{ $multiply: ['$finalQuantity', '$finalPricePerKg'] }, '$GST_Number'] }, 100] },
            2,
          ],
        },
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

    {
      $lookup: {
        from: 'orderassigns',
        localField: '_id',
        foreignField: 'wardAdminGroupID',
        as: 'orderassignsdatas',
      },
    },
    { $unwind: '$orderassignsdatas' },

    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'orderassignsdatas.orderId',
        foreignField: '_id',
        as: 'shoporderclonesdatas',
      },
    },
    { $unwind: '$shoporderclonesdatas' },
    {
      $lookup: {
        from: 'productorderclones',
        localField: 'shoporderclonesdatas._id',
        foreignField: 'orderId',
        pipeline: [
          {
            $group: {
              _id: null,
              amount: {
                $sum: {
                  $add: ['$finalQuantity', '$finalPricePerKg'],
                },
              },
            },
          },
        ],

        as: 'productorderclonesData',
      },
    },
    {
      $unwind: '$productorderclonesData',
    },

    {
      $project: {
        groupId: 1,
        shopOrderCloneId: '$shoporderclonesdatas._id',
        orderId: '$shoporderclonesdatas.OrderId',
        Amount: '$shoporderclonesdatas.overallTotal',
        // shopType: '$Orderdatas.type',
        // shopName: '$Orderdatas.shopName',
        Deliverystatus: '$shoporderclonesdatas.customerDeliveryStatus',
        FinalPaymentType: '$shoporderclonesdatas.payType',
        initialPaymentType: '$shoporderclonesdatas.Payment',
        pettyCashApporvedStatus: '$shoporderclonesdatas.pettyCashReceiveStatus',
        Amount: '$productorderclonesData.amount',
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
      $lookup: {
        from: 'orderassigns',
        localField: '_id',
        foreignField: 'wardAdminGroupID',
        as: 'orderassignsdatas',
      },
    },
    { $unwind: '$orderassignsdatas' },

    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'orderassignsdatas.orderId',
        foreignField: '_id',
        as: 'shoporderclonesdatas',
      },
    },
    { $unwind: '$shoporderclonesdatas' },
    {
      $lookup: {
        from: 'productorderclones',
        localField: 'shoporderclonesdatas._id',
        foreignField: 'orderId',
        pipeline: [
          {
            $group: {
              _id: null,
              amount: {
                $sum: {
                  $add: ['$finalQuantity', '$finalPricePerKg'],
                },
              },
            },
          },
        ],

        as: 'productorderclonesData',
      },
    },
    {
      $unwind: '$productorderclonesData',
    },
  ]);
  return { values: values, total: total.length };
};

const getAllGroup = async (page) => {
  let values = await wardAdminGroup.aggregate([
    {
      $match: {
        $and: [{ manageDeliveryStatus: { $eq: 'Delivery Completed' } }],
      },
    },
    // {
    //   $unwind: '$Orderdatas',
    // },
    // {
    //   $lookup: {
    //     from: 'shoporderclones',
    //     localField: 'Orderdatas._id',
    //     foreignField: '_id',
    //     as: 'shopIDDatas',
    //   },
    // },
    // {
    //   $unwind: '$shopIDDatas',
    // },
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
        $and: [{ manageDeliveryStatus: { $eq: 'Delivery Completed' } }],
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
    { pettyStockAllocateStatus: 'Allocated' },
    { new: true }
  );
  console.log(pettyStockBody);
  product.forEach(async (e) => {
    pettyStockModel.create({
      wardAdminId: createPetty.id,
      productName: e.productName,
      productId: e.id,
      groupId: id,
      QTY: e.QTY,
      pettyStock: e.pettyStock,
      totalQtyIncludingPettyStock: e.QTY + e.pettyStock,
      date: moment().format('DD-MM-YYYY'),
      time: moment().format('hh:mm a'),
      created: moment(),
    });
  });
  return createPetty;
};

const getcashAmountViewFromDB = async (id) => {
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
        as: 'orderassignsdatas',
      },
    },
    { $unwind: '$orderassignsdatas' },

    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'orderassignsdatas.orderId',
        foreignField: '_id',
        as: 'shoporderclonesdatas',
      },
    },
    { $unwind: '$shoporderclonesdatas' },
    {
      $lookup: {
        from: 'productorderclones',
        localField: 'shoporderclonesdatas._id',
        foreignField: 'orderId',
        pipeline: [
          {
            $group: {
              _id: null,
              amount: {
                $sum: {
                  $add: ['$finalQuantity', '$finalPricePerKg'],
                },
              },
            },
          },
        ],

        as: 'productorderclonesData',
      },
    },
    {
      $unwind: '$productorderclonesData',
    },

    {
      $group: {
        _id: '$shoporderclonesdatas.payType',
        totalCash: { $sum: '$productorderclonesData.amount' },
      },
    },

   
  ]);

  let total = await wardAdminGroup.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },

    // {
    //   $lookup: {
    //     from: 'orderassigns',
    //     localField: '_id',
    //     foreignField: 'wardAdminGroupID',
    //     as: 'orderassignsdatas',
    //   },
    // },
    // { $unwind: '$orderassignsdatas' },

    // {
    //   $lookup: {
    //     from: 'shoporderclones',
    //     localField: 'orderassignsdatas.orderId',
    //     foreignField: '_id',
    //     as: 'shoporderclonesdatas',
    //   },
    // },
    // { $unwind: '$shoporderclonesdatas' },
    // {
    //   $lookup: {
    //     from: 'productorderclones',
    //     localField: 'shoporderclonesdatas._id',
    //     foreignField:'orderId',
    //     pipeline: [
    //       {
    //         $group: {
    //           _id: null,
    //           amount: {
    //             $sum: {
    //               $add: ['$finalQuantity', '$finalPricePerKg'],
    //             },
    //           },
    //         },
    //       },
    //     ],

    //     as: 'productorderclonesData',
    //   }
    // },
    // {
    //   $unwind: "$productorderclonesData"
    // },

    {
      $project: {
        pettyCash: 1,
      },
    },
  ]);

  return { values: values, total: total };
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
    throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
  }
  updateBody.product.forEach(async (e) => {
    await pettyStockModel.create({
      productName: e.productName,
      productId: e.id,
      groupId: id,
      QTY: e.QTY,
      pettyStock: e.pettyStock,
      totalQtyIncludingPettyStock: e.QTY + e.pettyStock,
      date: moment.format('DD-MM-YYYY'),
      time: moment.format('hh:mm a'),
      created: moment(),
    });
  });
  return product;
};

const getShopDetailsForProj = async (id) => {
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
        as: 'b2bshopData',
      },
    },
    {
      $unwind: '$b2bshopData',
    },
    {
      $lookup: {
        from: 'streets',
        localField: 'b2bshopData.Strid',
        foreignField: '_id',
        as: 'StridData',
      },
    },
    {
      $unwind: '$StridData',
    },
    {
      $lookup: {
        from: 'wards',
        localField: 'b2bshopData.Wardid',
        foreignField: '_id',
        as: 'wardData',
      },
    },
    {
      $unwind: '$wardData',
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'deliveryExecutiveId',
        foreignField: '_id',
        as: 'deliveryExecutivename',
      },
    },
    {
      $unwind: '$deliveryExecutivename',
    },
    {
      $project: {
        Payment: 1,
        OrderId: 1,
        shopType: '$b2bshopData.type',
        shopName: '$b2bshopData.SName',
        SOwner: '$b2bshopData.SOwner',
        mobile: '$b2bshopData.mobile',
        address: '$b2bshopData.address',
        street: '$StridData.street',
        ward: '$wardData.ward',
        deliveryExecutivename: '$deliveryExecutivename.name',
      },
    },
  ]);
  return values;
};

const submitCashGivenByWDE = async (id, updateBody) => {
  let deliveryStatus = await wardAdminGroup.findById(id);
  console.log(deliveryStatus);
  if (!deliveryStatus) {
    throw new ApiError(httpStatus.NOT_FOUND, 'status not found');
  }
  deliveryStatus = await wardAdminGroup.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  console.log(deliveryStatus);

  return deliveryStatus;
};

const createAddOrdINGrp = async (id, body) => {
  let datas = await wardAdminGroup.findById(id);
  if (!datas) {
    throw new ApiError(httpStatus.NOT_FOUND, 'status not found');
  }
  await wardAdminGroup.update({ _id: id }, { $push: { Orderdatas: body } }, { new: true });
  let serverdates = moment().format('YYYY-MM-DD');
  let servertime = moment().format('hh:mm a');
  body.forEach(async (e) => {
    const group = await wardAdminGroupModel_ORDERS.findOne({
      wardAdminGroupID: id,
      orderId: e._id,
      date: serverdates,
    });
    if (!group) {
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
      await wardAdminGroupModel_ORDERS.create({
        wardAdminGroupID: id,
        orderId: e._id,
        date: serverdates,
        time: servertime,
        created: moment(),
        AssignedstatusPerDay: 2,
      });
    }
  });

  return 'works';
};



const finishingAccount = async (id,page)=>{
  let data = await wardAdminGroupModel_ORDERS.aggregate([
    {
      $match: {
        $and: [{ wardAdminGroupID: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'orderId',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from:'productorderclones',
              localField: '_id',
              foreignField: 'orderId',
              pipeline: [
                {
                  $project: {
                    Amount: { $multiply: ['$finalQuantity', '$finalPricePerKg'] },
                    GST_Number: 1,
                  },
                },
                {
                  $project: {
                    sum: '$sum',
                    percentage: {
                      $divide: [
                        {
                          $multiply: ['$GST_Number', '$Amount'],
                        },
                        100,
                      ],
                    },
                    value: '$Amount',
                  },
                },
                {
                  $project: {
                    price: { $sum: ['$value', '$percentage'] },
                    value: '$value',
                    GST: '$percentage',
                  },
                },
                { $group: { _id: null, price: { $sum: '$price' } } },
             
                    ],
              as: 'productData',
            }
          },
          { $unwind: "$productData"},
          {
            $lookup: {  
              from: 'orderpayments',
              localField: '_id',
              foreignField: 'orderId',
              pipeline: [
                      {
                        
                          $match: {
                            $and: [{ type: { $eq: 'advanced' } }],
                          },
                        
                    },
                  ],
              as: 'orderData',
            },
          },
          { $unwind: "$orderData"},
          {
            $lookup: {
              from: 'orderpayments',
              localField: '_id',
              foreignField: 'orderId',
              pipeline: [
                      {
                        
                          $match: {
                            $and: [{ type: { $ne: 'advanced' } }],
                          },
                        
                    },
                  ],
              as: 'orderDataNotEqual',
            },
            
          },
          { $unwind: "$orderDataNotEqual"},
        ],
        as: 'shopData',
      }
    },
    { $unwind: "$shopData"},
    {
      $project: {
        wardAdminGroupID:1,
       deliveryStatus: "$shopData.status",
       order: "$shopData.OrderId",
       originalOrderId: "$shopData._id",


   
       productAmountWithGST: "$shopData.productData.price",
       initialPaymentType: "$shopData.orderData.paymentMethod",
       initialpaymenyCapacity: "$shopData.orderData.pay_type",
        paidAmount: "$shopData.orderData.paidAmt",


        type: "$shopData.orderDataNotEqual.type",
        paytype: "$shopData.orderDataNotEqual.payType",
       FinalPaymentType: "$shopData.orderDataNotEqual.paymentMethod",
       Finalpaymentcapacity: "$shopData.orderDataNotEqual.pay_type",
        finalpaidAmount: "$shopData.orderDataNotEqual.paidAmt",

        PendinAmount: { 

          $subtract: [ "$shopData.productData.price", "$shopData.orderData.paidAmt" ] } 
          
      }
    },
    { $skip: 10 * page },
    { $limit: 10 },
  
  ]);


          let total = await wardAdminGroupModel_ORDERS.aggregate([
            {
              $match: {
                $and: [{ wardAdminGroupID: { $eq: id } }],
              },
            },
            {
              $lookup: {
                from: 'shoporderclones',
                localField: 'orderId',
                foreignField: '_id',
                pipeline: [
                  {
                    $lookup: {
                      from:'productorderclones',
                      localField: '_id',
                      foreignField: 'orderId',
                      pipeline: [
                        {
                          $project: {
                            Amount: { $multiply: ['$finalQuantity', '$finalPricePerKg'] },
                            GST_Number: 1,
                          },
                        },
                        {
                          $project: {
                            sum: '$sum',
                            percentage: {
                              $divide: [
                                {
                                  $multiply: ['$GST_Number', '$Amount'],
                                },
                                100,
                              ],
                            },
                            value: '$Amount',
                          },
                        },
                        {
                          $project: {
                            price: { $sum: ['$value', '$percentage'] },
                            value: '$value',
                            GST: '$percentage',
                          },
                        },
                        { $group: { _id: null, price: { $sum: '$price' } } },
                     
                            ],
                      as: 'productData',
                    }
                  },
                  { $unwind: "$productData"},
                  {
                    $lookup: {  
                      from: 'orderpayments',
                      localField: '_id',
                      foreignField: 'orderId',
                      pipeline: [
                              {
                                
                                  $match: {
                                    $and: [{ type: { $eq: 'advanced' } }],
                                  },
                                
                            },
                          ],
                      as: 'orderData',
                    },
                  },
                  { $unwind: "$orderData"},
                  {
                    $lookup: {
                      from: 'orderpayments',
                      localField: '_id',
                      foreignField: 'orderId',
                      pipeline: [
                              {
                                
                                  $match: {
                                    $and: [{ type: { $ne: 'advanced' } }],
                                  },
                                
                            },
                          ],
                      as: 'orderDataNotEqual',
                    },
                    
                  },
                  { $unwind: "$orderDataNotEqual"},
                ],
                as: 'shopData',
              }
            },
            { $unwind: "$shopData"},
          ]);


          let partialCount = await wardAdminGroupModel_ORDERS.aggregate([
            {
              $match: {
                $and: [{ wardAdminGroupID: { $eq: id } }],
              },
            },
            {
              $lookup: {
                from: 'shoporderclones',
                localField: 'orderId',
                foreignField: '_id',
                pipeline: [{
                  $match: {
                    $and: [{ pay_type: { $eq: "Partial" } }],
                  },
                }],
                as: 'shopdatadata'
              }
            },
            {
              $unwind: "$shopdatadata"
            },
            {
              $project: {
                partialCount : "$partialCount.shopdatadata.pay_type"
              }
            }
        
          ]);

          let partialTotalCount = await wardAdminGroupModel_ORDERS.aggregate([
            {
              $match: {
                $and: [{ wardAdminGroupID: { $eq: id } }],
              },
            },
            {
              $lookup: {
                from: 'shoporderclones',
                localField: 'orderId',
                foreignField: '_id',
                pipeline: [{
                  $match: {
                    $and: [{ pay_type: { $eq: "Partial" } }],
                  },
                }],
                as: 'shopdatadata'
              }
            },
            {
              $unwind: "$shopdatadata"
            },
        
          ]);



          let UnDeliveredTotal  = await wardAdminGroupModel_ORDERS.aggregate([
            {
              $match: {
                $and: [{ wardAdminGroupID: { $eq: id } }],
              },
            },
            {
              $lookup: {
                from: 'shoporderclones',
                localField: 'orderId',
                foreignField: '_id',
                pipeline: [{
                  $match: {
                    $and: [{ status: { $eq: "UnDelivered" } }],
                  },
                }],
                as: 'shopdatadata'
              }
            },
            {
              $unwind: "$shopdatadata"
            },
            {
              $project: {
                status : "$UnDeliveredTotal.shopdatadata.status"
              }
            }
        
          ]);

          let UnDeliveredTotalCount  = await wardAdminGroupModel_ORDERS.aggregate([
            {
              $match: {
                $and: [{ wardAdminGroupID: { $eq: id } }],
              },
            },
            {
              $lookup: {
                from: 'shoporderclones',
                localField: 'orderId',
                foreignField: '_id',
                pipeline: [{
                  $match: {
                    $and: [{ status: { $eq: "UnDelivered" } }],
                  },
                }],
                as: 'shopdatadata'
              }
            },
            {
              $unwind: "$shopdatadata"
            },
        
          ]);


  

  return {data: data, total: total.length,partialCount:partialCount,partialTotalCount: partialTotalCount.length,UnDeliveredTotal:UnDeliveredTotal,UnDeliveredTotalCount:UnDeliveredTotalCount.length   };

}


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
  updateManageStatuscash,
  updateManageStatuscollected,
  updateManageStatuscashcollect,
  updateordercomplete,
  delevery_start,

  getShopDetailsForProj,
  submitCashGivenByWDE,
  createAddOrdINGrp,
  updateOrderStatus_forundelivey,

  finishingAccount,
};
