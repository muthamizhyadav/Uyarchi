const httpStatus = require('http-status');
const callHistoryModel = require('../models/b2b.callHistory.model');
const ApiError = require('../utils/ApiError');
const { Shop } = require('../models/b2b.ShopClone.model');
const { Users } = require('../models/B2Busers.model');
const Role = require('../models/roles.model');
const moment = require('moment');

const createCallHistory = async (body) => {
  await Shop.findByIdAndUpdate({ _id: body.shopId }, { CallStatus: body.callStatus }, { new: true });
  let time = moment().format('HHmmss');
  let serverdate = moment().format('DD-MM-yyyy');
  let values = { ...body, ...{ sortTime: time, historydate: serverdate } };
  let callHistory = await callHistoryModel.create(values);
  return callHistory;
};

const createcallHistoryWithType = async (body, userId) => {
  let time = moment().format('HHmmss');
  let date = moment().format('yyy-MM-DD');
  let servertime = moment().format('hh:mm a');
  let serverdate = moment().format('DD-MM-yyyy');

  const { callStatus, shopId } = body;
  let sort;
  if (callStatus == 'reschedule') {
    sort = 2;
  }
  if (callStatus == 'callback') {
    sort = 3;
  }
  // if (callStatus == 'under_the_call') {
  //   sort = 4;
  // }
  if (callStatus == 'declined') {
    sort = 5;
  }
  if (callStatus == 'accept') {
    sort = 6;
  }
  console.log(callStatus);
  let values = { ...body, ...{ userId: userId, date: serverdate, time: servertime, historytime: time } };
  let shopdata = await Shop.findOne({ _id: shopId });
  let currentdate = moment().format('DD-MM-yyyy');
  if (callStatus != '') {
    if (shopdata.callingStatus != 'accept') {
      await Shop.findByIdAndUpdate(
        { _id: shopId },
        { callingStatus: callStatus, sortdate: date, sorttime: time, historydate: currentdate, callingStatusSort: sort },
        { new: true }
      );
      await Shop.findByIdAndUpdate({ _id: shopId }, { callingStatus: callStatus, historydate: currentdate });
    }
  }
  let callHistory = await callHistoryModel.create(values);
  return callHistory;
};

const getAll = async () => {
  return callHistoryModel.find();
};

const callingStatusreport = async () => {
  let serverdate = moment().format('DD-MM-yyyy');
  let acceptCount = await Shop.find({ callingStatus: 'accept', historydate: serverdate }).count();
  let callbackCount = await Shop.find({ callingStatus: 'callback', historydate: serverdate }).count();
  let rescheduleCount = await Shop.find({ callingStatus: 'reschedule', historydate: serverdate }).count();
  let pendingCount = await Shop.find({ callingStatus: 'Pending' }).count();
  let declinedCount = await Shop.find({ callingStatus: 'declined', historydate: serverdate }).count();
  return {
    acceptCount: acceptCount,
    callbackCount: callbackCount,
    rescheduleCount: rescheduleCount,
    pendingCount: pendingCount,
    declinedCount: declinedCount,
  };
};

const getById = async (id) => {
  console.log('params Id', id);
  let historys = await Shop.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },

    {
      $lookup: {
        from: 'callhistories', //add table
        localField: '_id', //callhistory
        foreignField: 'shopId', //shopclone
        as: 'callhistory',
      },
    },
    {
      $lookup: {
        from: 'b2busers', //add table
        localField: 'callingUserId', //callhistory
        foreignField: '_id', //shopclone
        as: 'usersData',
      },
    },
    {
      $unwind: '$usersData',
    },
    {
      $lookup: {
        from: 'shoplists',
        localField: 'SType',
        foreignField: '_id',
        as: 'shopType',
      },
    },
    {
      $unwind: '$shopType',
    },
    {
      $project: {
        SName: 1,
        SOwner: 1,
        mobile: 1,
        Slat: 1,
        address: 1,
        userName: '$usersData.name',
        Slong: 1,
        date: 1,
        time: 1,
        shopName: '$shopType.shopList',
        callhistory: '$callhistory',
      },
    },
  ]);
  return historys;
};

const getShop = async (date, status, page, userId, userRole) => {
  let match;
  if (status == 'null') {
    match = [{ active: { $eq: true } }];
  } else {
    match = [{ callingStatus: { $in: [status, 'On Call'] } }];
  }
  let values = await Shop.aggregate([
    {
      $match: {
        $and: match,
      },
    },
    { $sort: { callingStatusSort: 1, sortdate: -1, sorttime: -1 } },
    {
      $match: {
        callingStatus: { $nin: ['accept', 'declined'] },
      },
    },
    // {
    //   $match: {
    //     callingStatus: { $in: ['On Call'] },
    //   },
    // },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $match: {
              date: { $eq: date },
            },
          },
        ],
        as: 'shopData',
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopData.shopId',
        foreignField: '_id',
        // pipeline: [
        //   {
        //     $match: {
        //       $and: [{ callingStatus: { $ne: ['accept', 'declined'] } }],
        //     },
        //   },
        // ],
        as: 'shopclones',
      },
    },
    // {
    //   $unwind: '$shopclones',
    // },
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
        _id: 1,
        _id: 1,
        photoCapture: 1,
        callingStatus: 1,
        callingStatusSort: 1,
        active: 1,
        archive: 1,
        Wardid: 1,
        type: 1,
        SName: 1,
        SType: 1,
        SOwner: 1,
        mobile: 1,
        Slat: 1,
        Strid: 1,
        sortdatetime: 1,
        Slong: 1,
        address: 1,
        date: 1,
        time: 1,
        created: 1,
        status: 1,
        Uid: 1,
        shopData: 1,
        // shopclones: '$shopclones',
        shopData: '$shopData',
        shoptypeName: '$shoplists.shopList',
        // matching: { $and: { $eq: ['$callingUserId', userId], $eq: ['$callingStatus', 'On Call'] } },
        matching: { $and: [{ $eq: ['$callingUserId', userId] }, { $eq: ['$callingStatus', 'On Call'] }] },
        // callingUserId: 1,

        // shopclones: '$shopclones',
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  // let total = await Shop.aggregate([
  //   {
  //     $match: {
  //       $and: match,
  //     },
  //   },
  // {
  //   $match: {
  //     callingStatus: { $nin: ['accept', 'declined'] },
  //   },
  // },
  // {
  //   $lookup: {
  //     from: 'callhistories',
  //     localField: '_id',
  //     foreignField: 'shopId',
  //     pipeline: [
  //       {
  //         $match: {
  //           date: { $eq: date },
  //         },
  //       },
  //     ],
  //     as: 'shopData',
  //   },
  // },
  // {
  //   $lookup: {
  //     from: 'b2bshopclones',
  //     localField: 'shopData.shopId',
  //     foreignField: '_id',
  //     // pipeline: [
  //     //   {
  //     //     $match: {
  //     //       $and: [{ callingStatus: { $ne: ['accept', 'declined'] } }],
  //     //     },
  //     //   },
  //     // ],
  //     as: 'shopclones',
  //   },
  // },
  // // {
  // //   $unwind: '$shopclones',
  // // },
  // {
  //   $lookup: {
  //     from: 'shoplists',
  //     localField: 'SType',
  //     foreignField: '_id',
  //     as: 'shoplists',
  //   },
  // },
  // {
  //   $unwind: '$shoplists',
  // },
  // ]);
  let total;
  if (status == 'null') {
    total = await Shop.find().count();
  }
  if (status != 'null') {
    total = await Shop.find({ callingStatus: status }).count();
  }
  console.log(total);
  let role = await Role.findOne({ _id: userRole });
  let user = await Users.findOne({ _id: userId });
  return { values: values, total: total, RoleName: role.roleName, userName: user.name };
};

const updateCallingStatus = async (id, updatebody) => {
  let shops = await Shop.findById(id);
  if (!shops) {
    throw new ApiError(httpStatus.NOT_FOUND, 'shop not found');
  }
  shops = await Shop.findByIdAndUpdate({ _id: id }, updatebody, { new: true });
  return shops;
};

const updateStatuscall = async (id, userId, updateBody) => {
  let status = await Shop.findById(id);
  if (!status) {
    throw new ApiError(httpStatus.NOT_FOUND, 'status not found');
  }
  if (status.callingStatus == 'On Call') {
    throw new ApiError(httpStatus.NOT_FOUND, 'OnCall');
  }
  status = await Shop.findByIdAndUpdate({ _id: id }, { callingStatus: 'On Call', callingUserId: userId }, { new: true });
  return status;
};

const updateOrderStatus = async (id) => {
  let orderedStatus = await callHistoryModel.findById(id);
  if (!orderedStatus) {
    throw new ApiError(httpStatus.NOT_FOUND, 'OrderStatus not found');
  }
  orderedStatus = await callHistoryModel.findByIdAndUpdate({ _id: id }, { status: 'ordered' }, { new: true });
};

const createShopByOwner = async (body) => {
  let values = await Shop.create(body);
  return values;
};

const getOncallfromshops = async (userId) => {
  let values = await Shop.find({ callingUserId: userId, callingStatus: 'On Call' });
  console.log(values);
  if (values.length != 0) {
    return { OnCallstatus: false };
  } else {
    return { OnCallstatus: true };
  }
};

const updateStatuscallVisit = async (id, userId, updateBody) => {
  let status = await Shop.findById(id);
  if (!status) {
    throw new ApiError(httpStatus.NOT_FOUND, 'shop not found');
  }
  if (status.callingStatus == 'visit') {
    throw new ApiError(httpStatus.NOT_FOUND, 'Already visit');
  }
  status = await Shop.findByIdAndUpdate(
    { _id: id },
    { callingStatus: 'visit', callingUserId: userId, callingStatusSort: 7 },
    { new: true }
  );
  return status;
};

const checkvisitOncallStatus = async (id) => {
  let values = await Shop.findById(id);
  if (values.callingStatus == 'On Call') {
    return { visit: false };
  }
  if (values.callingStatus == 'visit') {
    return { visit: true };
  }
  return values;
};

const getcallHistorylastFivedays = async (id) => {
  let shops = await Shop.findById(id);
  // let values = await callHistoryModel.find({ shopId: id }).sort({ sortTime: -1 }).limit(10);
  let values = await callHistoryModel.aggregate([
    {
      $match: {
        $and: [{ shopId: { $eq: id } }],
      },
    },
    {
      $sort: { sortTime: -1 },
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
        from: 'b2busers',
        localField: 'userId',
        foreignField: '_id',
        as: 'data',
      },
    },
    {
      $unwind: '$data',
    },

    {
      $limit: 10,
    },
    {
      $project: {
        _id: 1,
        active: 1,
        archive: 1,
        status: 1,
        noOfCalls: 1,
        shopId: 1,
        selectStatus: 1,
        date: 1,
        time: 1,
        historytime: 1,
        reason:1,
        userName: '$data.name',
        userContact: '$data.phoneNumber',
        shopName: '$shops.SName',
        callingStatus: '$shops.callingStatus',
      },
    },
  ]);
  return { values: values, shops: shops.SName };
};

const getshopsOrderWise = async (status) => {
  let serverdate = moment().format('DD-MM-yyyy');
  let pending = await Shop.find({ callingStatus: 'Pending' });
  let accept = await Shop.find({ callingStatus: 'accept' });
  let reschedule = await Shop.find({ callingStatus: 'reshedule' });
  let callback = await Shop.find({ callingStatus: 'callback' });
  let declined = await Shop.find({ callingStatus: 'declined' });
  let oncall = await Shop.find({ callingStatus: 'On Call' });
  let visit = await Shop.find({ callingStatus: 'visit' });

  if (status == 'Pending') {
    return pending;
  }
  if (status == 'accept') {
    return accept;
  }
  if (status == 'reshedule') {
    return reschedule;
  }
  if (status == 'callback') {
    return callback;
  }
  if (status == 'declined') {
    return declined;
  }
  if (status == 'On Call') {
    return oncall;
  }
  if (status == 'visit') {
    return visit;
  }
};

const getacceptDeclined = async (status, date, page, userId, userRole) => {
  let match;
  if (status == 'null') {
    match = [{ active: { $eq: true } }];
  } else {
    match = [{ callingStatus: { $in: [status, 'On Call'] } }];
  }
  let values = await Shop.aggregate([
    // { $sort: { callingStatusSort: 1, sortdate: -1, sorttime: -1 } },
    {
      $match: {
        $and: match,
      },
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $match: {
              date: { $eq: date },
            },
          },
        ],
        as: 'shopData',
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopData.shopId',
        foreignField: '_id',
        // pipeline: [
        //   {
        //     $match: {
        //       $and: [{ callingStatus: { $ne: ['accept', 'declined'] } }],
        //     },
        //   },
        // ],
        as: 'shopclones',
      },
    },
    // {
    //   $unwind: '$shopclones',
    // },
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
        _id: 1,
        _id: 1,
        photoCapture: 1,
        callingStatus: 1,
        callingStatusSort: 1,
        active: 1,
        archive: 1,
        Wardid: 1,
        type: 1,
        SName: 1,
        SType: 1,
        SOwner: 1,
        mobile: 1,
        Slat: 1,
        Strid: 1,
        sortdatetime: 1,
        Slong: 1,
        address: 1,
        date: 1,
        time: 1,
        created: 1,
        status: 1,
        Uid: 1,
        shopData: 1,
        // shopclones: '$shopclones',
        shopData: '$shopData',
        shoptypeName: '$shoplists.shopList',
        // matching: { $and: { $eq: ['$callingUserId', userId], $eq: ['$callingStatus', 'On Call'] } },
        matching: { $and: [{ $eq: ['$callingUserId', userId] }, { $eq: ['$callingStatus', 'On Call'] }] },
        // callingUserId: 1,

        // shopclones: '$shopclones',
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  let total = await Shop.aggregate([
    {
      $match: {
        $and: match,
      },
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $match: {
              date: { $eq: date },
            },
          },
        ],
        as: 'shopData',
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopData.shopId',
        foreignField: '_id',
        // pipeline: [
        //   {
        //     $match: {
        //       $and: [{ callingStatus: { $ne: ['accept', 'declined'] } }],
        //     },
        //   },
        // ],
        as: 'shopclones',
      },
    },
    // {
    //   $unwind: '$shopclones',
    // },
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
  ]);
  let role = await Role.findOne({ _id: userRole });
  let user = await Users.findOne({ _id: userId });
  return { values: values, total: total.length, RoleName: role.roleName, userName: user.name };
};

const resethistory = async () => {
  let currentDate = moment().format('DD-MM-yyyy');
  let today = '';
  today = currentDate;
  await Shop.updateMany({ historydate: { $ne: today } }, { $set: { callingStatus: 'Pending', callingStatusSort: 0 } });
  return { dayfresh: true };
};

module.exports = {
  createCallHistory,
  getAll,
  getShop,
  updateCallingStatus,
  getById,
  updateStatuscall,
  createShopByOwner,
  createcallHistoryWithType,
  callingStatusreport,
  updateOrderStatus,
  getOncallfromshops,
  checkvisitOncallStatus,
  updateStatuscallVisit,
  getshopsOrderWise,
  getcallHistorylastFivedays,
  getacceptDeclined,
  resethistory,
};
