const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
let currentDate = moment().format('DD-MM-YYYY');
const { ShopOrderClone } = require('../models/shopOrder.model');
const Role = require('../models/roles.model');
const orderPayment = require('../models/orderpayment.model');
const creditBillGroup = require('../models/b2b.creditBillGroup.model');
const creditBill = require('../models/b2b.creditBill.model');
const creditBillPaymentModel = require('../models/b2b.creditBillPayments.History.model');
const { Roles } = require('../models');
const { Users } = require('../models/B2Busers.model');

const OrderPayment = require("../models/orderpayment.model")
const getShopWithBill = async (page) => {
  let values = await ShopOrderClone.aggregate([
    {
      $lookup: {
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $group: { _id: null, price: { $sum: '$paidAmt' } },
          },
        ],
        as: 'paymentData',
      },
    },
    { $unwind: '$paymentData' },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shopNameData',
      },
    },
    { $unwind: '$shopNameData' },
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
        as: 'productData',
      },
    },
    { $unwind: '$productData' },
    // {
    //   $project: {
    //     shopName: '$shopNameData.SName',
    //     shopId: '$shopNameData._id',
    //     date: "$shopNameData.customerBilldate",
    //      orderId: "$shopNameData.OrderId",
    //     customerBillId: 1,
    //     overAllTotalBYOrder: {$round:["$productData.price",0]},
    //     paidamount: "$paymentData.price",
    //     pendingAmount: { $subtract: [ {$round:["$productData.price",0]}, "$paymentData.price" ] } ,
    //     condition1: {
    //         $cond: {if: {$ne: [{ $subtract: [ {$round:["$productData.price",0]}, "$paymentData.price" ] }, 0]}, then: true, else: false}
    //     },
    //   },
    // },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  let total = await ShopOrderClone.aggregate([
    {
      $lookup: {
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $group: { _id: null, price: { $sum: '$paidAmt' } },
          },
        ],
        as: 'paymentData',
      },
    },
    { $unwind: '$paymentData' },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shopNameData',
      },
    },
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
        as: 'productData',
      },
    },
    { $unwind: '$productData' },
  ]);
  return { values: values, total: total.length };
};

const getWardExecutiveName = async () => {
  let values = await Role.aggregate([
    {
      $match: {
        $and: [{ roleName: { $eq: 'Ward delivery execute(WDE)' } }],
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: '_id',
        foreignField: 'userRole',
        as: 'WDEName',
      },
    },
    { $unwind: '$WDEName' },
    {
      $project: {
        DeviveryExecutiveName: '$WDEName.name',
        nameId: '$WDEName._id',
      },
    },
  ]);
  return values;
};

const getsalesmanName = async () => {
  let values = await Role.aggregate([
    {
      $match: {
        $and: [{ roleName: { $eq: 'Ward Field Sales Executive(WFSE)' } }],
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: '_id',
        foreignField: 'userRole',
        as: 'SMName',
      },
    },
    { $unwind: '$SMName' },
    {
      $project: {
        salesman: '$SMName.name',
        SMnameId: '$SMName._id',
      },
    },
  ]);
  return values;
};

const getShopHistory = async (userId, id) => {
  console.log(id)
  console.log(userId)
  // { AssignedUserId: { $eq: userId } },
  let values = await creditBill.aggregate([
    {
      $match: {
        $and: [{ AssignedUserId: { $eq: userId } }, { creditbillId: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'productorderclones',
        localField: 'orderId',
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
      $unwind: "$productorderclones"
    },
    {
      $lookup: {
        from: 'orderpayments',
        localField: 'orderId',
        foreignField: 'orderId',
        pipeline: [
          {
            $group: { _id: null, price: { $sum: '$paidAmt' } }
          }
        ],
        as: 'orderpaymentsData'
      }
    },
    { $unwind: "$orderpaymentsData" },
    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'orderId',
        foreignField: '_id',
        as: 'shoporderclones'
      }
    },
    { $unwind: "$shoporderclones" },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'b2bshopclones'
      }
    },
    { $unwind: "$b2bshopclones" },
    {
      $lookup: {
        from: 'orderpayments',
        localField: 'orderId',
        foreignField: 'orderId',
        as: 'orderpaymentsData_value'
      }
    },
    {
      $project: {
        _id: 1,
        orderId: 1,
        shopId: 1,
        date: 1,
        SName: "$b2bshopclones.SName",
        OrderId: "$shoporderclones.OrderId",
        customerBillId: "$shoporderclones.customerBillId",
        created: "$shoporderclones.created",
        TotalAmount: { $round: ["$productorderclones.price", 0] },
        paidAmount: "$orderpaymentsData.price",
        orderpaymentsData_value: "$orderpaymentsData_value",
        Schedulereason: 1,
        reasonScheduleOrDate: 1

      }
    },
  ]);
  let group = await creditBillGroup.findById(id)

  return { value: values, groupstatus: group.receiveStatus };
};

const updateAssignedStatusPerBill = async (id) => {
  let Status = await ShopOrderClone.findById(id);
  if (!Status) {
    throw new ApiError(httpStatus.NOT_FOUND, 'status not found');
  }
  Status = await ShopOrderClone.findByIdAndUpdate({ _id: id }, { creditBillAssignedStatus: 'Assigned' }, { new: true });
  return Status;
};


const createGroup = async (body) => {
  let serverdates = moment().format('YYYY-MM-DD');
  console.log(typeof serverdates);
  let servertime = moment().format('hh:mm a');

  const group = await creditBillGroup.find({ assignedDate: serverdates });

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

  let values = {
    ...body,
    ...{
      groupId: userId,
      assignedDate: serverdates,
      assignedTime: servertime,
      created: moment(),
    },
  };
  let wardAdminGroupcreate = await creditBillGroup.create(values);
  body.Orderdatas.forEach(async (e) => {
    let orderId = e._id;
    let shopId = e.shopId;
    await ShopOrderClone.findByIdAndUpdate({ _id: orderId }, { creditBillAssignedStatus: "Assigned" });
    await creditBill.create({
      AssignedUserId: body.AssignedUserId,
      orderId: orderId,
      shopId: shopId,
      creditbillId: wardAdminGroupcreate._id,
      date: serverdates,
      time: servertime,
      created: moment(),
    });
  });

  return wardAdminGroupcreate;
};

const payingCAshWithDEorSM = async (id, updateBody) => {
  let currentDate = moment().format('YYYY-MM-DD');
  let currenttime = moment().format('HHmm');

  let updateProduct = await creditBill.findById(id);
  if (!updateProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, ' Not Found');
  }

  // updateProduct = await creditBill.findByIdAndUpdate({ _id: id }, updateBody, { new: true });

  await creditBillPaymentModel.create({
    date: currentDate,
    time: currenttime,
    created: moment(),
    creditBillId: updateProduct._id,
    orderId: updateBody.orderId,
    shopId: updateBody.shopId,
    pay_By: updateBody.pay_By,
    pay_type: updateBody.pay_type,
    upiStatus: updateBody.upiStatus,
    amountPayingWithDEorSM: updateBody.amountPayingWithDEorSM,
    actionStatus: updateBody.actionStatus,
    reasonScheduleOrDate: updateBody.reasonScheduleOrDate,
  });

  console.log(updateProduct);

  return updateProduct;
};

const getManageCreditBillAssigning = async () => {
  let values = await creditBillGroup.aggregate([
    {
      $lookup: {
        from: 'b2busers',
        localField: 'AssignedUserId',
        foreignField: '_id',
        as: 'deliveryExecutiveNameData',
      },
    },
    { $unwind: '$deliveryExecutiveNameData' },
    {
      $lookup: {
        from: 'creditbills',
        localField: '_id',
        foreignField: 'creditbillId',
        as: 'historyDatass',
      },
    },
    { $unwind: '$historyDatass' },

    // {
    //   $project: {
    //     assignedDate:1,
    //     assignedTime:1,
    //     groupId:1,
    //     execuName: "$deliveryExecutiveNameData.name",
    //     TotalBills:1,
    //     totalAmount:1,
    //     totalShops: {"$size": "$Orderdatas.shopId"}
    //   }
    // }
  ]);
  return values;
};

const getcreditBillDetailsByPassExecID = async (id) => {
  let values = await creditBillGroup.aggregate([
    {
      $match: {
        $and: [{ AssignedUserId: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'creditbills',
        localField: '_id',
        foreignField: 'creditbillId',
        as: 'datasss',
      },
    },
  ]);
  return values;
};

const getHistoryByPassOrderId = async (id) => {
  let values = await orderPayment.aggregate([
    {
      $match: {
        $and: [{ orderId: { $eq: id } }],
      },
    },
    // {
    //   $lookup: {
    //     from: 'orderpayments',
    //     localField: '_id',
    //     foreignField: 'orderId',
    //     as: 'paymentsData'
    //   }
    // },{ $unwind: "$paymentData"},
  ]);
  return values;
};

const getDElExecutiveName = async (AssignedUserId) => {
  //     let match;
  //   if(AssignedUserId != 'null'){
  //       match = [{ AssignedUserId: { $eq: AssignedUserId }}, { active: { $eq: true }}];
  //   }
  //    else {
  //   match = [{ AssignedUserId: { $ne: null } }, { active: { $eq: true } }];
  // }
  let values = await creditBillGroup.aggregate([
    // {
    //   $match: {
    //     $and: [{ AssignedUserId: { $eq: AssignedUserId } }],
    //   },
    // },

    {
      $lookup: {
        from: 'b2busers',
        localField: 'AssignedUserId',
        foreignField: '_id',

        as: 'WDEName',
      },
    },
    { $unwind: '$WDEName' },
    {
      $lookup: {
        from: 'roles',
        localField: 'WDEName.userRole',
        foreignField: '_id',
        //   pipeline: [
        //     {
        //       $match: {
        //         $and: [{ roleName: { $eq: 'Ward delivery execute(WDE)' } }],
        //       },

        //   }
        // ],
        as: 'data',
      },
    },
    { $unwind: '$data' },

    {
      $project: {
        DeviveryExecutiveName: '$WDEName.name',
        nameId: '$WDEName._id',
        roleName: '$data.roleName',
      },
    },
  ]);
  return values;
};

const getsalesName = async () => {
  let values = await creditBillGroup.aggregate([
    {
      $lookup: {
        from: 'b2busers',
        localField: 'salesmanId',
        foreignField: '_id',

        as: 'WDEName',
      },
    },
    { $unwind: '$WDEName' },
    {
      $lookup: {
        from: 'roles',
        localField: 'WDEName.userRole',
        foreignField: '_id',
        pipeline: [
          {
            $match: {
              $and: [{ roleName: { $eq: 'Ward Field Sales Executive(WFSE)' } }],
            },
          },
        ],
        as: 'data',
      },
    },
    { $unwind: '$data' },

    {
      $project: {
        DeviveryExecutiveName: '$WDEName.name',
        nameId: '$WDEName._id',
        roleName: '$data.roleName',
      },
    },
  ]);
  return values;
};

const getNotAssignData = async (page) => {
  let values = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [{ creditBillAssignedStatus: { $ne: 'Assigned' } }, { status: { $eq: "Delivered" } }, { statusOfBill: { $eq: "Pending" } }],
      },
    },
    {
      $lookup: {
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $group: { _id: null, price: { $sum: '$paidAmt' } },
          },
        ],
        as: 'paymentData',
      },
    },
    { $unwind: '$paymentData' },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shopDtaa',
      },
    },
    { $unwind: '$shopDtaa' },
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
        as: 'productData',
      },
    },

    { $unwind: '$productData' },
    // {
    //   $lookup: {
    //     from:'creditbills',
    //     localField: '_id',
    //     foreignField: 'orderId',
    //     as: 'creditbillsData',
    //   }
    // },
    // { $unwind: '$creditbillsData'},




    {
      $project: {
        Schedulereason: 1,
        Scheduledate: 1,
        customerBillId: 1,
        OrderId: 1,
        date: 1,
        statusOfBill: 1,
        executeName: '$dataa.AssignedUserId',
        shopNmae: '$shopDtaa.SName',
        shopId: '$shopDtaa._id',
        creditBillAssignedStatus: 1,
        BillAmount: { $round: ['$productData.price', 0] },
        totalHistory: {
          $sum: '$creditData.historyDtaa.amountPayingWithDEorSM',
        },

        paidAmount: '$paymentData.price',

        pendingAmount: { $round: { $subtract: ['$productData.price', '$paymentData.price'] } },

        condition1: {
          $cond: {
            if: { $ne: [{ $subtract: [{ $round: ['$productData.price', 0] }, '$paymentData.price'] }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $match: {
        $and: [{ condition1: { $eq: true } }],
      },
    },

    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  let total = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [{ creditBillAssignedStatus: { $ne: 'Assigned' } }, { status: { $eq: "Delivered" } }, { statusOfBill: { $eq: "Pending" } }],
      },
    },
    {
      $lookup: {
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $group: { _id: null, price: { $sum: '$paidAmt' } },
          },
        ],
        as: 'paymentData',
      },
    },
    { $unwind: '$paymentData' },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shopDtaa',
      },
    },
    { $unwind: '$shopDtaa' },
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
        as: 'productData',
      },
    },

    { $unwind: '$productData' },
    // {
    //   $lookup: {
    //     from:'creditbills',
    //     localField: '_id',
    //     foreignField: 'orderId',
    //     as: 'creditbillsData',
    //   }
    // },
    // { $unwind: '$creditbillsData'},




    {
      $project: {
        Schedulereason: 1,
        Scheduledate: 1,
        customerBillId: 1,
        OrderId: 1,
        date: 1,
        statusOfBill: 1,
        executeName: '$dataa.AssignedUserId',
        shopNmae: '$shopDtaa.SName',
        shopId: '$shopDtaa._id',
        creditBillAssignedStatus: 1,
        BillAmount: { $round: ['$productData.price', 0] },
        totalHistory: {
          $sum: '$creditData.historyDtaa.amountPayingWithDEorSM',
        },

        paidAmount: '$paymentData.price',

        pendingAmount: { $round: { $subtract: ['$productData.price', '$paymentData.price'] } },

        condition1: {
          $cond: {
            if: { $ne: [{ $subtract: [{ $round: ['$productData.price', 0] }, '$paymentData.price'] }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $match: {
        $and: [{ condition1: { $eq: true } }],
      },
    },
  ]);
  // return values;

  return { values: values, total: total.length };
};

const getShopPendingByPassingShopId = async (id) => {
  let values = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [{ shopId: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $group: { _id: null, price: { $sum: '$paidAmt' } },
          },
        ],
        as: 'paymentData',
      },
    },
    { $unwind: '$paymentData' },

    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shopDtaa',
      },
    },
    { $unwind: '$shopDtaa' },
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
        as: 'productData',
      },
    },

    { $unwind: '$productData' },
    // {
    //   $lookup: {
    //     from:'creditbills',
    //     localField: '_id',
    //     foreignField: 'orderId',
    //     as: 'billDta'
    //   }
    // },
    // { $unwind: '$billDta'},
    // {
    //   $lookup: {
    //     from: 'creditbillpaymenthistories',
    //     localField: 'billDta._id',
    //     foreignField: 'creditBillId',
    //     as: 'datasss'
    //   }
    // },
    // { $unwind: '$datasss'},

    {
      $project: {
        customerBillId: 1,
        OrderId: 1,
        date: 1,
        statusOfBill: 1,
        executeName: '$dataa.AssignedUserId',
        shopNmae: '$shopDtaa.SName',
        shopId: '$shopDtaa._id',
        creditBillAssignedStatus: 1,
        BillAmount: { $round: ['$productData.price', 0] },
        paidAmount: '$paymentData.price',

        pendingAmount: { $round: { $subtract: ['$productData.price', '$paymentData.price'] } },
        amountPayingByPayAndAct: "$datasss.amountPayingWithDEorSM",


        condition1: {
          $cond: {
            if: { $ne: [{ $subtract: [{ $round: ['$productData.price', 0] }, '$paymentData.price'] }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        customerBillId: 1,
        OrderId: 1,
        date: 1,
        statusOfBill: 1,
        executeName: 1,
        shopNmae: 1,
        shopId: 1,
        creditBillAssignedStatus: 1,
        BillAmount: 1,
        paidAmount: 1,

        pendingAmount: 1,
        amountPayingByPayAndAct: 1,
        BalancePendingAmount: { $subtract: ["$BillAmount", "$amountPayingByPayAndAct"] },


        condition1: {
          $cond: {
            if: { $ne: [{ $subtract: [{ $round: ['$productData.price', 0] }, '$paymentData.price'] }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },

  ]);
  return values;
};

const getDeliDetails = async () => {
  // let match;
  // if(id != 'null' ){
  //   match = [{ id: { $eq: id } },  { active: { $eq: true } }];
  // } else if (id != 'null') {
  //   match = [{ id: { $eq: id } }, { active: { $eq: true } }];
  // }else {
  //   match = [{ id: { $ne: null } }, { active: { $eq: true } }];
  // }

  let values = await Users.aggregate([
    // {
    //   $match: {
    //     $and: match,
    //   },
    // },
    {
      $match: {
        $or: [
          { userRole: { $eq: '36151bdd-a8ce-4f80-987e-1f454cd0993f' } },
          { userRole: { $eq: 'fb0dd028-c608-4caa-a7a9-b700389a098d' } },
        ],
      },
    },
    {
      $lookup: {
        from: 'creditbillgroups',
        localField: '_id',
        foreignField: 'AssignedUserId',
        pipeline: [
          {
            $match: {
              receiveStatus: { $ne: 'received' },
            },
          },
          {
            $lookup: {
              from: 'creditbills',
              localField: '_id',
              foreignField: 'creditbillId',
              pipeline: [{ $group: { _id: null, countBill: { $sum: 1 } } }],
              as: 'creditBill',
            },
          },
          { $unwind: '$creditBill' },
          {
            $group: { _id: null, count: { $sum: 1 }, billcount: { $sum: '$creditBill.countBill' } },
          },
        ],
        as: 'userDta',
      },
    },
    { $unwind: '$userDta' },

    {
      $project: {
        name: 1,
        GroupCount: '$userDta.count',
        TotalBillCount: '$userDta.billcount',
      },
    },
  ]);

  return values;
};

const getFineAccount = async (id) => {
  let values = await creditBill.aggregate([
    {
      $match: {
        $and: [{ AssignedUserId: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'orderpayments',
        localField: 'orderId',
        foreignField: 'orderId',
        pipeline: [
          {
            $group: { _id: null, price: { $sum: '$paidAmt' } },
          },
        ],
        as: 'paymentData',
      },
    },
    { $unwind: '$paymentData' },

    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shopDtaa',
      },
    },
    { $unwind: '$shopDtaa' },
    {
      $lookup: {
        from: 'productorderclones',
        localField: 'orderId',
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
      },
    },

    { $unwind: '$productData' },
    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'orderId',
        foreignField: '_id',
        as: 'shopOrderCloneData',
      },
    },
    { $unwind: '$shopOrderCloneData' },
    // {
    //   $lookup: {
    //     from:'creditbillpaymenthistories',
    //     localField: '_id',
    //     foreignField: 'creditBillId',
    //     as: 'creditBillData'
    //   }
    // },
    // { $unwind: "$creditBillData"},
    //   {
    //       $unwind: {
    //         path: '$creditBillData',
    //         preserveNullAndEmptyArrays: true,
    //       },
    //     },

    {
      $project: {
        date: 1,
        PaymentType: '$creditBillData.pay_By',
        paymentCapacity: '$creditBillData.pay_type',
        paymentStatus: '$creditBillData.upiStatus',
        paymentMode: '$creditBillData.paymentMode',
        AmountPayiong: '$creditBillData.amountPayingWithDEorSM',
        customerBillIds: '$shopOrderCloneData.customerBillId',
        OrderIds: '$shopOrderCloneData.OrderId',
        dates: '$shopOrderCloneData.date',
        statusOfBill: 1,
        executeName: '$dataa.AssignedUserId',
        shopNmae: '$shopDtaa.SName',
        shopId: '$shopDtaa._id',
        creditBillAssignedStatus: 1,
        BillAmount: { $round: ['$productData.price', 0] },
        paidAmount: '$paymentData.price',

        pendingAmount: { $round: { $subtract: ['$productData.price', '$paymentData.price'] } },

        condition1: {
          $cond: {
            if: { $ne: [{ $subtract: [{ $round: ['$productData.price', 0] }, '$paymentData.price'] }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },
  ]);
  return values;
};

const getDeliveryExecutiveName = async () => {
  let data = await Roles.aggregate([
    {
      $lookup: {
        from: 'b2busers',
        localField: '_id',
        foreignField: 'userRole',
        pipeline: [
          {
            $lookup: {
              from: 'creditbills',
              let: {
                localField: '$_id',
              },
              pipeline: [{ $match: { $expr: { $eq: ['$AssignedUserId', '$$localField'] } } }],
              as: 'wardadminrolesData',
            },
          },
          // {
          //   $unwind:'$wardadminrolesData',
          //     preserveNullAndEmptyArrays: true,
          // },
        ],
        as: 'b2busersData',
      },
    },
    {
      $unwind: '$b2busersData',
    },
    {
      $project: {
        name: '$b2busersData.name',
        b2buserId: '$b2busersData._id',
        roleName: 1,
        _id: 1,
        // wardadminrolesData:'$b2busersData.wardadminrolesData'
        b2user: '$b2busersData.wardadminrolesData',
      },
    },
    {
      $match: { $and: [{ b2user: { $type: 'array', $ne: [] } }] },
    },
  ]);
  return data;
};

const getGroupAndBill = async (AssignedUserId) => {
  console.log(AssignedUserId);
  let data = await creditBillGroup.aggregate([
    {
      $match: {
        $and: [{ AssignedUserId: { $eq: AssignedUserId } }, { receiveStatus: { $ne: "received" } }],
      },
    },
    {
      $lookup: {
        from: 'creditbills',
        localField: '_id',
        foreignField: 'creditbillId',
        pipeline: [
          {
            $lookup: {
              from: 'productorderclones',
              localField: 'orderId',
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
            },

          },
          {
            $unwind: {
              path: '$productData',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'orderpayments',
              localField: 'orderId',
              foreignField: 'orderId',
              pipeline: [
                {
                  $group: { _id: null, price: { $sum: '$paidAmt' } },
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
              price: "$productData.price",
              orderpayments: "$orderpayments",
              orderpaymentsnow: "$orderpaymentsnow"
            }
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$price" },
              billCount: { $sum: 1 },
              totalpaidAmount: { $sum: "$orderpayments.price" }
            }
          }
        ],
        as: 'creditBillData',
      },
    },
    {
      $unwind: {
        path: '$creditBillData',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'creditID',
        pipeline: [
          {
            $group: { _id: null, price: { $sum: '$paidAmt' } },
          },
        ],
        as: 'orderpaymentsnow',
      },
    },
    {
      $unwind: {
        path: '$orderpaymentsnow',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'creditID',
        pipeline: [
          {
            $match: { paymentMethod: "UPI" }
          },
          {
            $group: { _id: { paymentMethod: "$paymentMethod" }, price: { $sum: '$paidAmt' } },
          },
          {
            $project: {
              paymentMethod: "$_id.paymentMethod",
              price: 1
            }
          }
        ],
        as: 'creditbills_type',
      },
    },
    {
      $unwind: {
        path: '$creditbills_type',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'creditID',
        pipeline: [
          {
            $match: { paymentMethod: "By Cash" }
          },
          {
            $group: { _id: { paymentMethod: "$paymentMethod" }, price: { $sum: '$paidAmt' } },
          },
          {
            $project: {
              paymentMethod: "$_id.paymentMethod",
              price: 1
            }
          }
        ],
        as: 'creditbills_type_cash',
      },
    },
    {
      $unwind: {
        path: '$creditbills_type_cash',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'creditID',
        pipeline: [
          {
            $group: {
              _id: { orderId: "$orderId" },
              count: { $sum: 1 }
            }
          }
        ],
        as: 'creditID',
      },
    },
    {
      $lookup: {
        from: 'creditbills',
        localField: '_id',
        foreignField: 'creditbillId',
        pipeline: [
          {
            $lookup: {
              from: 'productorderclones',
              localField: 'orderId',
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
            },

          },
          {
            $unwind: {
              path: '$productData',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'orderpayments',
              localField: 'orderId',
              foreignField: 'orderId',
              pipeline: [
                {
                  $group: { _id: null, price: { $sum: '$paidAmt' } },
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
              price: "$productData.price",
              orderpayments: "$orderpayments",
              orderpaymentsnow: "$orderpaymentsnow",
              pendingAmount: { $round: { $subtract: ['$productData.price', '$orderpayments.price'] } }
            }
          },
          {
            $match: {
              pendingAmount: { $ne: 0 }
            }
          },
          {
            $group: {
              _id: null,
              billCount: { $sum: 1 },
            }
          }
        ],
        as: 'creditBillDatapending',
      },
    },
    {
      $unwind: {
        path: '$creditBillDatapending',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        groupId: 1,
        assignedDate: 1,
        assignedTime: 1,
        receiveStatus: 1,
        totalAmount: "$creditBillData.totalAmount",
        billCount: "$creditBillData.billCount",
        totalpaidAmount: "$creditBillData.totalpaidAmount",
        collectedAmount: "$orderpaymentsnow.price",
        creditbills_type_upi: "$creditbills_type.price",
        creditbills_type_cash: "$creditbills_type_cash.price",
        collectedbillCount: { $size: "$creditID" },
        pendingbillCount: "$creditBillDatapending.billCount",
        noncollectedbillCount: { $subtract: ['$creditBillData.billCount', { $size: "$creditID" }] }
      }
    }

  ]);
  return data;
};

const getDetailsByPassGroupId = async (id) => {

  let values = await ShopOrderClone.aggregate([
    {
      $lookup: {
        from: 'creditbills',
        localField: '_id',
        foreignField: 'orderId',
        as: 'billData',
      },
    },
    { $unwind: '$billData' },
    {
      $lookup: {
        from: 'creditbillgroups',
        localField: 'billData.creditbillId',
        pipeline: [
          {
            $match: {
              $and: [{ _id: { $eq: id } }],
            },
          },
        ],
        foreignField: '_id',
        as: 'groupDtaa',
      },
    },

    { $unwind: '$groupDtaa' },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'billData.shopId',
        foreignField: '_id',
        as: 'shopNameData',
      },
    },
    { $unwind: '$shopNameData' },

    {
      $lookup: {
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $group: { _id: null, price: { $sum: '$paidAmt' } },
          },
        ],
        as: 'paymentData',
      },
    },
    { $unwind: '$paymentData' },

    {
      $lookup: {
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {

            $match: {
              $and: [{ creditBillStatus: { $eq: "creditBill" } }],
            },

          },
        ],

        as: 'paymentDatadata',
      },
    },

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
        as: 'productData',
      },
    },

    { $unwind: '$productData' },
    {
      $lookup: {
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $sort: {
              created: -1
            }
          },
          {
            $limit: 1,
          }
        ],
        as: 'creditBillData_last',
      },
    },
    {
      $unwind: {
        path: '$creditBillData_last',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {

        customerBillId: 1,
        customerBilldate: 1,
        customerBilltime: 1,
        lastPaymentMode: "$paymentDatadata.payment",
        lastPaymentType: "$paymentDatadata.paymentMethod",
        shopNmae: '$Orderdatas.shopNmae',
        BalanceAmount: '$Orderdatas.pendingAmount',
        shopNmae: '$shopNameData.SName',
        BillAmount: { $round: ['$productData.price', 0] },
        paidAmount: '$paymentData.price',
        pendingAmount: { $round: { $subtract: ['$productData.price', '$paymentData.price'] } },
        paymentMethod: "$creditBillData_last.paymentMethod",
        payment_type: "$creditBillData_last.payment",
        condition1: {
          $cond: {
            if: { $ne: [{ $round: { $subtract: ['$productData.price', '$paymentData.price'] } }, 0] },
            then: true,
            else: false,
          },
        },
      },

    },



  ]);
  let total = await ShopOrderClone.aggregate([
    {
      $lookup: {
        from: 'creditbills',
        localField: '_id',
        foreignField: 'orderId',
        as: 'billData',
      },
    },
    { $unwind: '$billData' },
    {
      $lookup: {
        from: 'creditbillgroups',
        localField: 'billData.creditbillId',
        pipeline: [
          {
            $match: {
              $and: [{ _id: { $eq: id } }],
            },
          },
        ],
        foreignField: '_id',
        as: 'groupDtaa',
      },
    },

    { $unwind: '$groupDtaa' },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'billData.shopId',
        foreignField: '_id',
        as: 'shopNameData',
      },
    },
    { $unwind: '$shopNameData' },

    {
      $lookup: {
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $group: { _id: null, price: { $sum: '$paidAmt' } },
          },
        ],
        as: 'paymentData',
      },
    },
    { $unwind: '$paymentData' },

    {
      $lookup: {
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {

            $match: {
              $and: [{ creditBillStatus: { $eq: "creditBill" } }],
            },

          },
        ],

        as: 'paymentDatadata',
      },
    },
    // { $unwind: '$paymentDatadata' },
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
        as: 'productData',
      },
    },

    { $unwind: '$productData' },

  ]);


  let totalTrue = await ShopOrderClone.aggregate([
    {
      $lookup: {
        from: 'creditbills',
        localField: '_id',
        foreignField: 'orderId',
        as: 'billData',
      },
    },
    { $unwind: '$billData' },
    {
      $lookup: {
        from: 'creditbillgroups',
        localField: 'billData.creditbillId',
        pipeline: [
          {
            $match: {
              $and: [{ _id: { $eq: id } }],
            },
          },
        ],
        foreignField: '_id',
        as: 'groupDtaa',
      },
    },

    { $unwind: '$groupDtaa' },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'billData.shopId',
        foreignField: '_id',
        as: 'shopNameData',
      },
    },
    { $unwind: '$shopNameData' },

    {
      $lookup: {
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $group: { _id: null, price: { $sum: '$paidAmt' } },
          },
        ],
        as: 'paymentData',
      },
    },
    { $unwind: '$paymentData' },

    {
      $lookup: {
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {

            $match: {
              $and: [{ creditBillStatus: { $eq: "creditBill" } }],
            },

          },
        ],

        as: 'paymentDatadata',
      },
    },
    // { $unwind: '$paymentDatadata' },
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
        as: 'productData',
      },
    },

    { $unwind: '$productData' },

    {
      $project: {

        customerBillId: 1,
        customerBilldate: 1,
        customerBilltime: 1,
        lastPaymentMode: "$paymentDatadata.payment",
        lastPaymentType: "$paymentDatadata.paymentMethod",
        shopNmae: '$Orderdatas.shopNmae',
        BalanceAmount: '$Orderdatas.pendingAmount',
        shopNmae: '$shopNameData.SName',
        BillAmount: { $round: ['$productData.price', 0] },
        paidAmount: '$paymentData.price',
        pendingAmount: { $round: { $subtract: ['$productData.price', '$paymentData.price'] } },
        condition1: {
          $cond: {
            if: { $ne: [{ $round: { $subtract: ['$productData.price', '$paymentData.price'] } }, 0] },
            then: true,
            else: false,
          },
        },
      },

    },



  ]);
  return { values: values, total: total.length, totalTrue: totalTrue.length, };
};

const submitDispute = async (id, updatebody) => {
  // console.log(id, updatebody);
  let product = await creditBillGroup.findById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, ' srfegfNot Found');
  }
  product = await creditBillGroup.findByIdAndUpdate({ _id: id }, { ...updatebody, ...{ finishDate: moment(), receiveStatus: "received" } }, { new: true });
  console.log(product);
  let creditBill_array = await creditBill.find({ creditbillId: id });
  creditBill_array.forEach(async (e) => {
    await ShopOrderClone.findByIdAndUpdate({ _id: e.orderId }, { creditBillAssignedStatus: "Pending" }, { new: true });
  })
  return product;
};

const getPaymentTypeCount = async (id) => {
  let values = await orderPayment.aggregate([
    {
      $match: {
        $and: [{ creditBillStatus: { $eq: "creditBill" } }],

      }
    },
    {
      $lookup: {
        from: 'creditbills',
        localField: 'orderId',
        foreignField: 'orderId',
        as: 'billData',
      },
    },
    { $unwind: '$billData' },
    {
      $lookup: {
        from: 'creditbillgroups',
        localField: 'billData.creditbillId',
        pipeline: [
          {
            $match: {
              $and: [{ _id: { $eq: id } }],
            },
          },
        ],
        foreignField: '_id',
        as: 'groupDtaa',
      },
    },
    { $unwind: '$groupDtaa' },
    {
      $project: {
        paymentMethod: 1,
        paidAmt: 1,
        billNo: "$billData.bill"
      }
    },


    { $group: { _id: '$paymentMethod', TotalAmount: { $sum: '$paidAmt' } } },
  ]);

  return values;
};
const getdeliveryExcutive = async (userId, page) => {
  let group = await creditBillGroup.aggregate([
    {
      $match: {
        AssignedUserId: { $eq: userId },
        receiveStatus: { $ne: "received" },
      }
    },
    {
      $lookup: {
        from: 'creditbills',
        localField: '_id',
        foreignField: 'creditbillId',
        pipeline: [
          {
            $group: {
              _id: null,
              count: { $sum: 1 }
            }
          }
        ],
        as: 'creditbills',
      },
    },
    { $unwind: '$creditbills' },
    {
      $project: {
        _id: 1,
        receiveStatus: 1,
        AssignedUserId: 1,
        groupId: 1,
        assignedDate: 1,
        assignedTime: 1,
        creditbillcount: "$creditbill.count"
      }
    }
  ]);
  let total = await creditBillGroup.aggregate([
    {
      $match: {
        AssignedUserId: { $eq: userId }
      }
    },
    {
      $lookup: {
        from: 'creditbills',
        localField: '_id',
        foreignField: 'creditbillId',
        pipeline: [
          {
            $group: {
              _id: null,
              count: { $sum: 1 }
            }
          }
        ],
        as: 'creditbills',
      },
    },
    { $unwind: '$creditbills' },
  ]);
  return { value: group, total: total.length };
}
const submitfinish = async (userId, id) => {
  let group = await creditBillGroup.findOne({ _id: id, AssignedUserId: userId });
  if (!group) {
    throw new ApiError(httpStatus.NOT_FOUND, 'status not found');
  }
  group = await creditBillGroup.findByIdAndUpdate({ _id: id, AssignedUserId: userId }, { receiveStatus: "finish" }, { new: true });

  return group;
}

const getCreditBillMaster = async (query) => {
  let page = query.page == null ? 0 : parseInt(query.page);
  if (page == null || page < 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ivalid Page Count');
  }
  let zone = query.zone
  let ward = query.ward
  let search = query.search
  let date = query.date;
  let user = query.user;
  let zoneMatch = { active: true }
  let wardMatch = { active: true }
  let searchMatch = { active: true }
  let dateMatch = { active: true };
  let userMatch = { active: true };
  startdate = null;
  enddata = null;
  if (zone != null && zone != '') {
    zoneMatch = { zoneId: { $eq: zone } }
  }
  if (ward != null && ward != '') {
    wardMatch = { Wardid: { $eq: ward } }
  }
  if (search != null && search != '') {
    searchMatch = {
      $or: [{ SName: { $regex: search, $options: 'i' } }, { mobile: { $regex: search, $options: 'i' } }],
    }
  }
  if (date != null && date != '') {
    date = date.split(",")
    startdate = date[0]
    enddata = date[1]
    // console.log(startdate)
    // console.log(enddata)
    dateMatch = { $and: [{ Scheduledate: { $gte: startdate } }, { Scheduledate: { $lte: enddata } }] }
  }
  if (user != null && user != '') {
    userMatch = { AssignedUserId: { $eq: user } }
  }
  // console.log(zone);
  // console.log(ward);
  // console.log(search);
  // console.log(date);
  // console.log(userMatch);
  // Scheduledate

  let values = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [dateMatch, { status: { $eq: 'Delivered' } },]
      }
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        pipeline: [
          {
            $match: {
              $and: [wardMatch, searchMatch]
            }
          },
          {
            $lookup: {
              from: 'wards',
              localField: 'Wardid',
              foreignField: '_id',
              pipeline: [
                {
                  $match: {
                    $and: [zoneMatch,]
                  }
                },
              ],
              as: 'wards',
            },
          },
          { $unwind: '$wards' },
        ],
        as: 'b2bshopclones',
      },
    },

    { $unwind: '$b2bshopclones' },
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
        as: 'productData',
      },
    },
    { $unwind: '$productData' },
    {
      $lookup: {
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          { $limit: 1 }
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
        as: 'orderpaymentsall',
      },
    },
    {
      $unwind: {
        path: '$orderpaymentsall',
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
      $lookup: {
        from: 'creditbills',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $lookup: {
              from: 'b2busers',
              localField: 'AssignedUserId',
              foreignField: '_id',
              as: 'b2busers',
            },
          },
          {
            $unwind: {
              path: '$b2busers',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'creditbillgroups',
              localField: 'creditbillId',
              foreignField: '_id',
              pipeline: [
                { $match: { receiveStatus: { $ne: "received" } } }
              ],
              as: 'creditbillgroups',
            },
          },
          {
            $unwind: "$creditbillgroups"
          },
          {
            $project: {
              assignedUserName: "$b2busers.name",
              AssignedUserId: 1
            }
          }
        ],
        as: 'creditbills',
      },
    },
    {
      $unwind: {
        path: '$creditbills',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        customerBillId: 1,
        OrderId: 1,
        created: 1,
        _id: 1,
        SName: "$b2bshopclones.SName",
        delivered_date: 1,
        TotalAmount: { $round: "$productData.price" },
        lastPaidAmount: "$orderpayments.paidAmt",
        paidAMount: {
          $sum: ['$orderpaymentsall.amount', '$reorderamount'],
        },
        pendingAmount: {
          $subtract: [{ $round: "$productData.price" }, { $sum: ['$orderpaymentsall.amount', '$reorderamount'], }]
        },
        Schedulereason: 1,
        creditBillAssignedStatus: 1,
        creditbills: "$creditbills",
        assignedUserName: "$creditbills.assignedUserName",
        AssignedUserId: "$creditbills.AssignedUserId",
        active: 1,
        Scheduledate: 1

      }
    },
    {
      $match: {
        $and: [userMatch]
      }
    },

    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [dateMatch, { status: { $eq: 'Delivered' } },]
      }
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        pipeline: [
          {
            $match: {
              $and: [wardMatch, searchMatch]
            }
          },
          {
            $lookup: {
              from: 'wards',
              localField: 'Wardid',
              foreignField: '_id',
              pipeline: [
                {
                  $match: {
                    $and: [zoneMatch,]
                  }
                },
              ],
              as: 'wards',
            },
          },
          { $unwind: '$wards' },
        ],
        as: 'b2bshopclones',
      },
    },

    { $unwind: '$b2bshopclones' },
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
        as: 'productData',
      },
    },
    { $unwind: '$productData' },
    {
      $lookup: {
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          { $limit: 1 }
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
        as: 'orderpaymentsall',
      },
    },
    {
      $unwind: {
        path: '$orderpaymentsall',
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
      $lookup: {
        from: 'creditbills',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $lookup: {
              from: 'b2busers',
              localField: 'AssignedUserId',
              foreignField: '_id',
              as: 'b2busers',
            },
          },
          {
            $unwind: {
              path: '$b2busers',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'creditbillgroups',
              localField: 'creditbillId',
              foreignField: '_id',
              pipeline: [
                { $match: { receiveStatus: { $ne: "received" } } }
              ],
              as: 'creditbillgroups',
            },
          },
          {
            $unwind: "$creditbillgroups"
          },
          {
            $project: {
              assignedUserName: "$b2busers.name",
              AssignedUserId: 1
            }
          }
        ],
        as: 'creditbills',
      },
    },
    {
      $unwind: {
        path: '$creditbills',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        customerBillId: 1,
        OrderId: 1,
        created: 1,
        _id: 1,
        SName: "$b2bshopclones.SName",
        delivered_date: 1,
        TotalAmount: { $round: "$productData.price" },
        lastPaidAmount: "$orderpayments.paidAmt",
        paidAMount: {
          $sum: ['$orderpaymentsall.amount', '$reorderamount'],
        },
        pendingAmount: {
          $subtract: [{ $round: "$productData.price" }, { $sum: ['$orderpaymentsall.amount', '$reorderamount'], }]
        },
        Schedulereason: 1,
        creditBillAssignedStatus: 1,
        creditbills: "$creditbills",
        assignedUserName: "$creditbills.assignedUserName",
        AssignedUserId: "$creditbills.AssignedUserId",
        active: 1,
        Scheduledate: 1
      }
    },
    {
      $match: {
        $and: [userMatch]
      }
    },
  ]);
  return { values: values, total: total.length };
}



const groupCreditBill = async (AssignedUserId, date,page) => {
  let match;
  if (AssignedUserId != 'null' && date != 'null') {
    match = [{ AssignedUserId: { $eq: AssignedUserId } }, { date: { $eq: date } }, { active: { $eq: true } }];
  } else if (AssignedUserId != 'null') {
    match = [{ AssignedUserId: { $eq: AssignedUserId } }, { active: { $eq: true } }];
  } else if (date != 'null') {
    match = [{ date: { $eq: date } }, { active: { $eq: true } }];
  } else {
    match = [{ AssignedUserId: { $ne: null } }, { active: { $eq: true } }];
  }

let values = await creditBillGroup.aggregate([
  {
      $match: {
          $and:match,
      },
  },
  {
    $lookup:{
      from: 'b2busers',
      localField: 'AssignedUserId',
      foreignField: '_id',
      as: 'b2busersData',
    }
  },
  { $unwind:"$b2busersData"},
  {
    $lookup: {
      from: 'creditbills',
      localField: '_id',
      foreignField: 'creditbillId',
      pipeline: [
        {
          $lookup: {
            from: 'productorderclones',
            localField: 'orderId',
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
          },

        },
        {
          $unwind: {
            path: '$productData',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'orderpayments',
            localField: 'orderId',
            foreignField: 'orderId',
            pipeline: [
              {
                $group: { _id: null, price: { $sum: '$paidAmt' } },
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
            price: "$productData.price",
            orderpayments: "$orderpayments",
            orderpaymentsnow: "$orderpaymentsnow"
          }
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$price" },
            billCount: { $sum: 1 },
            totalpaidAmount: { $sum: "$orderpayments.price" }
          }
        }
      ],
      as: 'creditBillData',
    },
  },
  {
    $unwind: {
      path: '$creditBillData',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: 'orderpayments',
      localField: '_id',
      foreignField: 'creditID',
      pipeline: [
        {
          $match: { paymentMethod: "UPI" }
        },
        {
          $group: { _id: { paymentMethod: "$paymentMethod" }, price: { $sum: '$paidAmt' } },
        },
        {
          $project: {
            paymentMethod: "$_id.paymentMethod",
            price: 1
          }
        }
      ],
      as: 'creditbills_type',
    },
  },
  {
    $unwind: {
      path: '$creditbills_type',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: 'orderpayments',
      localField: '_id',
      foreignField: 'creditID',
      pipeline: [
        {
          $match: { paymentMethod: "By Cash" }
        },
        {
          $group: { _id: { paymentMethod: "$paymentMethod" }, price: { $sum: '$paidAmt' } },
        },
        {
          $project: {
            paymentMethod: "$_id.paymentMethod",
            price: 1
          }
        }
      ],
      as: 'creditbills_type_cash',
    },
  },
  {
    $unwind: {
      path: '$creditbills_type_cash',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: 'orderpayments',
      localField: '_id',
      foreignField: 'creditID',
      pipeline: [
        {
          $group: {
            _id: { orderId: "$orderId" },
            count: { $sum: 1 }
          }
        }
      ],
      as: 'creditID',
    },
  },
  
  {
    $project: {
      executiveName: "$b2busersData.name",
      groupId:1,
      assignedTime:1,
      assignedDate:1,
      disputeAmount:1,
      count: { $size:"$Orderdatas"},
      receiveStatus:1,
      billCount: "$creditBillData.billCount",
      // totalpaidAmount: "$creditBillData.totalpaidAmount",
      collectedAmount: "$orderpaymentsnow.price",
      creditbills_type_upi: "$creditbills_type.price",
      creditbills_type_cash: "$creditbills_type_cash.price",
      collectedbillCount: { $size: "$creditID" },
      pendingbillCount: "$creditBillDatapending.billCount",
      noncollectedbillCount: { $subtract: ['$creditBillData.billCount', { $size: "$creditID" }] }
    }
  },

  { $skip: 10 * page },
  { $limit: 10 },

  ]);
  let total = await creditBillGroup.aggregate([
    {
        $match: {
            $and:match,
        },
    },
    {
      $lookup:{
        from: 'b2busers',
        localField: 'AssignedUserId',
        foreignField: '_id',
        as: 'b2busersData',
      }
    },
    { $unwind:"$b2busersData"},
  ]);
  
  return {values: values, total: total.length};

}



const getbilldetails = async (query) => {
  // console.log(query.id)
  let id = query.id;
  let order = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }]
      }
    },
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
        as: 'productData',
      },
    },
    { $unwind: '$productData' },
    {
      $project: {
        price: { $round: "$productData.price" },
        customerBillId: 1,
        OrderId: 1,
        date: 1,
        created: 1
      }
    }
  ])

  // console.log(order)
  let totalamount = order.length != 0 ? order[0].price : 0;
  // console.log(totalamount)

  let orderspayments = await OrderPayment.aggregate([
    {
      $match: {
        $and: [{ orderId: { $eq: id } }]
      }
    },
    {
      $lookup: {
        from: 'creditbillgroups',
        localField: 'creditID',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from: 'creditbills',
              localField: '_id',
              foreignField: 'creditbillId',
              pipeline: [
                {
                  $match: {
                    $and: [{ orderId: { $eq: id } }]
                  }
                },
              ],
              as: 'creditbills',
            }
          },
          {
            $unwind: {
              path: '$creditbills',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'b2busers',
              localField: 'AssignedUserId',
              foreignField: '_id',
              as: 'b2busers',
            }
          },
          {
            $unwind: {
              path: '$b2busers',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              Schedulereason: "$creditbills.Schedulereason",
              reasonScheduleOrDate: "$creditbills.reasonScheduleOrDate",
              assignedDate: 1,
              assignedTime: 1,
              groupId: 1,
              _id: 1,
              receiveStatus: 1,
              assignedUserName: "$b2busers.name"
            }
          }
        ],
        as: 'creditbillgroups',
      }
    },
    {
      $unwind: {
        path: '$creditbillgroups',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        paidAmt: 1,
        date: 1,
        created: 1,
        payment: 1,
        paymentMethod: 1,
        paymentstutes: 1,
        type: 1,
        groupId: "$creditbillgroups.groupId",
        receiveStatus: "$creditbillgroups.receiveStatus",
        assignedDate: "$creditbillgroups.assignedDate",
        assignedTime: "$creditbillgroups.assignedTime",
        Schedulereason: "$creditbillgroups.Schedulereason",
        reasonScheduleOrDate: "$creditbillgroups.reasonScheduleOrDate",
        assignedUserName: "$creditbillgroups.assignedUserName",
      }
    },
    { $limit: 20 }
  ])

  let total = await OrderPayment.aggregate([
    {
      $match: {
        $and: [{ orderId: { $eq: id } }]
      }
    },
    {
      $lookup: {
        from: 'creditbillgroups',
        localField: 'creditID',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from: 'creditbills',
              localField: '_id',
              foreignField: 'creditbillId',
              pipeline: [
                {
                  $match: {
                    $and: [{ orderId: { $eq: id } }]
                  }
                },
              ],
              as: 'creditbills',
            }
          },
          {
            $unwind: {
              path: '$creditbills',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'b2busers',
              localField: 'AssignedUserId',
              foreignField: '_id',
              as: 'b2busers',
            }
          },
          {
            $unwind: {
              path: '$b2busers',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              Schedulereason: "$creditbills.Schedulereason",
              reasonScheduleOrDate: "$creditbills.reasonScheduleOrDate",
              assignedDate: 1,
              assignedTime: 1,
              groupId: 1,
              _id: 1,
              receiveStatus: 1,
              assignedUserName: "$b2busers.name"
            }
          }
        ],
        as: 'creditbillgroups',
      }
    },
    {
      $unwind: {
        path: '$creditbillgroups',
        preserveNullAndEmptyArrays: true,
      },
    },
  ])
  return { value: orderspayments, orderDetails: order,total:total.length };

}


module.exports = {
  getShopWithBill,
  getWardExecutiveName,
  getsalesmanName,
  getShopHistory,
  updateAssignedStatusPerBill,
  createGroup,
  payingCAshWithDEorSM,
  getManageCreditBillAssigning,
  getcreditBillDetailsByPassExecID,
  getHistoryByPassOrderId,
  getDElExecutiveName,
  getsalesName,
  getNotAssignData,
  getShopPendingByPassingShopId,
  getDeliDetails,
  getFineAccount,
  getDeliveryExecutiveName,
  getDetailsByPassGroupId,
  getGroupAndBill,
  submitDispute,
  getPaymentTypeCount,
  getdeliveryExcutive,
  submitfinish,
  getCreditBillMaster,
  groupCreditBill,
  getbilldetails
};
