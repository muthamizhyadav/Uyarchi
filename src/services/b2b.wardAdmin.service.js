const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { ShopOrderClone } = require('../models/shopOrder.model');
const { ProductorderClone } = require('../models/shopOrder.model');
const { Shop } = require('../models/b2b.ShopClone.model');
const { Users } = require('../models/B2Busers.model');
const Roles = require('../models/roles.model');
const { wardAdminGroup, wardAdminGroupModel_ORDERS } = require('../models/b2b.wardAdminGroup.model');
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
  if (!statusUpdate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  statusUpdate = await ShopOrderClone.findByIdAndUpdate(
    { _id: id },
    { status: 'Packed', statusUpdate: moment(), completeStatus: 'Packed' },
    { new: true }
  );
  let orderassign = await wardAdminGroupModel_ORDERS.findOne({ orderId: id });
  await wardAdminGroupModel_ORDERS.findByIdAndUpdate({ _id: orderassign._id }, { status: 'Packed' }, { new: true });
  let wardgroup = await wardAdminGroupModel_ORDERS.find({
    wardAdminGroupID: orderassign.wardAdminGroupID,
    status: 'Assigned',
  });
  if (wardgroup.length == 0) {
    await wardAdminGroup.findByIdAndUpdate({ _id: orderassign.wardAdminGroupID }, { status: 'Packed' }, { new: true });
  }
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
              unit: 1,
              packKg: 1,
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
        TotalGstAmount: { $sum: '$productData.GSTamount' },
        totalSum: { $add: ['$productDatadetails.amount', { $sum: '$productData.GSTamount' }] },
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
      let updateQty = 0;
      if (e.quantity != null && e.quantity != '') {
        updateQty = e.quantity;
      }
      await ProductorderClone.findByIdAndUpdate(
        { _id: e._id },
        { finalQuantity: updateQty, status: 'Modified' },
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

const wardloadExecutivebtgroup = async (page) => {
  let data = await wardAdminGroup.aggregate([
    {
      $match: {
        $and: [{ status: { $eq: 'Assigned' } }],
      },
    },
    {
      $lookup: {
        from: 'orderassigns',
        localField: '_id', //Uid
        foreignField: 'wardAdminGroupID', //Uid
        as: 'orderassigns',
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'deliveryExecutiveId', //Uid
        foreignField: '_id', //Uid
        as: 'deliveryExecutive',
      },
    },
    {
      $unwind: '$deliveryExecutive',
    },
    {
      $project: {
        _id: 1,
        // Orderdatas: 1,
        status: 1,
        manageDeliveryStatus: 1,
        pettyCashAllocateStatus: 1,
        pettyStockAllocateStatus: 1,
        AllocateStatus: 1,
        pettyStock: 1,
        deliveryExecutiveId: 1,
        totalOrders: { $size: '$orderassigns' },
        route: 1,
        groupId: 1,
        assignDate: 1,
        assignTime: 1,
        pettyStockAllocateStatusNumber: 1,
        deliveryExecutive: '$deliveryExecutive.name',
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await wardAdminGroup.aggregate([
    {
      $match: {
        $and: [{ status: { $eq: 'Assigned' } }],
      },
    },
    {
      $project: {
        _id: 1,
        // Orderdatas: 1,
        status: 1,
        manageDeliveryStatus: 1,
        pettyCashAllocateStatus: 1,
        pettyStockAllocateStatus: 1,
        AllocateStatus: 1,
        pettyStock: 1,
        deliveryExecutiveId: 1,
        totalOrders: 1,
        route: 1,
        groupId: 1,
        assignDate: 1,
        assignTime: 1,
        pettyStockAllocateStatusNumber: 1,
      },
    },
  ]);
  return { data: data, total: total.length };
};
const wardloadExecutive = async (id) => {
  let data = await wardAdminGroupModel_ORDERS.aggregate([
    {
      $match: {
        $and: [{ wardAdminGroupID: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'orderId', //Uid
        foreignField: '_id', //Uid
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
                    as: 'products',
                  },
                },
                {
                  $unwind: '$products',
                },
                {
                  $project: {
                    _id: '297cf887-304f-457a-b416-df84a1ceede4',
                    status: 1,
                    orderId: 1,
                    productid: 1,
                    quantity: 1,
                    priceperkg: 1,
                    GST_Number: 1,
                    HSN_Code: 1,
                    packKg: 1,
                    unit: 1,
                    date: 1,
                    time: 1,
                    customerId: 1,
                    finalQuantity: 1,
                    finalPricePerKg: 1,
                    created: 1,
                    productTitle: '$products.productTitle',
                  },
                },
              ],
              as: 'product',
            },
          },
          {
            $lookup: {
              from: 'b2bshopclones',
              localField: 'shopId',
              foreignField: '_id',
              as: 'shopdetails',
            },
          },
          {
            $unwind: '$shopdetails',
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
              OrderId: 1,
              date: 1,
              time: 1,
              created: 1,
              statusUpdate: 1,
              WA_assigned_Time: 1,
              shopname: '$shopdetails.SName',
              deliveryExecutiveId: 1,
              product: '$product',
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
        _id: 1,
        // shoporderclones: '$shoporderclones',
        status: '$shoporderclones.status',
        productStatus: '$shoporderclones.productStatus',
        customerDeliveryStatus: '$shoporderclones.customerDeliveryStatus',
        receiveStatus: '$shoporderclones.receiveStatus',
        pettyCashReceiveStatus: '$shoporderclones.pettyCashReceiveStatus',
        AssignedStatus: '$shoporderclones.AssignedStatus',
        completeStatus: '$shoporderclones.completeStatus',
        UnDeliveredStatus: '$shoporderclones.UnDeliveredStatus',
        delivery_type: '$shoporderclones.delivery_type',
        Payment: '$shoporderclones.Payment',
        devevery_mode: '$shoporderclones.devevery_mode',
        time_of_delivery: '$shoporderclones.time_of_delivery',
        total: '$shoporderclones.total',
        gsttotal: '$shoporderclones.gsttotal',
        subtotal: '$shoporderclones.subtotal',
        SGST: '$shoporderclones.SGST',
        CGST: '$shoporderclones.CGST',
        paidamount: '$shoporderclones.paidamount',
        OrderId: '$shoporderclones.OrderId',
        date: '$shoporderclones.date',
        time: '$shoporderclones.time',
        created: '$shoporderclones.created',
        statusUpdate: '$shoporderclones.statusUpdate',
        WA_assigned_Time: '$shoporderclones.WA_assigned_Time',
        deliveryExecutiveId: '$shoporderclones.deliveryExecutiveId',
        shopname: '$shoporderclones.shopname',
        product: '$shoporderclones.product',
        orderId: '$shoporderclones._id',
      },
    },
  ]);
  let packed_count = await wardAdminGroupModel_ORDERS.aggregate([
    {
      $match: {
        $and: [{ wardAdminGroupID: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'orderId', //Uid
        foreignField: '_id',
        pipeline: [{ $match: { status: 'Packed' } }],
        as: 'packedcount',
      },
    },
    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'orderId', //Uid
        foreignField: '_id',
        pipeline: [{ $match: { status: 'Assigned' } }],
        as: 'unpackedcount',
      },
    },

    {
      $project: {
        _id: 1,
        packedcount: { $size: '$packedcount' },
        unpackedcount: { $size: '$unpackedcount' },
      },
    },
    {
      $group: {
        _id: null,
        packedCount: { $sum: '$packedcount' },
        unpackedcount: { $sum: '$unpackedcount' },
      },
    },
  ]);
  let orderdate = await wardAdminGroup.aggregate([
    {
      $match: {
        _id: id,
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'deliveryExecutiveId', //Uid
        foreignField: '_id',
        as: 'deliveryExecutive',
      },
    },
    {
      $unwind: '$deliveryExecutive',
    },
    {
      $project: {
        _id: 1,
        manageDeliveryStatus: 1,
        pettyCashAllocateStatus: 1,
        pettyStockAllocateStatus: 1,
        AllocateStatus: 1,
        pettyStock: 1,
        deliveryExecutiveId: 1,
        totalOrders: 1,
        route: 1,
        assignDate: 1,
        groupId: 1,
        assignDate: 1,
        assignTime: 1,
        GroupBillId: 1,
        pettyStockAllocateStatusNumber: 1,
        GroupBillDate: 1,
        GroupBillTime: 1,
        pettyCash: 1,
        deliveryExecutive: '$deliveryExecutive.name',
      },
    },
  ]);

  return { data: data, orderDetails: orderdate, packed_count: packed_count[0] };
};
// TRACK STATUS FOR PRODUCT STATUS
const updateBilled = async (id, status) => {
  let productOrderBilled = await ShopOrderClone.findById(id);
  if (!productOrderBilled) {
    throw new ApiError(httpStatus.NOT_FOUND, 'productOrderBilled not found');
  }
  productOrderBilled = await ShopOrderClone.findByIdAndUpdate({ _id: id }, { status: status }, { new: true });
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
  Orderdatass.forEach(async (e) => {
    await ShopOrderClone.findByIdAndUpdate({ _id: e._id }, { deliveryExecutiveId: deliveryExecutiveId, status: 'Assigned' });
  });
  // const data = await ShopOrderClone.create(Orderdatas)
  return 'success';
};

// AFTER PACKED BY WARD LOADING EXECUTE

const wardloadExecutivePacked = async (range, page) => {
  let today = moment().format('yyyy-MM-DD');
  let yesterday = moment().subtract(1, 'days').format('yyyy-MM-DD');
  let dateMatch = {
    $or: [
      { date: { $eq: yesterday }, delivery_type: { $eq: 'NDD' } },
      { date: { $eq: today }, delivery_type: { $eq: 'IMD' } },
    ],
  };
  rangematch = { time_of_delivery: { $eq: range } };
  if (range == 'all') {
    rangematch = { active: true };
  }

  let data = await ShopOrderClone.aggregate([
    { $sort: { time_of_delivery: 1, delivery_type: -1, created: 1 } },
    {
      $match: {
        $and: [
          {
            status: {
              $in: ['Approved', 'Modified'],
            },
          },
          rangematch,
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
          rangematch,
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
  let result = await gettimeslatcountassign(range);
  return { data: data, total: total.length, total_count: result };
};

const wardDeliveryExecutive = async () => {
  let today = moment().format('YYYY-MM-DD');

  // assignDate;

  let value = await Users.aggregate([
    {
      $match: { userRole: { $in: ['36151bdd-a8ce-4f80-987e-1f454cd0993f'] } },
    },
    {
      $lookup: {
        from: 'wardadmingroups',
        localField: '_id',
        foreignField: 'deliveryExecutiveId',
        pipeline: [
          {
            $match: {
              manageDeliveryStatus: { $ne: 'Delivery Completed' },
              date: { $eq: today },
            },
          },
        ],
        as: 'deliveryExecutiveName',
      },
    },
    {
      $project: {
        isEmailVerified: 1,
        active: 1,
        name: 1,
        email: 1,
        phoneNumber: 1,
        userRole: 1,
        dateOfJoining: 1,
        salary: 1,
        password: 1,
        createdAt: 1,
        updatedAt: 1,
        totalItems: { $size: '$deliveryExecutiveName' },
      },
    },
    {
      $match: { totalItems: { $eq: 0 } },
    },
  ]);

  return value;
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
      $lookup: {
        from: 'orderassigns',
        localField: '_id',
        foreignField: 'wardAdminGroupID',
        as: 'orderassignscount',
      },
    },
    {
      $lookup: {
        from: 'wardadmingroups',
        localField: 'deliveryExecutiveId',
        foreignField: 'deliveryExecutiveId',
        pipeline: [
          {
            $match: {
              assignDate: currentDate,
              manageDeliveryStatus: 'Delivery Completed',
            },
          },
        ],
        as: 'wardadmingroups',
      },
    },
    {
      $lookup: {
        from: 'wardadmingroups',
        localField: 'deliveryExecutiveId',
        foreignField: 'deliveryExecutiveId',
        pipeline: [
          {
            $match: {
              manageDeliveryStatus: 'Delivery Completed',
            },
          },
        ],
        as: 'totalwardadmingroups',
      },
    },
    {
      $project: {
        _id: 1,
        status: 1,
        deliveryExecutiveId: 1,
        totalOrders: { $size: '$orderassignscount' },
        groupId: 1,
        assignDate: 1,
        assignTime: 1,
        deliveryexecuteName: '$deliveryexecute.name',
        orderassigns: '$orderassigns',
        route: 1,
        deliveryCompletedCount: { $size: '$wardadmingroups' },
        totaldeliveryCompletedCount: { $size: '$totalwardadmingroups' },
      },
    },
  ]);
  return values;
};

const getdetailsDataStatusOdered = async (type, time, status, limit, page) => {
  let today = moment().format('yyyy-MM-DD');
  let yesterday = moment().subtract(1, 'days').format('yyyy-MM-DD');
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
  let statusMatch;
  if (status != 'null') {
    statusMatch = {
      status: { $eq: status },
    };
  }
  let timeMatch = { active: true };
  if (time != 'all') {
    timeMatch = { time_of_delivery: { $eq: time } };
  }
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
  let values = await ShopOrderClone.aggregate([
    { $sort: { timeslot: 1, delivery_type: -1, created: 1 } },
    {
      $match: {
        $and: [statusMatch, timeMatch, typeMatch, dateMatch, { timeslot: { $gte: lapsed } }],
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
            $match: { $and: [{ finalQuantity: { $gt: 0 } }] },
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
        time: 1,
        time_of_delivery: 1,
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
        $and: [statusMatch, timeMatch, typeMatch, dateMatch, { timeslot: { $gte: lapsed } }],
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
            $match: { $and: [{ finalQuantity: { $gt: 0 } }] },
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
  ]);
  let AcknowledgedStatusCount = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [{ status: { $eq: 'Acknowledged' } }, timeMatch, typeMatch, dateMatch, { timeslot: { $gte: lapsed } }],
      },
    },
  ]);
  let orderedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'ordered' } }, timeMatch, typeMatch, dateMatch, { timeslot: { $gte: lapsed } }] } },
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
          timeMatch,
          typeMatch,
          dateMatch,
        ],
      },
    },
  ]);
  let ModifiedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'Modified' } }, timeMatch, typeMatch, dateMatch] } },
  ]);
  let rejectedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'Rejected' } }, timeMatch, typeMatch, dateMatch] } },
  ]);
  let lapsetStatusCount = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          { status: { $in: ['Acknowledged', 'ordered', 'Rejected'] } },
          timeMatch,
          typeMatch,
          dateMatch,
          { timeslot: { $lte: lapsed } },
        ],
      },
    },
  ]);
  let count = {
    AcknowledgedStatusCount: AcknowledgedStatusCount.length,
    orderedStatusCount: orderedStatusCount.length,
    ApprovedStatusCount: ApprovedStatusCount.length,
    ModifiedStatusCount: ModifiedStatusCount.length,
    rejectedStatusCount: rejectedStatusCount.length,
    lapsetStatusCount: lapsetStatusCount.length,
  };
  let result = await gettimeslatcount(type);
  return { values: values, total: total.length, count: count, total_count: result };
};
// req.params.type, req.params.time, req.params.status, req.params.limit, req.params.page;
const getdetailsDataStatusAcknowledged = async (type, time, status, limit, page) => {
  let today = moment().format('yyyy-MM-DD');
  let yesterday = moment().subtract(1, 'days').format('yyyy-MM-DD');
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

  let timeMatch = { active: true };
  if (time != 'all') {
    timeMatch = { time_of_delivery: { $eq: time } };
  }
  let statusMatch;
  if (status != 'null') {
    statusMatch = {
      status: { $eq: status },
    };
  }
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
  let values = await ShopOrderClone.aggregate([
    { $sort: { timeslot: 1, delivery_type: -1, created: 1 } },
    {
      $match: {
        $and: [statusMatch, timeMatch, typeMatch, dateMatch, { timeslot: { $gte: lapsed } }],
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
            $match: { $and: [{ finalQuantity: { $gt: 0 } }] },
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
        time: 1,
        time_of_delivery: 1,
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
        $and: [statusMatch, timeMatch, typeMatch, dateMatch, { timeslot: { $gte: lapsed } }],
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
    {
      $match: {
        $and: [{ status: { $eq: 'Acknowledged' } }, timeMatch, typeMatch, dateMatch, { timeslot: { $gte: lapsed } }],
      },
    },
  ]);
  let orderedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'ordered' } }, timeMatch, typeMatch, dateMatch, { timeslot: { $gte: lapsed } }] } },
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
          timeMatch,
          typeMatch,
          dateMatch,
        ],
      },
    },
  ]);
  let ModifiedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'Modified' } }, timeMatch, typeMatch, dateMatch] } },
  ]);
  let rejectedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'Rejected' } }, timeMatch, typeMatch, dateMatch] } },
  ]);
  let lapsetStatusCount = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          { status: { $in: ['Acknowledged', 'ordered', 'Rejected'] } },
          timeMatch,
          typeMatch,
          dateMatch,
          { timeslot: { $lte: lapsed } },
        ],
      },
    },
  ]);
  let count = {
    AcknowledgedStatusCount: AcknowledgedStatusCount.length,
    orderedStatusCount: orderedStatusCount.length,
    ApprovedStatusCount: ApprovedStatusCount.length,
    ModifiedStatusCount: ModifiedStatusCount.length,
    rejectedStatusCount: rejectedStatusCount.length,
    lapsetStatusCount: lapsetStatusCount.length,
  };
  let result = await gettimeslatcount(type);
  return { values: values, total: total.length, count: count, total_count: result };
};

const gettimeslatcount = async (type) => {
  let typeMatch = { delivery_type: { $eq: type } };
  let today = moment().format('yyyy-MM-DD');
  let yesterday = moment().subtract(1, 'days').format('yyyy-MM-DD');
  let dateMatch = { date: { $eq: today } };
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
  let countall = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: [
                'Approved',
                'Acknowledged',
                'ordered',
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
          dateMatch,
          typeMatch,
        ],
      },
    },
  ]);
  let count5_6 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: [
                'Acknowledged',
                'ordered',
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
          { time_of_delivery: { $eq: '5-6' } },
          dateMatch,
          typeMatch,
        ],
      },
    },
  ]);
  let count6_7 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: [
                'Acknowledged',
                'ordered',
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
          { time_of_delivery: { $eq: '6-7' } },
          dateMatch,
          typeMatch,
        ],
      },
    },
  ]);
  let count7_8 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: [
                'Acknowledged',
                'ordered',
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
          { time_of_delivery: { $eq: '7-8' } },
          dateMatch,
          typeMatch,
        ],
      },
    },
  ]);
  let count8_9 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: [
                'Acknowledged',
                'ordered',
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
          { time_of_delivery: { $eq: '8-9' } },
          dateMatch,
          typeMatch,
        ],
      },
    },
  ]);
  let count9_10 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: [
                'Acknowledged',
                'ordered',
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
          { time_of_delivery: { $eq: '9-10' } },
          dateMatch,
          typeMatch,
        ],
      },
    },
  ]);
  let count10_11 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: [
                'Acknowledged',
                'ordered',
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
          { time_of_delivery: { $eq: '10-11' } },
          dateMatch,
          typeMatch,
        ],
      },
    },
  ]);
  let count11_12 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: [
                'Acknowledged',
                'ordered',
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
          { time_of_delivery: { $eq: '11-12' } },
          dateMatch,
          typeMatch,
        ],
      },
    },
  ]);
  let count12_13 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: [
                'Acknowledged',
                'ordered',
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
          { time_of_delivery: { $eq: '12-13' } },
          dateMatch,
          typeMatch,
        ],
      },
    },
  ]);
  let count13_14 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: [
                'Acknowledged',
                'ordered',
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
          { time_of_delivery: { $eq: '13-14' } },
          dateMatch,
          typeMatch,
        ],
      },
    },
  ]);
  let count14_15 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: [
                'Acknowledged',
                'ordered',
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
          { time_of_delivery: { $eq: '14-15' } },
          dateMatch,
          typeMatch,
        ],
      },
    },
  ]);
  let count15_16 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: [
                'Acknowledged',
                'ordered',
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
          { time_of_delivery: { $eq: '15-16' } },
          dateMatch,
          typeMatch,
        ],
      },
    },
  ]);
  let count16_17 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: [
                'Acknowledged',
                'ordered',
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
          { time_of_delivery: { $eq: '16-17' } },
          dateMatch,
          typeMatch,
        ],
      },
    },
  ]);
  let count17_18 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: [
                'Acknowledged',
                'ordered',
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
          { time_of_delivery: { $eq: '17-18' } },
          dateMatch,
          typeMatch,
        ],
      },
    },
  ]);
  let count18_19 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: [
                'Acknowledged',
                'ordered',
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
          { time_of_delivery: { $eq: '18-19' } },
          dateMatch,
          typeMatch,
        ],
      },
    },
  ]);
  let count19_20 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: [
                'Acknowledged',
                'ordered',
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
          { time_of_delivery: { $eq: '19-20' } },
          dateMatch,
          typeMatch,
        ],
      },
    },
  ]);
  let count20_21 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: [
                'Acknowledged',
                'ordered',
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
          { time_of_delivery: { $eq: '20-21' } },
          dateMatch,
          typeMatch,
        ],
      },
    },
  ]);
  let count21_22 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: [
                'Acknowledged',
                'ordered',
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
          { time_of_delivery: { $eq: '21-22' } },
          dateMatch,
          typeMatch,
        ],
      },
    },
  ]);
  let count22_23 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: [
                'Acknowledged',
                'ordered',
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
          { time_of_delivery: { $eq: '22-23' } },
          dateMatch,
          typeMatch,
        ],
      },
    },
  ]);
  let count23_24 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: [
                'Acknowledged',
                'ordered',
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
          { time_of_delivery: { $eq: '23-24' } },
          dateMatch,
          typeMatch,
        ],
      },
    },
  ]);
  return {
    all: countall.length,
    '5_6': count5_6.length,
    '6_7': count6_7.length,
    '7_8': count7_8.length,
    '8_9': count8_9.length,
    '9_10': count9_10.length,
    '10_11': count10_11.length,
    '11_12': count11_12.length,
    '12_13': count12_13.length,
    '13_14': count13_14.length,
    '14_15': count14_15.length,
    '15_16': count15_16.length,
    '16_17': count16_17.length,
    '17_18': count17_18.length,
    '18_19': count18_19.length,
    '19_20': count19_20.length,
    '20_21': count20_21.length,
    '21_22': count21_22.length,
    '22_23': count22_23.length,
    '23_24': count23_24.length,
  };
};

const gettimeslatcountassign = async (type) => {
  let today = moment().format('yyyy-MM-DD');
  let yesterday = moment().subtract(1, 'days').format('yyyy-MM-DD');
  dateMatch = {
    $or: [
      { date: { $eq: yesterday }, delivery_type: { $eq: 'NDD' } },
      { date: { $eq: today }, delivery_type: { $eq: 'IMD' } },
    ],
  };
  let countall = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: ['Approved', 'Modified'],
            },
          },
          dateMatch,
        ],
      },
    },
  ]);
  let count5_6 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: ['Approved', 'Modified'],
            },
          },
          { time_of_delivery: { $eq: '5-6' } },
          dateMatch,
        ],
      },
    },
  ]);
  let count6_7 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: ['Approved', 'Modified'],
            },
          },
          { time_of_delivery: { $eq: '6-7' } },
          dateMatch,
        ],
      },
    },
  ]);
  let count7_8 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: ['Approved', 'Modified'],
            },
          },
          { time_of_delivery: { $eq: '7-8' } },
          dateMatch,
        ],
      },
    },
  ]);
  let count8_9 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: ['Approved', 'Modified'],
            },
          },
          { time_of_delivery: { $eq: '8-9' } },
          dateMatch,
        ],
      },
    },
  ]);
  let count9_10 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: ['Approved', 'Modified'],
            },
          },
          { time_of_delivery: { $eq: '9-10' } },
          dateMatch,
        ],
      },
    },
  ]);
  let count10_11 = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          {
            status: {
              $in: ['Approved', 'Modified'],
            },
          },
          { time_of_delivery: { $eq: '10-11' } },
          dateMatch,
        ],
      },
    },
  ]);
  return {
    all: countall.length,
    '5_6': count5_6.length,
    '6_7': count6_7.length,
    '7_8': count7_8.length,
    '8_9': count8_9.length,
    '9_10': count9_10.length,
    '10_11': count10_11.length,
  };
};
const getdetailsDataStatusRejected = async (type, time, status, limit, page) => {
  let today = moment().format('yyyy-MM-DD');
  let yesterday = moment().subtract(1, 'days').format('yyyy-MM-DD');
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
  let statusMatch;
  if (status != 'null') {
    statusMatch = {
      status: { $eq: status },
    };
  }
  let timeMatch = { active: true };
  if (time != 'all') {
    timeMatch = { time_of_delivery: { $eq: time } };
  }
  let values = await ShopOrderClone.aggregate([
    { $sort: { timeslot: 1, delivery_type: -1, created: 1 } },
    {
      $match: {
        $and: [statusMatch, timeMatch, typeMatch, dateMatch],
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
            $match: { $and: [{ finalQuantity: { $gt: 0 } }] },
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
        time: 1,
        time_of_delivery: 1,
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
        $and: [statusMatch, timeMatch, typeMatch, dateMatch],
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
  let AcknowledgedStatusCount = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [{ status: { $eq: 'Acknowledged' } }, timeMatch, typeMatch, dateMatch, { timeslot: { $gte: lapsed } }],
      },
    },
  ]);
  let orderedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'ordered' } }, timeMatch, typeMatch, dateMatch, { timeslot: { $gte: lapsed } }] } },
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
          timeMatch,
          typeMatch,
          dateMatch,
        ],
      },
    },
  ]);
  let ModifiedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'Modified' } }, timeMatch, typeMatch, dateMatch] } },
  ]);
  let rejectedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'Rejected' } }, timeMatch, typeMatch, dateMatch] } },
  ]);
  let lapsetStatusCount = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          { status: { $in: ['Acknowledged', 'ordered', 'Rejected'] } },
          timeMatch,
          typeMatch,
          dateMatch,
          { timeslot: { $lte: lapsed } },
        ],
      },
    },
  ]);
  let count = {
    AcknowledgedStatusCount: AcknowledgedStatusCount.length,
    orderedStatusCount: orderedStatusCount.length,
    ApprovedStatusCount: ApprovedStatusCount.length,
    ModifiedStatusCount: ModifiedStatusCount.length,
    rejectedStatusCount: rejectedStatusCount.length,
    lapsetStatusCount: lapsetStatusCount.length,
  };
  let result = await gettimeslatcount(type);
  return { values: values, total: total.length, count: count, total_count: result };
};
const getAppOrModifiedStatus = async (type, time, status, limit, page) => {
  let today = moment().format('yyyy-MM-DD');
  let yesterday = moment().subtract(1, 'days').format('yyyy-MM-DD');
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

  let timeMatch = { active: true };
  if (time != 'all') {
    timeMatch = { time_of_delivery: { $eq: time } };
  }
  let statusMatch;
  if (status != 'null') {
    statusMatch = {
      // status: { $eq: status }
      status: {
        $in: ['Approved', 'Modified', 'Packed', 'Assigned', 'Order Picked', 'Delivery start', 'Delivered', 'UnDelivered'],
      },
    };
  }

  let values = await ShopOrderClone.aggregate([
    { $sort: { timeslot: 1, delivery_type: -1, created: 1 } },
    {
      $match: {
        $and: [statusMatch, timeMatch, typeMatch, dateMatch],
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
            $match: { $and: [{ finalQuantity: { $gt: 0 } }] },
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
        time: 1,
        time_of_delivery: 1,
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
        $and: [statusMatch, timeMatch, typeMatch, dateMatch],
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
  let AcknowledgedStatusCount = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [{ status: { $eq: 'Acknowledged' } }, timeMatch, typeMatch, dateMatch, { timeslot: { $gte: lapsed } }],
      },
    },
  ]);
  let orderedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'ordered' } }, timeMatch, typeMatch, dateMatch, { timeslot: { $gte: lapsed } }] } },
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
          timeMatch,
          typeMatch,
          dateMatch,
        ],
      },
    },
  ]);
  let ModifiedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'Modified' } }, timeMatch, typeMatch, dateMatch] } },
  ]);
  let rejectedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'Rejected' } }, timeMatch, typeMatch, dateMatch] } },
  ]);
  let lapsetStatusCount = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          { status: { $in: ['Acknowledged', 'ordered', 'Rejected'] } },
          timeMatch,
          typeMatch,
          dateMatch,
          { timeslot: { $lte: lapsed } },
        ],
      },
    },
  ]);
  let count = {
    AcknowledgedStatusCount: AcknowledgedStatusCount.length,
    orderedStatusCount: orderedStatusCount.length,
    ApprovedStatusCount: ApprovedStatusCount.length,
    ModifiedStatusCount: ModifiedStatusCount.length,
    rejectedStatusCount: rejectedStatusCount.length,
    lapsetStatusCount: lapsetStatusCount.length,
  };
  let result = await gettimeslatcount(type);
  return { values: values, total: total.length, count: count, total_count: result };
};

const getdetailsDataStatuslasped = async (type, time, status, limit, page) => {
  let today = moment().format('yyyy-MM-DD');
  let yesterday = moment().subtract(1, 'days').format('yyyy-MM-DD');
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
  let statusMatch;
  if (status != 'null') {
    statusMatch = {
      status: { $eq: status },
    };
  }
  if (status == 'lapsed') {
    statusMatch = {
      status: { $in: ['ordered', 'Acknowledged', 'Rejected'] },
    };
  }

  let timeMatch = { active: true };
  if (time != 'all') {
    timeMatch = { time_of_delivery: { $eq: time } };
  }
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

  let values = await ShopOrderClone.aggregate([
    { $sort: { timeslot: 1, delivery_type: -1, created: 1 } },
    {
      $match: {
        $and: [statusMatch, timeMatch, typeMatch, dateMatch, { timeslot: { $lte: lapsed } }],
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
        time: 1,
        time_of_delivery: 1,
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
        $and: [statusMatch, timeMatch, typeMatch, dateMatch, { timeslot: { $lte: lapsed } }],
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
            $match: { $and: [{ finalQuantity: { $gt: 0 } }] },
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
  ]);
  let AcknowledgedStatusCount = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [{ status: { $eq: 'Acknowledged' } }, timeMatch, typeMatch, dateMatch, { timeslot: { $gte: lapsed } }],
      },
    },
  ]);
  let orderedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'ordered' } }, timeMatch, typeMatch, dateMatch, { timeslot: { $gte: lapsed } }] } },
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
          timeMatch,
          typeMatch,
          dateMatch,
        ],
      },
    },
  ]);
  let ModifiedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'Modified' } }, timeMatch, typeMatch, dateMatch] } },
  ]);
  let rejectedStatusCount = await ShopOrderClone.aggregate([
    { $match: { $and: [{ status: { $eq: 'Rejected' } }, timeMatch, typeMatch, dateMatch] } },
  ]);
  let lapsetStatusCount = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          { status: { $in: ['Acknowledged', 'ordered', 'Rejected'] } },
          timeMatch,
          typeMatch,
          dateMatch,
          { timeslot: { $lte: lapsed } },
        ],
      },
    },
  ]);
  let count = {
    AcknowledgedStatusCount: AcknowledgedStatusCount.length,
    orderedStatusCount: orderedStatusCount.length,
    ApprovedStatusCount: ApprovedStatusCount.length,
    ModifiedStatusCount: ModifiedStatusCount.length,
    rejectedStatusCount: rejectedStatusCount.length,
    lapsetStatusCount: lapsetStatusCount.length,
  };
  let result = await gettimeslatcount(type);
  return { values: values, total: total.length, count: count, total_count: result };
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

const mismatchCount = async (page) => {
  let data = await Users.aggregate([
    {
      $match: {
        $and: [{ userRole: { $eq: '36151bdd-a8ce-4f80-987e-1f454cd0993f' } }],
      },
    },
    {
      $lookup: {
        from: 'wardadmingroups',
        localField: '_id',
        foreignField: 'deliveryExecutiveId',
        pipeline: [
          {
            $match: {
              $and: [{ ByCashIncPettyCash: { $ne: null } }],
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: '$ByCashIncPettyCash',
              },
            },
          },
        ],
        as: 'wardadmingroupsData',
      },
    },
    {
      $unwind: '$wardadmingroupsData',
    },
    {
      $skip: 10 * parseInt(page),
    },
    {
      $limit: 10,
    },
    {
      $project: {
        name: 1,
        totalAmount: '$wardadmingroupsData.total',
      },
    },
  ]);
  return data;
};

const mismatchGroup = async (id) => {
  let data = await Users.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'wardadmingroups',
        localField: '_id',
        foreignField: 'deliveryExecutiveId',
        pipeline: [
          {
            $match: {
              $and: [{ ByCashIncPettyCash: { $ne: null } }],
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
                    from: 'orderpayments',
                    localField: 'orderId',
                    foreignField: 'orderId',
                    pipeline: [
                      {
                        $match: {
                          $and: [{ type: { $ne: 'advanced' } }],
                        },
                      },
                      {
                        $group: {
                          _id: null,
                          total: {
                            $sum: '$paidAmt',
                          },
                        },
                      },
                    ],
                    as: 'orderpaymentsData',
                  },
                },
                {
                  $unwind: '$orderpaymentsData',
                },
                {
                  $group: {
                    _id: null,
                    total: { $sum: '$orderpaymentsData.total' },
                  },
                },
              ],
              as: 'orderassignsData',
            },
          },
          {
            $unwind: '$orderassignsData',
          },
        ],
        as: 'wardadmingroupsData',
      },
    },
    {
      $unwind: '$wardadmingroupsData',
    },

    // {
    //   $unwind: '$orderpaymentsData',
    // },
    // {
    //   $skip: 10 * parseInt(page),
    // },
    // {
    //   $limit: 10,
    // },
    {
      $project: {
        name: 1,
        wardadmingroupsData: '$wardadmingroupsData.orderassignsData.total',
        groupId: '$wardadmingroupsData.groupId',
        pettyCash: '$wardadmingroupsData.pettyCash',
        group: '$wardadmingroupsData._id',

        // // mismatch:"$wardadmingroupsData.total",
        mismatch: '$wardadmingroupsData.ByCashIncPettyCash',
        assignDate: '$wardadmingroupsData.assignDate',
      },
    },
  ]);
  return data;
};

const Mismatch_Stock_Reconcilation = async () =>{
       const data = await Users.aggregate([
        {
          $match: {
            $and: [{ userRole: { $eq: '36151bdd-a8ce-4f80-987e-1f454cd0993f' } }],
          },
        },
        {
          $lookup: {
            from: 'wardadmingroups',
            localField: '_id',
            foreignField: 'deliveryExecutiveId',
            pipeline: [
              {
                $lookup: {
                  from: 'orderassigns',
                  localField: '_id',
                  foreignField: 'wardAdminGroupID',
                  as: 'orderassignsData',
                },
              },
              {
                $unwind: '$orderassignsData',
              },
            ],
            as: 'wardadmingroupsData',
          },
        },
        // {
        //   $unwind: '$wardadmingroupsData',
        // },
        // {
        //   $lookup: {
        //     from: 'productorderclones',
        //     localField: 'wardadmingroupsData.orderassignsData.orderId',
        //     foreignField: 'orderId',
        //     pipeline:[
        //       {
        //         $lookup: {
        //           from: 'products',
        //           localField: 'productid',
        //           foreignField: '_id',
        //           as: 'productsData',
        //         },
        //       },
             
        // {
        //   $unwind: '$productsData',
        // },
        //     ],

        //     as: 'productorderclonesData',
        //   },
        // },
        // {
        //   $unwind: '$productorderclonesData',
        // },
        // {
        //   $lookup: {
        //     from: 'returnstocks',
        //     localField: 'wardadmingroupsData._id',
        //     foreignField: 'groupId',
        //     pipeline:[
        //       {
        //         $match: {
        //           $and: [{ misMatch: { $ne:null }}],
        //         },
        //       },
        //       // {
        //       //   $match: {
        //       //     $and: [{ productId: { $eq:"$productorderclonesData.productsData._id" }}],
        //       //   },
        //       // },
              
        //     ],
        //     as: 'returnstocks',
        //   },
        // },

        {
          $project: {
            name:1,
            total:{$size:"$wardadmingroupsData.orderassignsData"},
            groupId:"$wardadmingroupsData._id"
            // product:"$productorderclonesData.productsData.productTitle",
            // data:"$returnstocks.misMatch"
          },
        },
       ])
       return data;
}		

const Mismatch_Stock_Reconcilation1 = async (id) => {
  let data = await wardAdminGroup.aggregate([
    {
      $match:{
        $and: [{ deliveryExecutiveId: { $eq:id }}],
      }
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'deliveryExecutiveId',
        foreignField: '_id',
        as: 'b2busers',
      },
    },  
{
$unwind: '$b2busers',
},

    {
      $lookup: {
        from: 'returnstocks',
        localField: '_id',
        foreignField: 'groupId',
        pipeline:[
          {
                    $match: {
                      $and: [{ misMatch: { $ne:null }}],
                    },
                  },
                  {
                    $group: {
                      _id: null,
                      total: { $sum: '$misMatch' },
                    },
                  },
        ],
        as: 'returnstocksData',
      },
    },
    {
      $unwind: '$returnstocksData',
      },
    
    {
      $project: {
        name:"$b2busers.name",
        groupId:1,
        mismatch:"$returnstocksData.total",
        assignDate:1,
      },
    },
    // {
    //       $match: {
    //       $and: [{ mismatch: { $type: 'array', $ne: [] } }] 
    //   },
    // },
  ])
  return data ;
}
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
  wardloadExecutivebtgroup,
  getdetailsDataStatuslasped,
  mismatchCount,
  mismatchGroup,
  Mismatch_Stock_Reconcilation,
  Mismatch_Stock_Reconcilation1
};
