const httpStatus = require('http-status');
const { ShopOrder, ProductorderSchema, ShopOrderClone, ProductorderClone } = require('../models/shopOrder.model');
const ProductPacktype = require('../models/productPacktype.model');
const { Product } = require('../models/product.model');
const { Shop } = require('../models/b2b.ShopClone.model');
const OrderPayment = require('../models/orderpayment.model');
const UserRole = require('../models/roles.model.js');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const { Users } = require('../models/B2Busers.model');
const CallHistory = require('../models/b2b.callHistory.model');

const createshopOrder = async (shopOrderBody, userid) => {
  let { product, date, time, shopId, time_of_delivery } = shopOrderBody;
  let timeslot = time_of_delivery.replace('-', '');
  let body = { ...shopOrderBody, ...{ Uid: userid, timeslot: timeslot } };
  let createShopOrder = await ShopOrder.create(body);
  product.forEach(async (e) => {
    ProductorderSchema.create({
      orderId: createShopOrder.id,
      productid: e.productid,
      quantity: e.quantity,
      priceperkg: e.priceperkg,
      date: date,
      time: time,
      customerId: shopId,
    });
  });
  return createShopOrder;
};

const createshopOrderClone = async (body, userid) => {
  let currentDate = moment().format('YYYY-MM-DD');
  let currenttime = moment().format('HHmmss');
  const Buy = await ShopOrderClone.find({ date: currentDate });
  let center = '';
  if (Buy.length < 9) {
    center = '0000';
  }
  if (Buy.length < 99 && Buy.length >= 9) {
    center = '000';
  }
  if (Buy.length < 999 && Buy.length >= 99) {
    center = '00';
  }
  if (Buy.length < 9999 && Buy.length >= 999) {
    center = '0';
  }
  let userId = '';
  let totalcount = Buy.length + 1;

  userId = 'OD' + center + totalcount;

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
  let timeslot = body.time_of_delivery.replace('-', '');
  let paidamount = body.paidamount;
  if (body.paidamount == null) {
    paidamount = 0;
  }
  let reorder_status = false;
  if (body.RE_order_Id != null) {
    reorder_status = true;
    let shoss = await ShopOrderClone.findByIdAndUpdate(
      { _id: body.RE_order_Id },
      { RE_order_status: 'Re-Ordered', Re_order_userId: userid },
      { new: true }
    );
    // if (body.pay_type != 'Fully') {
    //   paidamount = shoss.paidamount + paidamount;
    // }
  }
  let Payment = body.Payment;
  if (body.Payment == 'Continue' || body.Payment == 'addmore') {
    Payment = 'Paynow';
  }
  let bod = {
    ...body,
    ...{
      Uid: userid,
      OrderId: userId,
      customerBillId: BillId,
      date: currentDate,
      time: currenttime,
      created: moment(),
      timeslot: timeslot,
      paidamount: paidamount,
      reorder_status: reorder_status,
      Payment: Payment,
    },
  };

  let createShopOrderClone = await ShopOrderClone.create(bod);
  let Payment_type = body.paymentMethod;
  if (body.Payment == 'cod') {
    Payment_type = null;
  }

  await OrderPayment.create({
    uid: userid,
    paidAmt: paidamount,
    date: currentDate,
    time: currenttime,
    created: moment(),
    orderId: createShopOrderClone._id,
    type: 'advanced',
    pay_type: body.pay_type,
    payment: body.Payment,
    paymentMethod: Payment_type,
    RE_order_Id: body.RE_order_Id,
    reorder_status: reorder_status,
  });
  let { product, time, shopId } = body;
  await Shop.findByIdAndUpdate({ _id: shopId }, { callingStatus: 'accept', callingStatusSort: 6 }, { new: true });
  product.forEach(async (e) => {
    let priceperkg = e.priceperkg;
    if (body.RE_order_Id != null) {
      priceperkg = e.salesmanprice;
    }
    ProductorderClone.create({
      orderId: createShopOrderClone.id,
      productid: e.productid,
      quantity: e.quantity,
      priceperkg: priceperkg,
      GST_Number: e.GST_Number,
      HSN_Code: e.HSN_Code,
      packtypeId: e.packtypeId,
      productpacktypeId: e._id,
      packKg: e.packKg,
      unit: e.unit,
      date: currentDate,
      time: currenttime,
      customerId: shopId,
      finalQuantity: e.quantity,
      finalPricePerKg: e.priceperkg,
      created: moment(),
    });
  });
  return createShopOrderClone;
};

const getAllShopOrderClone = async (date, page) => {
  let values = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [{ date: { $eq: date } }],
      },
    },
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'orderId',
        as: 'productOrderdata',
      },
    },
    {
      $unwind: '$productOrderdata',
    },

    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  let total = await ShopOrderClone.find().count();
  return { values: values, total: total };
};

const getShopOrderCloneById = async (id) => {
  console.log('hello');
  let Values = await ShopOrderClone.aggregate([
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
              as: 'products',
            },
          },
          {
            $unwind: '$products',
          },
          {
            $project: {
              _id: 1,
              status: 1,
              orderId: 1,
              productid: 1,
              quantity: 1,
              priceperkg: 1,
              GST_Number: 1,
              HSN_Code: 1,
              packtypeId: 1,
              packKg: 1,
              unit: 1,
              productTitle: '$products.productTitle',
              created: 1,
              finalQuantity: 1,
              finalPricePerKg: 1,
              GST_Number: 1,
              GSTamount: {
                $divide: [{ $multiply: [{ $multiply: ['$finalQuantity', '$priceperkg'] }, '$GST_Number'] }, 100],
              },
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
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $group: {
              _id: null,
              amount: {
                $sum: '$paidAmt',
              },
            },
          },
        ],
        as: 'orderpayments',
      },
    },
    {
      $unwind: {
        path: '$orderpayments',
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'RE_order_Id',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from: 'orderpayments',
              localField: '_id',
              foreignField: 'orderId',
              pipeline: [
                {
                  $group: {
                    _id: null,
                    amount: {
                      $sum: '$paidAmt',
                    },
                  },
                },
              ],
              as: 'orderpayments',
            },
          },
          {
            $unwind: {
              path: '$orderpayments',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              amount: '$orderpayments.amount',
            },
          },
        ],
        as: 'shoporderclones',
      },
    },
    {
      $unwind: {
        path: '$shoporderclones',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        reorderamount: { $ifNull: ['$shoporderclones.amount', 0] },
      },
    },
    {
      $project: {
        _id: 1,
        status: 1,
        delivery_type: 1,
        time_of_delivery: 1,
        total: 1,
        gsttotal: 1,
        subtotal: 1,
        SGST: 1,
        Uid: 1,
        shopId: 1,
        CGST: 1,
        paidamount: 1,
        OrderId: 1,
        created: 1,
        devevery_mode: 1,
        Payment: 1,
        productData: '$productData',
        shopName: '$shopData.SName',
        mobile: '$shopData.mobile',
        pay_type: 1,
        paymentMethod: 1,
        productDatadetails: '$productDatadetails',
        total: '$productDatadetails.amount',
        TotalGstAmount: { $sum: '$productData.GSTamount' },
        totalSum: { $add: ['$productDatadetails.amount', { $sum: '$productData.GSTamount' }] },
        paidamount: {
          $sum: ['$orderpayments.amount', '$reorderamount'],
        },
        shoporderclones: '$shoporderclones',
      },
    },
  ]);
  return Values;
};

const undelivered = async (page) => {
  let data = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [{ customerDeliveryStatus: { $eq: 'UnDelivered' } }],
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
      $lookup: {
        from: 'b2busers',
        localField: 'deliveryExecutiveId',
        foreignField: '_id',
        as: 'b2busersData',
      },
    },
    {
      $unwind: '$b2busersData',
    },
    {
      $lookup: {
        from: 'streets',
        localField: 'shopData.Strid',
        foreignField: '_id',
        as: 'streetsData',
      },
    },
    {
      $unwind: '$streetsData',
    },
    {
      $project: {
        _id: 1,
        OrderId: 1,
        Payment: 1,
        UnDeliveredStatus: 1,
        street: '$streetsData.street',
        type: '$shopData.type',
        SName: '$shopData.SName',
        name: '$b2busersData.name',
      },
    },
    {
      $skip: 10 * parseInt(page),
    },
    {
      $limit: 10,
    },
  ]);
  let total = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [{ customerDeliveryStatus: { $eq: 'UnDelivered' } }],
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
      $lookup: {
        from: 'b2busers',
        localField: 'deliveryExecutiveId',
        foreignField: '_id',
        as: 'b2busersData',
      },
    },
    {
      $unwind: '$b2busersData',
    },
    {
      $lookup: {
        from: 'streets',
        localField: 'shopData.Strid',
        foreignField: '_id',
        as: 'streetsData',
      },
    },
    {
      $unwind: '$streetsData',
    },
    {
      $project: {
        _id: 1,
        OrderId: 1,
        payType: 1,
        UnDeliveredStatus: 1,
        street: '$streetsData.street',
        type: '$shopData.type',
        SName: '$shopData.SName',
        name: '$b2busersData.name',
      },
    },
  ]);
  return { data: data, total: total.length };
};

const updateShopOrderCloneById = async (id, updatebody) => {
  let shoporderClone = await ShopOrderClone.findById(id);
  if (!shoporderClone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ShopOrderClone Not Found');
  }
  shoporderClone = await ShopOrderClone.findByIdAndUpdate({ _id: id }, updatebody, { new: true });
  return shoporderClone;
};

const updateshop_order = async (id, body, userid) => {
  let shoporder = await ShopOrderClone.findById(id);
  if (!shoporder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  let timeslot = body.time_of_delivery.replace('-', '');
  let Payment = body.Payment;
  if (body.Payment == 'Continue' || body.Payment == 'addmore') {
    Payment = 'Paynow';
  }
  shoporder = await ShopOrderClone.findByIdAndUpdate(
    { _id: id },
    { ...body, ...{ timeslot: timeslot, Payment: Payment } },
    { new: true }
  );
  let currentDate = moment().format('YYYY-MM-DD');
  let currenttime = moment().format('HHmmss');
  if (body.Payment == 'addmore' || body.Payment == 'Paynow') {
    await OrderPayment.create({
      uid: userid,
      paidAmt: body.paidamount,
      date: currentDate,
      time: currenttime,
      created: moment(),
      orderId: shoporder._id,
      type: 'advanced',
    });
  }

  await ProductorderClone.deleteMany({ orderId: id });
  let { product, date, time, shopId } = body;
  product.forEach(async (e) => {
    let packtypeId = await ProductPacktype.findOne({ packtypeId: e.packtypeId, productId: e.productid });
    await ProductorderClone.create({
      orderId: id,
      productid: e.productid,
      quantity: e.quantity,
      priceperkg: e.priceperkg,
      GST_Number: e.GST_Number,
      HSN_Code: e.HSN_Code,
      packtypeId: e.packtypeId,
      productpacktypeId: packtypeId._id,
      packKg: e.packKg,
      unit: e.unit,
      date: shoporder.date,
      time: shoporder.time,
      customerId: shopId,
      finalQuantity: e.quantity,
      finalPricePerKg: e.priceperkg,
      created: shoporder.created,
    });
  });
  return shoporder;
};

const deleteShopOrderCloneById = async (id) => {
  let shoporderClone = await ShopOrderClone.findById(id);
  if (!shoporderClone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ShopOrderClone Not Found');
  }
  (shoporderClone.active = false), (shoporderClone.archive = true);
  await shoporderClone.save();
};

const createProductOrderClone = async (body) => {
  const productorderClone = await ProductorderClone.create(body);
  return productorderClone;
};

const getAllProductOrderClone = async () => {
  return await ProductorderClone.find();
};

const getProductOrderCloneById = async (id) => {
  const productorderClone = await ProductorderClone.findById(id);
  if (!productorderClone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ProductOrderClone not found');
  }
  return productorderClone;
};

const updateProductOrderCloneById = async (id, updateBody) => {
  let productorderClone = await ProductorderClone.findById(id);
  if (!productorderClone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ProductOrderClone not found');
  }
  productorderClone = await ProductorderClone.findByIdAndUpdate({ _id: id }, updateBody, { new: true });

  return productorderClone;
};

const deleteProductOrderClone = async (id) => {
  let productorderClone = await ProductorderClone.findById(id);
  if (!productorderClone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ProductOrderClone not found');
  }
  (productorderClone.active = false), (productorderClone.archive = true);
  await productorderClone.save();
};

const getShopNameWithPagination = async (page, userId) => {
  console.log(userId);
  return ShopOrder.aggregate([
    {
      $match: {
        $and: [{ Uid: { $eq: userId } }],
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
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
};

const getShopNameCloneWithPagination = async (page, userId) => {
  let today = moment().format('yyyy-MM-DD');
  let value = await ShopOrderClone.aggregate([
    {
      $sort: { date: -1, time: -1 },
    },
    {
      $match: {
        $and: [{ Uid: { $eq: userId } }],
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
      $lookup: {
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $group: {
              _id: null,
              amount: {
                $sum: '$paidAmt',
              },
            },
          },
        ],
        as: 'orderpayments',
      },
    },
    {
      $unwind: {
        path: '$orderpayments',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'RE_order_Id',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from: 'orderpayments',
              localField: '_id',
              foreignField: 'orderId',
              pipeline: [
                {
                  $group: {
                    _id: null,
                    amount: {
                      $sum: '$paidAmt',
                    },
                  },
                },
              ],
              as: 'orderpayments',
            },
          },
          {
            $unwind: {
              path: '$orderpayments',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              amount: '$orderpayments.amount',
            },
          },
        ],
        as: 'shoporderclones',
      },
    },
    {
      $unwind: {
        path: '$shoporderclones',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        reorderamount: { $ifNull: ['$shoporderclones.amount', 0] },
      },
    },
    {
      $project: {
        _id: 1,
        created: 1,
        delivery_type: 1,
        time_of_delivery: 1,
        total: 1,
        gsttotal: 1,
        subtotal: 1,
        SGST: 1,
        CGST: 1,
        OrderId: 1,
        productTotal: { $size: '$product' },
        paidamount: { $sum: ['$orderpayments.amount', '$reorderamount'] },
        shopName: '$shopData.SName',
        contact: '$shopData.mobile',
        status: 1,
        timeslot: 1,
        date: 1,
        datematch: { $eq: ['$date', today] },
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let retrunValue = [];
  let total = await ShopOrderClone.find({ Uid: { $eq: userId } }).count();
  let yesterday = moment().subtract(1, 'days').format('yyyy-MM-DD');
  let threeDay = moment().subtract(2, 'days').format('yyyy-MM-DD');
  let hover = moment().subtract(-1, 'hours').format('H');
  let timeslot = [
    { start: 10, end: 20 },
    { start: 20, end: 30 },
    { start: 30, end: 40 },
    { start: 40, end: 50 },
    { start: 50, end: 60 },
    { start: 60, end: 70 },
    { start: 70, end: 80 },
    { start: 80, end: 90 },
    { start: 900, end: 1000 },
    { start: 1000, end: 1100 },
    { start: 1100, end: 1200 },
    { start: 1200, end: 1300 },
    { start: 1300, end: 1400 },
    { start: 1400, end: 1500 },
    { start: 1500, end: 1600 },
    { start: 1600, end: 1700 },
    { start: 1700, end: 1800 },
    { start: 1800, end: 1900 },
    { start: 1900, end: 2000 },
    { start: 2000, end: 2100 },
    { start: 2100, end: 2200 },
    { start: 2200, end: 2300 },
    { start: 2300, end: 2400 },
    { start: 2400, end: 2500 },
  ];
  let lapsed = timeslot[hover].start;
  let statuss = [
    'Acknowledged',
    'Approved',
    'Modified',
    'Packed',
    'Assigned',
    'Order Picked',
    'Delivery start',
    'UnDelivered',
    'ordered',
  ];
  value.forEach((e) => {
    console.log(statuss.find((element) => element == e.status));
    let lapsedd = false;
    if (
      (e.date = today && e.delivery_type == 'IMD' && e.timeslot <= lapsed) ||
      (e.date = yesterday && e.delivery_type == 'NDD' && e.timeslot <= lapsed) ||
      (e.date = threeDay && e.status == 'Acknowledged' && e.status == '' && e.status == '')
    ) {
      lapsedd = true;
      console.log(e);
    }
    retrunValue.push({ ...e, ...{ lapsed: lapsedd } });
  });
  // console.log(value);
  return {
    value: retrunValue,
    total: total,
    retrunValue: retrunValue,
  };
};

const getAllShopOrder = async (UserRole) => {
  let value;
  if (UserRole == '') console.log(UserRole);
  return ShopOrder.find();
};

const getShopOrderById = async (shopOrderId) => {
  const shoporder = await ShopOrder.findById(shopOrderId);
  if (!shoporder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'shoporder  Not Found');
  }
  return shoporder;
};

const getProductDetailsByProductId = async (id) => {
  return await ShopOrder.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: 'product.productid',
        foreignField: '_id',
        as: 'products',
      },
    },
    {
      $unwind: '$products',
    },

    {
      $project: {
        districtName: { $eq: ['$_id', '$products.productid'] },
        product: 1,
      },
    },
  ]);
};

const updateShopOrderById = async (shopOrderId, updateBody) => {
  let shoporder = await getShopOrderById(shopOrderId);
  if (!shoporder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'shoporder not found');
  }
  let timeslot = updateBody.time_of_delivery.replace('-', '');
  let body = { ...updateBody, ...{ timeslot: parseInt(timeslot) } };
  shoporder = await ShopOrder.findByIdAndUpdate({ _id: shopOrderId }, body, { new: true });
  return shoporder;
};

const deleteShopOrderById = async (shopOrderId) => {
  const shoporder = await getSetSalesPriceById(shopOrderId);
  if (!shoporder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'shoporder not found');
  }
  (shoporder.active = false), (shoporder.archive = true), await shoporder.save();
  return shoporder;
};

// TELECALLER

const getAll = async () => {
  return ShopOrderClone.find();
};

const createOrderId = async (body) => {
  return ShopOrderClone.create(body);
};

const getShopDetailsByOrder = async (id) => {
  let values = await ShopOrderClone.aggregate([
    {
      $match: { _id: id },
    },
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
        shopId: '$b2bshopclones._id',
        shopName: '$b2bshopclones.SName',
        shopOwner: '$b2bshopclones.SOwner',
        shopMobile: '$b2bshopclones.mobile',
        shoplatitude: '$b2bshopclones.Slat',
        shoplongitude: '$b2bshopclones.Slong',
        shopAddress: '$b2bshopclones.address',
      },
    },
  ]);
  return values;
};

const B2BManageOrders = async (shopid) => {
  let values = await ShopOrderClone.aggregate([
    {
      $match: {
        _id: shopid,
      },
    },
    {
      $project: {
        _id: 1,
        total: 1,
        shopId: 1,
        status: 1,
        OrderId: 1,
        date: 1,
      },
    },
  ]);
  return values;
};

const getManageordersByOrderId = async (orderId, date) => {
  let values = await ShopOrderClone.aggregate([
    {
      $match: {
        OrderId: orderId,
        date: date,
      },
    },
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'orderId',
        as: 'orders',
      },
    },
    {
      $unwind: '$orders',
    },
    {
      $lookup: {
        from: 'products',
        localField: 'orders.productid',
        foreignField: '_id',
        as: 'products',
      },
    },
    {
      $unwind: '$products',
    },
    {
      $project: {
        productTitle: '$products.productTitle',
        Qty: '$orders.quantity',
        price: '$orders.priceperkg',
        productId: '$products._id',
        productOrdersCloneId: '$orders._id',
        totalValue: { $multiply: ['$orders.quantity', '$orders.priceperkg'] },
      },
    },
    // {
    //   $group: { _id: null, Qty: { $sum: '$totalValue' } },
    // },
  ]);
  let total = await ShopOrderClone.aggregate([
    {
      $match: {
        OrderId: orderId,
        date: date,
      },
    },
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'orderId',
        as: 'orders',
      },
    },
    {
      $unwind: '$orders',
    },
    {
      $lookup: {
        from: 'products',
        localField: 'orders.productid',
        foreignField: '_id',
        as: 'products',
      },
    },
    {
      $unwind: '$products',
    },
    {
      $project: {
        productTitle: '$products.productTitle',
        Qty: '$orders.quantity',
        price: '$orders.priceperkg',
        productId: '$products._id',
        productOrdersCloneId: '$orders._id',
        totalValue: { $multiply: ['$orders.quantity', '$orders.priceperkg'] },
      },
    },
    {
      $group: { _id: null, Qty: { $sum: '$+' } },
    },
  ]);
  let totalqty = total[0];
  return { values: values, total: totalqty.Qty };
};
const getproductOrders_By_OrderId = async (orderId) => {
  let todaydate = moment().subtract(1, 'days').format('YYYY-MM-DD');
  let values = await ShopOrderClone.aggregate([
    {
      $match: {
        OrderId: orderId,
        date: todaydate,
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
              from: 'products',
              localField: 'productid',
              foreignField: '_id',
              as: 'products',
            },
          },
          {
            $unwind: '$products',
          },
          {
            $project: {
              _id: 1,
              priceperkg: 1,
              quantity: 1,
              productTitle: '$products.productTitle',
              productId: '$products._id',
              Amount: { $multiply: ['$priceperkg', '$quantity'] },
            },
          },
        ],
        as: 'productData',
      },
    },
    {
      $project: {
        _id: 1,
        productData: '$productData',
        shopId: 1,
      },
    },
  ]);
  return values;
};

const productData = async (id) => {
  let data = await ShopOrderClone.aggregate([
    {
      $match: { _id: id },
    },
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'orderId',
        as: 'orders',
      },
    },
    {
      $unwind: '$orders',
    },
    {
      $lookup: {
        from: 'products',
        localField: 'orders.productid',
        foreignField: '_id',
        as: 'products',
      },
    },
    {
      $unwind: '$products',
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'b2bshopclonesData',
      },
    },
    {
      $unwind: '$b2bshopclonesData',
    },
    {
      $project: {
        productTitle: '$products.productTitle',
        Qty: '$orders.finalQuantity',
        price: '$orders.finalPricePerKg',
        productid: '$orders.productid',
        shop: '$b2bshopclonesData.SName',
        totalValue: { $multiply: ['$orders.finalQuantity', '$orders.finalPricePerKg'] },
      },
    },
  ]);
  let total = await ShopOrderClone.aggregate([
    {
      $match: { _id: id },
    },
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'orderId',
        as: 'orders',
      },
    },
    {
      $unwind: '$orders',
    },
    {
      $lookup: {
        from: 'products',
        localField: 'orders.productid',
        foreignField: '_id',
        as: 'products',
      },
    },
    {
      $unwind: '$products',
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'b2bshopclonesData',
      },
    },
    {
      $unwind: '$b2bshopclonesData',
    },
    {
      $project: {
        productTitle: '$products.productTitle',
        Qty: '$orders.finalQuantity',
        price: '$orders.finalPricePerKg',
        totalValue: { $multiply: ['$orders.finalQuantity', '$orders.finalPricePerKg'] },
      },
    },
    {
      $group: { _id: null, Qty: { $sum: '$totalValue' } },
    },
  ]);
  let totalqty = total[0];
  return { data: data, total: totalqty.Qty };
};

const get_data_for_lapster = async (page) => {
  var today = moment().format('YYYY-MM-DD');
  var yersterday = moment().subtract(1, 'days').format('YYYY-MM-DD');

  console.log(today);
  let todaydata = await ShopOrderClone.aggregate([
    {
      $project: {
        statusupdate: { $dateToString: { format: '%Y-%m-%d', date: '$statusUpdate' } },
        _id: 1,
        shopId: 1,
        OrderId: 1,
        status: 1,
        statusUpdate: 1,
      },
    },
    {
      $match: {
        statusupdate: { $ne: null },
        statusupdate: { $eq: today },
        status: { $ne: 'Assigned', $ne: 'Rejected' },
      },
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [
          {
            $match: {
              date: today,
            },
          },
        ],
        as: 'callhistory',
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shops',
      },
    },
    {
      $unwind: '$shops',
    },
    {
      $project: {
        _id: 1,
        shopId: 1,
        status: 1,
        statusUpdate: 1,
        statusupdate: 1,
        OrderId: 1,
        callhistory: { $size: '$callhistory' },
        shopName: '$shops.SName',
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let yersterdaydata = await ShopOrderClone.aggregate([
    {
      $project: {
        statusupdate: { $dateToString: { format: '%Y-%m-%d', date: '$statusUpdate' } },
        _id: 1,
        shopId: 1,
        OrderId: 1,
        status: 1,
        statusUpdate: 1,
      },
    },
    {
      $match: {
        statusupdate: { $ne: null },
        statusupdate: { $eq: yersterday },
        status: { $ne: 'Assigned', $ne: 'Rejected' },
      },
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [
          {
            $match: {
              date: yersterday,
            },
          },
        ],
        as: 'callhistory',
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shops',
      },
    },
    {
      $unwind: '$shops',
    },
    {
      $project: {
        _id: 1,
        shopId: 1,
        status: 1,
        statusUpdate: 1,
        statusupdate: 1,
        OrderId: 1,
        callhistory: { $size: '$callhistory' },
        shopName: '$shops.SName',
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let yersterdaytotal = await ShopOrderClone.aggregate([
    {
      $project: {
        statusupdate: { $dateToString: { format: '%Y-%m-%d', date: '$statusUpdate' } },
        _id: 1,
        shopId: 1,
        OrderId: 1,
        status: 1,
        statusUpdate: 1,
      },
    },
    {
      $match: {
        statusupdate: { $ne: null },
        statusupdate: { $eq: yersterday },
        status: { $ne: 'Assigned', $ne: 'Rejected' },
      },
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [
          {
            $match: {
              date: yersterday,
            },
          },
        ],
        as: 'callhistory',
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shops',
      },
    },
    {
      $unwind: '$shops',
    },
  ]);
  let todaytotal = await ShopOrderClone.aggregate([
    {
      $project: {
        statusupdate: { $dateToString: { format: '%Y-%m-%d', date: '$statusUpdate' } },
        _id: 1,
        shopId: 1,
        OrderId: 1,
        status: 1,
        statusUpdate: 1,
      },
    },
    {
      $match: {
        statusupdate: { $ne: null },
        statusupdate: { $eq: today },
        status: { $ne: 'Assigned', $ne: 'Rejected' },
      },
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [
          {
            $match: {
              date: today,
            },
          },
        ],
        as: 'callhistory',
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shops',
      },
    },
    {
      $unwind: '$shops',
    },
  ]);
  return {
    todaydata: todaydata,
    yersterdaydata: yersterdaydata,
    yersterdaytotal: yersterdaytotal.length,
    todaytotal: todaytotal.length,
  };
};
const getLapsed_Data = async (page, userRoles, userId, method) => {
  console.log(userRoles, userId);
  let yersterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
  let todaydate = moment().format('YYYY-MM-DD');
  let matchvalue;
  if (method == 'lp') {
    matchvalue = [
      {
        callstatus: { $ne: 'callback' },
      },
      {
        callstatus: { $ne: 'accept' },
      },
      {
        callstatus: { $ne: 'declined' },
      },
      {
        callstatus: { $ne: 'reschedule' },
      },
      { status: { $ne: 'UnDelivered' } },
      { date: yersterday },
      { status: { $ne: 'Delivered' } },
      { status: { $ne: 'Rejected' } },
    ];
  }
  if (method == 're') {
    matchvalue = [
      {
        callstatus: { $ne: 'callback' },
      },
      {
        callstatus: { $ne: 'accept' },
      },
      {
        callstatus: { $ne: 'declined' },
      },
      {
        callstatus: { $ne: 'reschedule' },
      },
      { status: { $eq: 'Rejected' } },
    ];
  }
  if (method == 'un') {
    matchvalue = [
      {
        callstatus: { $ne: 'callback' },
      },
      {
        callstatus: { $ne: 'accept' },
      },
      {
        callstatus: { $ne: 'declined' },
      },
      {
        callstatus: { $ne: 'reschedule' },
      },
      { status: { $eq: 'UnDelivered' } },
    ];
  }
  let values = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: matchvalue,
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
              from: 'shoplists',
              localField: 'SType',
              foreignField: '_id',
              as: 'shoplists',
            },
          },
          {
            $unwind: '$shoplists',
          },
          {
            $project: {
              SName: 1,
              _id: 1,
              shopType: '$shoplists.shopList',
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
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [{ $match: { date: todaydate } }],
        as: 'callhistories',
      },
    },
    {
      $project: {
        _id: 1,
        shopId: 1,
        status: 1,
        OrderId: 1,
        customerBillId: 1,
        date: 1,
        delivery_type: 1,
        devevery_mode: 1,
        time_of_delivery: 1,
        Payment: 1,
        shops: '$shops.SName',
        shopType: '$shops.shopType',
        calls: { $size: '$callhistories' },
        callhistories: '$callhistories',
        created: 1,
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  let total = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: matchvalue,
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        // pipeline:[{$match:{lapsed:{$ne:true}}}],
        as: 'shops',
      },
    },
    {
      $unwind: '$shops',
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [{ $match: { date: todaydate } }],
        as: 'callhistories',
      },
    },
  ]);
  let userRole = await UserRole.findById(userRoles);
  let User = await Users.findById(userId);
  console.log(userRoles, userId);
  return { values: values, total: total.length, Role: userRole.roleName, User: User.name };
};

const getLapsed_Rejected = async (page, userRoles, userId) => {
  let yersterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
  let todaydate = moment().format('YYYY-MM-DD');
  let values = await ShopOrderClone.aggregate([
    {
      $match: { status: 'Rejected' },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shops',
      },
    },
    {
      $unwind: '$shops',
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [{ $match: { date: todaydate } }],
        as: 'callhistories',
      },
    },
    {
      $project: {
        _id: 1,
        shopId: 1,
        status: 1,
        OrderId: 1,
        customerBillId: 1,
        date: 1,
        delivery_type: 1,
        devevery_mode: 1,
        time_of_delivery: 1,
        Payment: 1,
        shops: '$shops.SName',
        calls: { $size: '$callhistories' },
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  let total = await ShopOrderClone.aggregate([
    {
      $match: { status: 'Rejected' },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shops',
      },
    },
    {
      $unwind: '$shops',
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [{ $match: { date: todaydate } }],
        as: 'callhistories',
      },
    },
  ]);
  let Pending = await ShopOrderClone.aggregate([
    {
      $match: { $and: [{ status: { $ne: 'UnDelivered' } }, { date: yersterday }, { status: { $ne: 'Delivered' } }] },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        pipeline: [{ $match: { lapsed: { $ne: true } } }],
        as: 'shops',
      },
    },
    {
      $unwind: '$shops',
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [{ $match: { date: todaydate } }],
        as: 'callhistories',
      },
    },
  ]);
  let userRole = await UserRole.findById(userRoles);
  let User = await Users.findById(userId);
  return { values: values, total: total.length, Role: userRole.roleName, User: User.name, Pending: Pending.length };
};

const getLapsed_Undelivered = async (page, userRoles, userId) => {
  let todaydate = moment().format('YYYY-MM-DD');
  let yersterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
  let values = await ShopOrderClone.aggregate([
    {
      $match: { status: 'UnDelivered' },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shops',
      },
    },
    {
      $unwind: '$shops',
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [{ $match: { date: todaydate } }],
        as: 'callhistories',
      },
    },
    {
      $project: {
        _id: 1,
        shopId: 1,
        status: 1,
        OrderId: 1,
        customerBillId: 1,
        date: 1,
        delivery_type: 1,
        devevery_mode: 1,
        time_of_delivery: 1,
        Payment: 1,
        shops: '$shops.SName',
        calls: { $size: '$callhistories' },
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  let total = await ShopOrderClone.aggregate([
    {
      $match: { status: 'UnDelivered' },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shops',
      },
    },
    {
      $unwind: '$shops',
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [{ $match: { date: todaydate } }],
        as: 'callhistories',
      },
    },
  ]);
  let Pending = await ShopOrderClone.aggregate([
    {
      $match: { $and: [{ status: { $ne: 'UnDelivered' } }, { date: yersterday }, { status: { $ne: 'Delivered' } }] },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        pipeline: [{ $match: { lapsed: { $ne: true } } }],
        as: 'shops',
      },
    },
    {
      $unwind: '$shops',
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [{ $match: { date: todaydate } }],
        as: 'callhistories',
      },
    },
  ]);
  let userRole = await UserRole.findById(userRoles);
  let User = await Users.findById(userId);
  return { values: values, total: total.length, Role: userRole.roleName, User: User.name, Pending: Pending.length };
};

const getCallhistories = async (shopId) => {
  let values = await CallHistory.find({ shopId: shopId }).sort({ date: -1, historytime: -1 }).limit(10);
  return values;
};

const getFindbyId = async (id) => {
  let values = await ShopOrderClone.aggregate([
    {
      $match: {
        _id: id,
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shops',
      },
    },
    {
      $unwind: '$shops',
    },
    // {
    //   $lookup: {
    //     from: 'productorderclones',
    //     localField: '_id',
    //     foreignField: 'orderId',
    //     // pipeline: [
    //     //   {
    //     //     $match:{
    //     //       orderId:id,
    //     //       date:date
    //     //     }
    //     //   }
    //     // ],
    //     as: 'productOrders',
    //   },
    // },
    {
      $project: {
        _id: 1,
        shopId: 1,
        status: 1,
        delivery_type: 1,
        Payment: 1,
        OrderId: 1,
        devevery_mode: 1,
        time_of_delivery: 1,
        OrderId: 1,
        date: 1,
        time: 1,
        product: 1,
        shopsName: '$shops.SName',
        productOrders: '$productOrders',
      },
    },
  ]);
  return values;
};

const lapsed_callBack = async (page, userRoles, userId, method) => {
  let yersterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
  let todaydate = moment().format('YYYY-MM-DD');
  if (method == 'lp') {
    matchvalue = [
      { callstatus: { $eq: 'callback' } },
      { status: { $ne: 'UnDelivered' } },
      { date: yersterday },
      { status: { $ne: 'Delivered' } },
      { status: { $ne: 'Rejected' } },
    ];
  }
  if (method == 're') {
    matchvalue = [{ callstatus: { $eq: 'callback' } }, { status: { $eq: 'Rejected' } }];
  }
  if (method == 'un') {
    matchvalue = [{ callstatus: { $eq: 'callback' } }, { status: { $eq: 'UnDelivered' } }];
  }
  let values = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: matchvalue,
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
              from: 'shoplists',
              localField: 'SType',
              foreignField: '_id',
              as: 'shoplists',
            },
          },
          {
            $unwind: '$shoplists',
          },
          {
            $project: {
              SName: 1,
              _id: 1,
              shopType: '$shoplists.shopList',
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
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [{ $match: { date: todaydate } }],
        as: 'callhistories',
      },
    },
    {
      $project: {
        _id: 1,
        shopId: 1,
        status: 1,
        OrderId: 1,
        customerBillId: 1,
        date: 1,
        delivery_type: 1,
        devevery_mode: 1,
        time_of_delivery: 1,
        Payment: 1,
        shops: '$shops.SName',
        shopType: '$shops.shopType',
        calls: { $size: '$callhistories' },
        callhistories: '$callhistories',
        created: 1,
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  let total = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: matchvalue,
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shops',
      },
    },
    {
      $unwind: '$shops',
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [{ $match: { date: todaydate } }],
        as: 'callhistories',
      },
    },
  ]);
  let userRole = await UserRole.findById(userRoles);
  let User = await Users.findById(userId);
  console.log(userRoles, userId);
  return { values: values, total: total.length, Role: userRole.roleName, User: User.name };
};

const lapsed_accept = async (page, userRoles, userId, method) => {
  let yersterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
  let todaydate = moment().format('YYYY-MM-DD');
  if (method == 'lp') {
    matchvalue = [
      { callstatus: { $eq: 'accept' } },
      { status: { $ne: 'UnDelivered' } },
      { date: yersterday },
      { status: { $ne: 'Delivered' } },
      { status: { $ne: 'Rejected' } },
    ];
  }
  if (method == 're') {
    matchvalue = [{ callstatus: { $eq: 'accept' } }, { status: { $eq: 'Rejected' } }];
  }
  if (method == 'un') {
    matchvalue = [{ callstatus: { $eq: 'accept' } }, { status: { $eq: 'UnDelivered' } }];
  }
  let values = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: matchvalue,
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
              from: 'shoplists',
              localField: 'SType',
              foreignField: '_id',
              as: 'shoplists',
            },
          },
          {
            $unwind: '$shoplists',
          },
          {
            $project: {
              SName: 1,
              _id: 1,
              shopType: '$shoplists.shopList',
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
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [{ $match: { date: todaydate } }],
        as: 'callhistories',
      },
    },
    {
      $project: {
        _id: 1,
        shopId: 1,
        status: 1,
        OrderId: 1,
        customerBillId: 1,
        date: 1,
        delivery_type: 1,
        devevery_mode: 1,
        time_of_delivery: 1,
        Payment: 1,
        shops: '$shops.SName',
        shopType: '$shops.shopType',
        calls: { $size: '$callhistories' },
        callhistories: '$callhistories',
        created: 1,
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  let total = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: matchvalue,
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shops',
      },
    },
    {
      $unwind: '$shops',
    },
    // {
    //   $lookup: {
    //     from: 'shoporderclones',
    //     localField: 'shops._id',
    //     foreignField: 'shopId',
    //     as: 'shoporderclonesData',
    //   },
    // },
    // {
    //   $unwind: '$shoporderclonesData'
    // },
    {
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [{ $match: { date: todaydate } }],
        as: 'callhistories',
      },
    },
  ]);
  let userRole = await UserRole.findById(userRoles);
  let User = await Users.findById(userId);
  console.log(userRoles, userId);
  return { values: values, total: total.length, Role: userRole.roleName, User: User.name };
};

const lapsed_declined = async (page, userRoles, userId, method) => {
  let yersterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
  let todaydate = moment().format('YYYY-MM-DD');
  if (method == 'lp') {
    matchvalue = [
      { callstatus: { $eq: 'declined' } },
      { status: { $ne: 'UnDelivered' } },
      { date: yersterday },
      { status: { $ne: 'Delivered' } },
      { status: { $ne: 'Rejected' } },
    ];
  }
  if (method == 're') {
    matchvalue = [{ callstatus: { $eq: 'declined' } }, { status: { $eq: 'Rejected' } }];
  }
  if (method == 'un') {
    matchvalue = [{ callstatus: { $eq: 'declined' } }, { status: { $eq: 'UnDelivered' } }];
  }
  let values = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: matchvalue,
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
              from: 'shoplists',
              localField: 'SType',
              foreignField: '_id',
              as: 'shoplists',
            },
          },
          {
            $unwind: '$shoplists',
          },
          {
            $project: {
              SName: 1,
              _id: 1,
              shopType: '$shoplists.shopList',
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
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [{ $match: { date: todaydate } }],
        as: 'callhistories',
      },
    },
    {
      $project: {
        _id: 1,
        shopId: 1,
        status: 1,
        OrderId: 1,
        customerBillId: 1,
        date: 1,
        delivery_type: 1,
        devevery_mode: 1,
        time_of_delivery: 1,
        Payment: 1,
        shops: '$shops.SName',
        shopType: '$shops.shopType',
        calls: { $size: '$callhistories' },
        callhistories: '$callhistories',
        created: 1,
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  let total = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: matchvalue,
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shops',
      },
    },
    {
      $unwind: '$shops',
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [{ $match: { date: todaydate } }],
        as: 'callhistories',
      },
    },
  ]);
  let userRole = await UserRole.findById(userRoles);
  let User = await Users.findById(userId);
  console.log(userRoles, userId);
  return { values: values, total: total.length, Role: userRole.roleName, User: User.name };
};

const lapsed_reschedule = async (page, userRoles, userId, method) => {
  let yersterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
  let todaydate = moment().format('YYYY-MM-DD');
  if (method == 'lp') {
    matchvalue = [
      { callstatus: { $eq: 'reschedule' } },
      { status: { $ne: 'UnDelivered' } },
      { date: yersterday },
      { status: { $ne: 'Delivered' } },
      { status: { $ne: 'Rejected' } },
    ];
  }
  if (method == 're') {
    matchvalue = [{ callstatus: { $eq: 'reschedule' } }, { status: { $eq: 'Rejected' } }];
  }
  if (method == 'un') {
    matchvalue = [{ callstatus: { $eq: 'reschedule' } }, { status: { $eq: 'UnDelivered' } }];
  }
  let values = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: matchvalue,
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
              from: 'shoplists',
              localField: 'SType',
              foreignField: '_id',
              as: 'shoplists',
            },
          },
          {
            $unwind: '$shoplists',
          },
          {
            $project: {
              SName: 1,
              _id: 1,
              shopType: '$shoplists.shopList',
            },
          },
        ],
        as: 'shops',
      },
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [{ $match: { date: todaydate } }],
        as: 'callhistories',
      },
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: 'callhistoryId',
        foreignField: '_id',
        pipeline: [{ $match: { callStatus: 'reschedule', date: { $gte: moment().format('YYYY-MM-DD') } } }],
        as: 'callhistoriesdata',
      },
    },
    {
      $unwind: '$callhistoriesdata',
    },
    {
      $project: {
        _id: 1,
        shopId: 1,
        status: 1,
        OrderId: 1,
        customerBillId: 1,
        date: 1,
        delivery_type: 1,
        devevery_mode: 1,
        time_of_delivery: 1,
        Payment: 1,
        shops: '$shops.SName',
        shopType: '$shops.shopType',
        calls: { $size: '$callhistories' },
        callhistories: '$callhistories',
        callhistoriesdata: '$callhistoriesdata',
        created: 1,
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  let total = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: matchvalue,
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shops',
      },
    },
    {
      $unwind: '$shops',
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [{ $match: { date: todaydate } }],
        as: 'callhistories',
      },
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: 'callhistoryId',
        foreignField: '_id',
        pipeline: [{ $match: { callStatus: 'reschedule', date: { $gte: moment().format('YYYY-MM-DD') } } }],
        as: 'callhistoriesdata',
      },
    },
    {
      $unwind: '$callhistoriesdata',
    },
  ]);
  let userRole = await UserRole.findById(userRoles);
  let User = await Users.findById(userId);
  console.log(userRoles, userId);
  return { values: values, total: total.length, Role: userRole.roleName, User: User.name };
};

const lapsedordercount = async (method) => {
  console.log('asd');
  let todaydate = moment().format('YYYY-MM-DD');
  let yersterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
  let callBackmatch;
  let reschedulematch;
  let acceptmatch;
  let declinedmatch;
  let pendingmatch;

  if (method == 'lp') {
    pendingmatch = [
      {
        callstatus: { $ne: 'callback' },
      },
      {
        callstatus: { $ne: 'accept' },
      },
      {
        callstatus: { $ne: 'declined' },
      },
      {
        callstatus: { $ne: 'reschedule' },
      },
      { status: { $ne: 'UnDelivered' } },
      { date: yersterday },
      { status: { $ne: 'Delivered' } },
      { status: { $ne: 'Rejected' } },
    ];
    callBackmatch = [
      { callstatus: { $eq: 'callback' } },
      { status: { $ne: 'UnDelivered' } },
      { date: yersterday },
      { status: { $ne: 'Delivered' } },
      { status: { $ne: 'Rejected' } },
    ];
    acceptmatch = [
      { callstatus: { $eq: 'accept' } },
      { status: { $ne: 'UnDelivered' } },
      { date: yersterday },
      { status: { $ne: 'Delivered' } },
      { status: { $ne: 'Rejected' } },
    ];
    declinedmatch = [
      { callstatus: { $eq: 'declined' } },
      { status: { $ne: 'UnDelivered' } },
      { date: yersterday },
      { status: { $ne: 'Delivered' } },
      { status: { $ne: 'Rejected' } },
    ];
    reschedulematch = [
      { callstatus: { $eq: 'reschedule' } },
      { status: { $ne: 'UnDelivered' } },
      { date: yersterday },
      { status: { $ne: 'Delivered' } },
      { status: { $ne: 'Rejected' } },
    ];
  }
  if (method == 're') {
    pendingmatch = [
      {
        callstatus: { $ne: 'callback' },
      },
      {
        callstatus: { $ne: 'accept' },
      },
      {
        callstatus: { $ne: 'declined' },
      },
      {
        callstatus: { $ne: 'reschedule' },
      },
      { status: { $eq: 'Rejected' } },
    ];
    callBackmatch = [{ callstatus: { $eq: 'callback' } }, { status: { $eq: 'Rejected' } }];
    acceptmatch = [{ callstatus: { $eq: 'accept' } }, { status: { $eq: 'Rejected' } }];
    declinedmatch = [{ callstatus: { $eq: 'declined' } }, { status: { $eq: 'Rejected' } }];
    reschedulematch = [{ callstatus: { $eq: 'reschedule' } }, { status: { $eq: 'Rejected' } }];
  }
  if (method == 'un') {
    pendingmatch = [
      {
        callstatus: { $ne: 'callback' },
      },
      {
        callstatus: { $ne: 'accept' },
      },
      {
        callstatus: { $ne: 'declined' },
      },
      {
        callstatus: { $ne: 'reschedule' },
      },
      { status: { $eq: 'UnDelivered' } },
    ];
    callBackmatch = [{ callstatus: { $eq: 'callback' } }, { status: { $eq: 'UnDelivered' } }];
    acceptmatch = [{ callstatus: { $eq: 'accept' } }, { status: { $eq: 'UnDelivered' } }];
    declinedmatch = [{ callstatus: { $eq: 'declined' } }, { status: { $eq: 'UnDelivered' } }];
    reschedulematch = [{ callstatus: { $eq: 'reschedule' } }, { status: { $eq: 'UnDelivered' } }];
  }
  let callBack = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: callBackmatch,
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shops',
      },
    },
    {
      $unwind: '$shops',
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [{ $match: { date: todaydate } }],
        as: 'callhistories',
      },
    },
  ]);
  let reschedule = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: reschedulematch,
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shops',
      },
    },
    {
      $unwind: '$shops',
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [{ $match: { date: todaydate } }],
        as: 'callhistories',
      },
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: 'callhistoryId',
        foreignField: '_id',
        pipeline: [{ $match: { callStatus: 'reschedule', date: { $gte: moment().format('YYYY-MM-DD') } } }],
        as: 'callhistoriesdata',
      },
    },
    {
      $unwind: '$callhistoriesdata',
    },
  ]);

  let accept = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: acceptmatch,
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shops',
      },
    },
    {
      $unwind: '$shops',
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [{ $match: { date: todaydate } }],
        as: 'callhistories',
      },
    },
  ]);
  let declined = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: declinedmatch,
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shops',
      },
    },
    {
      $unwind: '$shops',
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [{ $match: { date: todaydate } }],
        as: 'callhistories',
      },
    },
  ]);
  let pending = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: pendingmatch,
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shops',
      },
    },
    {
      $unwind: '$shops',
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [{ $match: { date: todaydate } }],
        as: 'callhistories',
      },
    },
  ]);
  return {
    callBack: callBack.length,
    reschedule: reschedule.length,
    accept: accept.length,
    declined: declined.length,
    pending: pending.length,
  };
};

const getBills_ByShop = async (shopId) => {
  let values = await OrderPayment.aggregate([
    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'orderId',
        foreignField: '_id',
        pipeline: [{ $match: { shopId: shopId } }],
        as: 'orders',
      },
    },
    {
      $unwind: '$orders',
    },
    {
      $project: {
        _id: 1,
        payment: 1,
        paidAmt: 1,
        date: 1,
      },
    },
  ]);
  return values;
};

module.exports = {
  // product
  createProductOrderClone,
  getAllProductOrderClone,
  getProductOrderCloneById,
  updateProductOrderCloneById,
  deleteProductOrderClone,

  // shopOrderClone

  createshopOrderClone,
  getAllShopOrderClone,
  updateShopOrderCloneById,
  getShopOrderCloneById,
  deleteShopOrderCloneById,
  getShopNameCloneWithPagination,
  createshopOrder,
  getAllShopOrder,
  getShopOrderById,
  getProductDetailsByProductId,
  updateShopOrderById,
  getShopNameWithPagination,
  deleteShopOrderById,

  // Telecaller
  updateshop_order,
  getAll,
  createOrderId,
  getShopDetailsByOrder,
  undelivered,
  B2BManageOrders,
  getManageordersByOrderId,
  // for lapsed
  getproductOrders_By_OrderId,
  productData,
  get_data_for_lapster,
  getLapsed_Data,
  getLapsed_Rejected,
  getLapsed_Undelivered,
  getCallhistories,
  getFindbyId,
  lapsed_callBack,
  lapsed_accept,
  lapsed_declined,
  lapsed_reschedule,
  lapsedordercount,
  getBills_ByShop,
};
