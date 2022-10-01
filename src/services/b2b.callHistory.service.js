const httpStatus = require('http-status');
const callHistoryModel = require('../models/b2b.callHistory.model');
const ApiError = require('../utils/ApiError');
const { Shop } = require('../models/b2b.ShopClone.model');
const { Users } = require('../models/B2Busers.model');
const Role = require('../models/roles.model');
const moment = require('moment');
const { ShopOrder, ProductorderSchema, ShopOrderClone, ProductorderClone } = require('../models/shopOrder.model');

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
  let date = moment().format('yyyy-MM-DD');
  let servertime = moment().format('hh:mm a');
  let serverdate = moment().format('yyyy-MM-DD');

  const { callStatus, shopId, reason, type, lat, lang, lapsed } = body;
  let sort;
  if (callStatus == 'reschedule') {
    sort = 2;
  }
  if (callStatus == 'callback') {
    sort = 3;
  }
  if (callStatus == 'declined') {
    sort = 5;
  }
  if (callStatus == 'accept') {
    sort = 6;
  }

  let values = {
    ...body,
    ...{ userId: userId, date: serverdate, time: servertime, historytime: time, type: type, lat: lat, lang: lang },
  };
  let shopdata = await Shop.findOne({ _id: shopId });
  let currentdate = moment().format('DD-MM-yyyy');
  await Shop.findByIdAndUpdate(
    { _id: shopId },
    {
      sorttime: time,
      callingStatusSort: sort,
      lapsed: lapsed,
    },
    { new: true }
  );
  if (callStatus == 'reschedule') {
    // let dateSlice = reason.slice(0, 10);
    await Shop.findByIdAndUpdate(
      { _id: shopId },
      {
        sortdate: reason,
        callingStatus: callStatus,
        lapsed: lapsed,
      },
      { new: true }
    );
  } else {
    if (callStatus != 'accept') {
      await Shop.findByIdAndUpdate({ _id: shopId }, { callingStatus: callStatus, lapsed: lapsed }, { new: true });
    }
  }
  let callHistory = await callHistoryModel.create(values);
  return callHistory;
};

const createcallHistoryWithTypelapsed = async (body, userId) => {
  let time = moment().format('HHmmss');
  let date = moment().format('yyyy-MM-DD');
  let servertime = moment().format('hh:mm a');
  let serverdate = moment().format('yyyy-MM-DD');

  const { callStatus, shopId, reason, type, lat, lang, orderId } = body;
  let sort;
  if (callStatus == 'reschedule') {
    sort = 2;
  }
  if (callStatus == 'callback') {
    sort = 3;
  }
  if (callStatus == 'declined') {
    sort = 5;
  }
  if (callStatus == 'accept') {
    sort = 6;
  }

  let values = {
    ...body,
    ...{
      userId: userId,
      date: serverdate,
      time: servertime,
      historytime: time,
      type: type,
      lat: lat,
      lang: lang,
      orderId: orderId,
    },
  };
  let shopdata = await Shop.findOne({ _id: shopId });
  let currentdate = moment().format('DD-MM-yyyy');
  await Shop.findByIdAndUpdate(
    { _id: shopId },
    {
      sorttime: time,
      callingStatusSort: sort,
    },
    { new: true }
  );
  if (callStatus == 'reschedule') {
    // let dateSlice = reason.slice(0, 10);
    await Shop.findByIdAndUpdate(
      { _id: shopId },
      {
        sortdate: reason,
        callingStatus: callStatus,
      },
      { new: true }
    );
  } else {
    if (callStatus != 'accept') {
      await Shop.findByIdAndUpdate({ _id: shopId }, { callingStatus: callStatus }, { new: true });
    }
  }
  let callHistory = await callHistoryModel.create(values);
  await ShopOrderClone.findByIdAndUpdate({ _id: orderId }, { callhistoryId: callHistory._id, callstatus: callStatus });
  return callHistory;
};

const getAll = async () => {
  return callHistoryModel.find();
};

const callingStatusreport = async (date) => {
  let yesterday = moment(date, 'DD-MM-YYYY').add(-1, 'days').format('DD-MM-yyyy');
  console.log(yesterday);
  let serverdate = date;
  let acceptCount = await Shop.find({ callingStatus: 'accept', historydate: serverdate, lapsed: { $ne: true } }).count();
  let callbackCount = await Shop.find({ callingStatus: 'callback', historydate: serverdate, lapsed: { $ne: true } }).count();
  let rescheduleCount = await Shop.aggregate([
    {
      $match: {
        $and: [
          { sortdate: { $gte: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD') } },
          { historydate: { $eq: date } },
          { callingStatus: { $eq: 'reschedule' } },
          { lapsed: { $ne: true } },
        ],
      },
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $sort: { date: -1, historytime: -1 },
          },
          { $limit: 10 },
        ],
        as: 'callhistories',
      },
    },
    {
      $group: {
        _id: null,
        count: {
          $sum: 1,
        },
      },
    },
  ]);
  let pendingCount = await Shop.aggregate([
    {
      $match: {
        $and: [{ historydate: { $ne: date } }],
      },
    },
    { $sort: { historydate: -1, sorttime: -1 } },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $sort: { date: -1, historytime: -1 },
          },
          { $limit: 10 },
        ],
        as: 'callhistories',
      },
    },
    {
      $lookup: {
        from: 'shoplists',
        localField: 'SType',
        foreignField: '_id',
        as: 'shoplists',
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: '_id',
        foreignField: '_id',
        pipeline: [
          {
            $match: {
              callingStatus: 'reschedule',
              sortdate: { $gte: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD') },
            },
          },
          { $group: { _id: null } },
        ],
        as: 'b2bshopclones',
      },
    },
    {
      $unwind: {
        path: '$b2bshopclones',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
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
        shopData: '$callhistories',
        shoptypeName: '$shoplists',
        match: { $ne: ['$b2bshopclones._id', null] },
      },
    },
    {
      $match: { match: true },
    },
    {
      $group: {
        _id: null,
        count: {
          $sum: 1,
        },
      },
    },
  ]);
  let oncall = await Shop.find({ callingStatus: 'On Call' }).count();
  let oldReschedule = await Shop.find({
    callingStatus: 'reschedule',
    historydate: { $ne: date },
    lapsed: { $ne: true },
    sortdate: { $gte: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD') },
  }).count();
  // let Reschedule = await Shop.find({ callingStatus: 'reschedule', historydate: date }).count();
  let declinedCount = await Shop.find({ callingStatus: 'declined', historydate: serverdate, lapsed: { $ne: true } }).count();
  return {
    acceptCount: acceptCount,
    callbackCount: callbackCount,
    rescheduleCount: rescheduleCount.length != 0 ? rescheduleCount[0].count : 0,
    pendingCount: pendingCount.length != 0 ? pendingCount[0].count : 0,
    declinedCount: declinedCount,
    Oncall: oncall,
    oldReschedule: oldReschedule,
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

// const getShop = async (date, status, key, page, userId, userRole) => {
//   let match;
//   ``;
//   if (status == 'null') {
//     match = [{ active: { $eq: true } }];
//   } else {
//     match = [{ callingStatus: { $in: [status] } }];
//   }
//   let keys = { active: { $eq: true } };
//   if (key != 'null') {
//     keys = { SName: { $regex: key, $options: 'i' } };
//   }
//   let values = await Shop.aggregate([
//     {
//       $match: {
//         $and: [keys],
//       },
//     },
//     {
//       $match: {
//         $and: match,
//       },
//     },
//     { $sort: { historydate: -1, sorttime: -1 } },
//     {
//       $match: {
//         callingStatus: { $nin: ['accept', 'declined'] },
//       },
//     },
//     {
//       $lookup: {
//         from: 'callhistories',
//         localField: '_id',
//         foreignField: 'shopId',
//         pipeline: [
//           {
//             $match: {
//               date: { $eq: date },
//             },
//           },
//         ],
//         as: 'shopData',
//       },
//     },
//     {
//       $lookup: {
//         from: 'b2bshopclones',
//         localField: 'shopData.shopId',
//         foreignField: '_id',
//         as: 'shopclones',
//       },
//     },
//     {
//       $lookup: {
//         from: 'shoplists',
//         localField: 'SType',
//         foreignField: '_id',
//         as: 'shoplists',
//       },
//     },
//     {
//       $unwind: '$shoplists',
//     },
//     {
//       $project: {
//         _id: 1,
//         _id: 1,
//         photoCapture: 1,
//         callingStatus: 1,
//         callingStatusSort: 1,
//         active: 1,
//         archive: 1,
//         Wardid: 1,
//         type: 1,
//         SName: 1,
//         SType: 1,
//         SOwner: 1,
//         mobile: 1,
//         Slat: 1,
//         Strid: 1,
//         sortdatetime: 1,
//         Slong: 1,
//         address: 1,
//         date: 1,
//         time: 1,
//         created: 1,
//         status: 1,
//         Uid: 1,
//         shopData: 1,
//         shopData: '$shopData',
//         shoptypeName: '$shoplists.shopList',
//         matching: { $and: [{ $eq: ['$callingUserId', userId] }, { $eq: ['$callingStatus', 'On Call'] }] },
//       },
//     },
//     { $skip: 10 * page },
//     { $limit: 10 },
//   ]);
//   let total = await Shop.aggregate([
//     {
//       $match: {
//         $and: [keys],
//       },
//     },
//     {
//       $match: {
//         $and: match,
//       },
//     },
//     { $sort: { historydate: -1, sorttime: -1 } },
//     {
//       $match: {
//         callingStatus: { $nin: ['accept', 'declined'] },
//       },
//     },
//     {
//       $lookup: {
//         from: 'callhistories',
//         localField: '_id',
//         foreignField: 'shopId',
//         pipeline: [
//           {
//             $match: {
//               date: { $eq: date },
//             },
//           },
//         ],
//         as: 'shopData',
//       },
//     },
//     {
//       $lookup: {
//         from: 'b2bshopclones',
//         localField: 'shopData.shopId',
//         foreignField: '_id',
//         as: 'shopclones',
//       },
//     },
//     {
//       $lookup: {
//         from: 'shoplists',
//         localField: 'SType',
//         foreignField: '_id',
//         as: 'shoplists',
//       },
//     },
//     {
//       $unwind: '$shoplists',
//     },
//   ]);
//   let role = await Role.findOne({ _id: userRole });
//   let user = await Users.findOne({ _id: userId });
//   return { values: values, total: total.length, RoleName: role.roleName, userName: user.name };
// };

const getShop_pending = async (date, status, key, page, userId, userRole) => {
  let keys = { active: { $eq: true } };
  if (key != 'null') {
    keys = { $or: [{ SName: { $regex: key, $options: 'i' } }, { mobile: { $regex: key, $options: 'i' } }] };
  }
  let values;
  values = await Shop.aggregate([
    {
      $match: {
        $and: [{ historydate: { $ne: date } }, { lapsed: { $ne: true } }, keys],
      },
    },
    { $sort: { historydate: -1, sorttime: -1 } },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $sort: { date: -1, historytime: -1 },
          },
          { $limit: 10 },
        ],
        as: 'callhistories',
      },
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $match: { date: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD') },
          },
          {
            $group: {
              _id: null,
              count: {
                $sum: 1,
              },
            },
          },
        ],
        as: 'callhistoriestoday',
      },
    },
    {
      $unwind: {
        path: '$callhistoriestoday',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'shoplists',
        localField: 'SType',
        foreignField: '_id',
        as: 'shoplists',
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: '_id',
        foreignField: '_id',
        pipeline: [
          {
            $match: {
              callingStatus: 'reschedule',
              sortdate: { $gte: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD') },
            },
          },
          { $group: { _id: null } },
        ],
        as: 'b2bshopclones',
      },
    },
    {
      $unwind: {
        path: '$b2bshopclones',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
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
        historydate: 1,
        created: 1,
        status: 1,
        Uid: 1,
        shopData: 1,
        lapsed: 1,
        callhistoriestoday: '0',
        shopData: '$callhistories',
        shoptypeName: '$shoplists',
        match: { $ne: ['$b2bshopclones._id', null] },
        matching: { $and: [{ $eq: ['$callingUserId', userId] }, { $eq: ['$callingStatus', 'On Call'] }] },
      },
    },
    {
      $match: { match: true },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await Shop.aggregate([
    {
      $match: {
        $and: [{ historydate: { $ne: date } }, { lapsed: { $ne: true } }, keys],
      },
    },
    { $sort: { historydate: -1, sorttime: -1 } },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $sort: { date: -1, historytime: -1 },
          },
          { $limit: 10 },
        ],
        as: 'callhistories',
      },
    },
    {
      $lookup: {
        from: 'shoplists',
        localField: 'SType',
        foreignField: '_id',
        as: 'shoplists',
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: '_id',
        foreignField: '_id',
        pipeline: [
          {
            $match: {
              callingStatus: 'reschedule',
              sortdate: { $gte: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD') },
            },
          },
          { $group: { _id: null } },
        ],
        as: 'b2bshopclones',
      },
    },
    {
      $unwind: {
        path: '$b2bshopclones',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
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
        historydate: 1,
        time: 1,
        created: 1,
        status: 1,
        Uid: 1,
        shopData: 1,
        shopData: '$callhistories',
        shoptypeName: '$shoplists',
        match: { $ne: ['$b2bshopclones._id', null] },
      },
    },
    {
      $match: { match: true },
    },
    // {
    //   $group: {
    //     _id: null,
    //     count: {
    //       $sum: 1,
    //     },
    //   },
    // },
    {
      $count: 'passing_scores',
    },
  ]);
  console.log(total);
  let role = await Role.findOne({ _id: userRole });
  let user = await Users.findOne({ _id: userId });
  return {
    values: values,
    total: total.length != 0 ? total[0].passing_scores : 0,
    RoleName: role.roleName,
    userName: user.name,
  };
};
const getShop_oncall = async (date, status, key, page, userId, userRole) => {
  console.log(status);
  let keys = { active: { $eq: true } };
  if (key != 'null') {
    keys = { $or: [{ SName: { $regex: key, $options: 'i' } }, { mobile: { $regex: key, $options: 'i' } }] };
  }

  let values;
  values = await Shop.aggregate([
    {
      $match: {
        $and: [keys, { callingStatus: { $eq: status } }],
      },
    },

    { $sort: { historydate: -1, sorttime: -1 } },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $sort: { date: -1, historytime: -1 },
          },
          { $limit: 10 },
        ],
        as: 'callhistories',
      },
    },
    {
      $lookup: {
        from: 'shoplists',
        localField: 'SType',
        foreignField: '_id',
        as: 'shoplists',
      },
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $match: { date: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD') },
          },
          {
            $group: {
              _id: null,
              count: {
                $sum: 1,
              },
            },
          },
        ],
        as: 'callhistoriestoday',
      },
    },
    {
      $unwind: {
        path: '$callhistoriestoday',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        photoCapture: 1,
        callingStatus: 1,
        callingStatusSort: 1,
        active: 1,
        archive: 1,
        Wardid: 1,
        type: 1,
        SName: 1,
        historydate: 1,
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
        lapsed: 1,
        Uid: 1,
        shopData: 1,
        shopData: '$callhistories',
        callhistoriestoday: '$callhistoriestoday.count',
        shoptypeName: '$shoplists',
        matching: { $and: [{ $eq: ['$callingUserId', userId] }, { $eq: ['$callingStatus', 'On Call'] }] },
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await Shop.aggregate([
    {
      $match: {
        $and: [keys, { callingStatus: { $eq: status } }],
      },
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $sort: { date: -1, historytime: -1 },
          },
          { $limit: 10 },
        ],
        as: 'callhistories',
      },
    },
    {
      $count: 'passing_scores',
    },
  ]);

  let role = await Role.findOne({ _id: userRole });
  let user = await Users.findOne({ _id: userId });
  return {
    values: values,
    total: total.length != 0 ? total[0].passing_scores : 0,
    RoleName: role.roleName,
    userName: user.name,
  };
};

const getShop_callback = async (date, status, key, page, userId, userRole) => {
  let keys = { active: { $eq: true } };
  if (key != 'null') {
    keys = { $or: [{ SName: { $regex: key, $options: 'i' } }, { mobile: { $regex: key, $options: 'i' } }] };
  }

  let values;
  values = await Shop.aggregate([
    {
      $match: {
        $and: [{ historydate: { $eq: date } }, keys, { callingStatus: { $eq: status } }, { lapsed: { $ne: true } }],
      },
    },
    { $sort: { historydate: -1, sorttime: -1 } },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $sort: { date: -1, historytime: -1 },
          },
          { $limit: 10 },
        ],
        as: 'callhistories',
      },
    },
    {
      $lookup: {
        from: 'shoplists',
        localField: 'SType',
        foreignField: '_id',
        as: 'shoplists',
      },
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $match: { date: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD') },
          },
          {
            $group: {
              _id: null,
              count: {
                $sum: 1,
              },
            },
          },
        ],
        as: 'callhistoriestoday',
      },
    },
    {
      $unwind: {
        path: '$callhistoriestoday',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
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
        historydate: 1,
        date: 1,
        time: 1,
        created: 1,
        status: 1,
        Uid: 1,
        shopData: 1,
        lapsed: 1,
        shopData: '$callhistories',
        callhistoriestoday: '$callhistoriestoday.count',
        shoptypeName: '$shoplists',
        matching: { $and: [{ $eq: ['$callingUserId', userId] }, { $eq: ['$callingStatus', 'On Call'] }] },
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await Shop.aggregate([
    {
      $match: {
        $and: [{ historydate: { $eq: date } }, { callingStatus: { $eq: status } }, { lapsed: { $ne: true } }],
      },
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $sort: { date: -1, historytime: -1 },
          },
          { $limit: 10 },
        ],
        as: 'callhistories',
      },
    },
    {
      $count: 'passing_scores',
    },
  ]);
  console.log(total);
  let role = await Role.findOne({ _id: userRole });
  let user = await Users.findOne({ _id: userId });
  return {
    values: values,
    total: total.length != 0 ? total[0].passing_scores : 0,
    RoleName: role.roleName,
    userName: user.name,
  };
};

const getShop_reshedule = async (date, status, key, page, userId, userRole) => {
  let keys = { active: { $eq: true } };
  if (key != 'null') {
    keys = { SName: { $regex: key, $options: 'i' } };
  }

  let values;
  values = await Shop.aggregate([
    {
      $match: {
        $and: [
          { sortdate: { $gte: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD') } },
          keys,
          { callingStatus: { $eq: status } },
        ],
      },
    },
    { $sort: { historydate: -1, sorttime: -1 } },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $sort: { date: -1, historytime: -1 },
          },
          { $limit: 10 },
        ],
        as: 'callhistories',
      },
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $match: { date: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD') },
          },
          {
            $group: {
              _id: null,
              count: {
                $sum: 1,
              },
            },
          },
        ],
        as: 'callhistoriestoday',
      },
    },
    {
      $unwind: {
        path: '$callhistoriestoday',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'shoplists',
        localField: 'SType',
        foreignField: '_id',
        as: 'shoplists',
      },
    },
    {
      $project: {
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
        historydate: 1,
        time: 1,
        created: 1,
        status: 1,
        Uid: 1,
        shopData: 1,
        lapsed: 1,
        shopData: '$callhistories',
        callhistoriestoday: '$callhistoriestoday.count',
        shoptypeName: '$shoplists',
        matching: { $and: [{ $eq: ['$callingUserId', userId] }, { $eq: ['$callingStatus', 'On Call'] }] },
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await Shop.aggregate([
    {
      $match: {
        $and: [
          { sortdate: { $gte: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD') } },
          keys,
          { lapsed: { $ne: true } },
          { callingStatus: { $eq: status } },
        ],
      },
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $sort: { date: -1, historytime: -1 },
          },
          { $limit: 10 },
        ],
        as: 'callhistories',
      },
    },
    {
      $count: 'passing_scores',
    },
  ]);

  let role = await Role.findOne({ _id: userRole });
  let user = await Users.findOne({ _id: userId });
  return {
    values: values,
    total: total.length != 0 ? total[0].passing_scores : 0,
    RoleName: role.roleName,
    userName: user.name,
  };
};

const updateCallingStatus = async (id, updatebody) => {
  let shops = await Shop.findById(id);
  if (!shops) {
    throw new ApiError(httpStatus.NOT_FOUND, 'shop not found');
  }
  shops = await Shop.findByIdAndUpdate({ _id: id }, updatebody, { new: true });
  return shops;
};

const updateStatuscall = async (id, body, userId, date) => {
  let status = await Shop.findById(id);
  if (!status) {
    throw new ApiError(httpStatus.NOT_FOUND, 'status not found');
  }
  if (status.callingStatus == 'On Call') {
    throw new ApiError(httpStatus.NOT_FOUND, 'OnCall');
  }
  let { lapsed } = body;
  status = await Shop.findByIdAndUpdate(
    { _id: id },
    { callingStatus: 'On Call', lapsed: lapsed, callingUserId: userId, historydate: date, sortdate: '' },
    { new: true }
  );
  return status;
};
const updateStatuscalllapsed = async (id, orderId, body, userId, date) => {
  let status = await Shop.findById(id);
  if (!status) {
    throw new ApiError(httpStatus.NOT_FOUND, 'status not found');
  }
  if (status.callingStatus == 'On Call') {
    throw new ApiError(httpStatus.NOT_FOUND, 'OnCall');
  }
  let { lapsed } = body;
  status = await Shop.findByIdAndUpdate(
    { _id: id },
    { callingStatus: 'On Call', lapsed: lapsed, callingUserId: userId, historydate: date, sortdate: '' },
    { new: true }
  );
  await ShopOrderClone.findByIdAndUpdate({ _id: orderId }, { callstatus: 'On Call' });
  return status;
};

const updateStatusLapsed = async (id, body, userId, date) => {
  let status = await Shop.findById(id);
  if (!status) {
    throw new ApiError(httpStatus.NOT_FOUND, 'status not found');
  }
  if (status.callingStatus == 'On Call') {
    throw new ApiError(httpStatus.NOT_FOUND, 'OnCall');
  }
  let { lapsed } = body;
  status = await Shop.findByIdAndUpdate(
    { _id: id },
    { callingStatus: 'On Lapsed', callingUserId: userId, historydate: date, sortdate: '' },
    { new: true }
  );
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
  let values = await callHistoryModel.aggregate([
    {
      $match: {
        $and: [{ shopId: { $eq: id } }],
      },
    },
    {
      $sort: { date: -1, historytime: -1 },
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
        reason: 1,
        callStatus: 1,
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

const getacceptDeclined = async (status, date, key, page, userId, userRole) => {
  let match;
  if (status == 'null') {
    match = [{ active: { $eq: true } }];
  } else {
    match = [{ callingStatus: { $in: [status] } }];
  }
  let keys = { active: { $eq: true } };
  if (key != 'null') {
    keys = { SName: { $regex: key, $options: 'i' } };
  }
  let values = await Shop.aggregate([
    {
      $match: {
        $and: [keys],
      },
    },
    {
      $match: {
        $and: match,
      },
    },
    { $sort: { historydate: -1, sorttime: -1 } },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          { $sort: { historytime: -1 } },
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
        as: 'shopclones',
      },
    },
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
        historydate: 1,
        Slong: 1,
        address: 1,
        date: 1,
        sorttime: 1,
        time: 1,
        created: 1,
        status: 1,
        Uid: 1,
        shopData: 1,
        filterDate: 1,
        sortdate: 1,
        shopData: '$shopData',
        shoptypeName: '$shoplists.shopList',
        matching: { $and: [{ $eq: ['$callingUserId', userId] }, { $eq: ['$callingStatus', 'On Call'] }] },
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  let total = await Shop.aggregate([
    {
      $match: {
        $and: [keys],
      },
    },
    {
      $match: {
        $and: match,
      },
    },
    { $sort: { historydate: -1, sorttime: -1 } },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          { $sort: { historytime: -1 } },
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
        as: 'shopclones',
      },
    },
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
  let yersterday = moment().subtract(1, 'days').format('DD-MM-yyyy');
  console.log(yersterday);
  let today = '';
  today = currentDate;
  await Shop.updateMany(
    { sortdate: { $eq: yersterday } },
    { $set: { callingStatus: 'Pending', callingStatusSort: 0, sortdate: today } }
  );
  return { dayfresh: 'Reset Successfully' };
};

const previouscallBackAnd_Reshedule = async () => {
  let currentDate = moment().format('DD-MM-yyyy');
  let callback = await Shop.find({ callingStatus: 'callback', date: { $ne: currentDate } });
  let reschedule = await Shop.find({ callingStatus: 'reshedule', date: { $ne: currentDate } });
  return { callback: callback, reschedule: reschedule };
};

const getOncallShops = async () => {
  let oncall = await Shop.find({ callingStatus: 'On Call' });
  return oncall;
};

const oncallstatusByUser = async (userId) => {
  let oncall = await Shop.find({ callingStatus: 'On Call', callingUserId: userId });
  if (oncall.length == 0) {
    return { status: true };
  } else {
    return { status: false };
  }
};

const call_visit_Count = async (userId) => {
  let currentDate = moment().format('YYYY-MM-DD');
  let visit_Count = await callHistoryModel
    .find({ userId: userId, date: currentDate, type: 'call', status: 'ordered' })
    .count();
  let call_Count = await callHistoryModel
    .find({ userId: userId, date: currentDate, type: 'visit', status: 'ordered' })
    .count();
  return { visitCount: call_Count, callCount: visit_Count };
};

const BillHistoryByShopId_date = async (shopId, date) => {
  let values = await callHistoryModel.find({ shopId: shopId }).sort({ date: -1, historytime: -1 }).limit(10);
  return values;
};
const getShop_lapsed = async (date, status, key, page, userId, userRole, faildstatus) => {
  let today = moment().format('yyyy-MM-DD');
  let yesterday = moment().subtract(1, 'days').format('yyyy-MM-DD');
  let threeDay = moment().subtract(2, 'days').format('yyyy-MM-DD');
  let faildstatusMatch;
  let timelapsed;
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

  if (faildstatus == 'null') {
    faildstatusMatch = {
      $or: [
        {
          status: {
            $in: [
              'Acknowledged',
              'Approved',
              'Modified',
              'Packed',
              'Assigned',
              'Order Picked',
              'Delivery start',
              'UnDelivered',
              'ordered',
            ],
          },
          date: { $lte: threeDay },
        },
        {
          status: {
            $in: [
              'Acknowledged',
              'Approved',
              'Modified',
              'Packed',
              'Assigned',
              'Order Picked',
              'Delivery start',
              'UnDelivered',
              'ordered',
            ],
          },
          date: { $eq: yesterday },
          delivery_type: 'IMD',
        },
        {
          timeslot: { $gte: lapsed },
          status: {
            $in: ['ordered', 'Acknowledged'],
          },
        },
      ],
    };
  } else if (faildstatus == 'time') {
    faildstatusMatch = {
      $or: [
        {
          timeslot: { $lte: lapsed },
          status: {
            $in: ['ordered', 'Acknowledged'],
          },
          delivery_type: 'IMD',
          date: today,
        },
        {
          timeslot: { $lte: lapsed },
          status: {
            $in: ['ordered', 'Acknowledged'],
          },
          delivery_type: 'NDD',
          date: yesterday,
        },
      ],
    };
  } else if (faildstatus == 'ordered' || faildstatus == 'Acknowledged') {
    faildstatusMatch = {
      $or: [
        {
          status: {
            $eq: faildstatus,
          },
          date: { $lte: threeDay },
        },
        {
          status: {
            $eq: faildstatus,
          },
          date: { $eq: yesterday },
          delivery_type: 'IMD',
        },
        {
          timeslot: { $gte: lapsed },
          status: {
            $eq: faildstatus,
          },
        },
      ],
    };
  } else {
    faildstatusMatch = {
      $or: [
        {
          status: {
            $eq: faildstatus,
          },
          date: { $lte: threeDay },
        },
        {
          status: {
            $eq: faildstatus,
          },
          date: { $eq: yesterday },
          delivery_type: 'IMD',
        },
      ],
    };
  }
  let keys = { active: { $eq: true } };
  if (key != 'null') {
    keys = { $or: [{ SName: { $regex: key, $options: 'i' } }, { mobile: { $regex: key, $options: 'i' } }] };
  }

  let values;
  values = await Shop.aggregate([
    {
      $match: {
        $and: [{ historydate: { $eq: date } }, keys, { lapsed: { $ne: true } }],
      },
    },
    { $sort: { historydate: -1, sorttime: -1 } },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $sort: { date: -1, historytime: -1 },
          },
          { $limit: 10 },
        ],
        as: 'callhistories',
      },
    },
    {
      $lookup: {
        from: 'shoplists',
        localField: 'SType',
        foreignField: '_id',
        as: 'shoplists',
      },
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $match: { date: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD') },
          },
          {
            $group: {
              _id: null,
              count: {
                $sum: 1,
              },
            },
          },
        ],
        as: 'callhistoriestoday',
      },
    },
    {
      $unwind: {
        path: '$callhistoriestoday',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'shoporderclones',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $match: faildstatusMatch,
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
                { $unwind: '$products' },
                {
                  $project: {
                    _id: 1,
                    preOrderClose: 1,
                    // status: 1,
                    quantity: 1,
                    priceperkg: 1,
                    GST_Number: 1,
                    HSN_Code: 1,
                    packKg: 1,
                    unit: 1,
                    date: 1,
                    time: 1,
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
              customerBilldate: 1,
              customerBilltime: 1,
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
              pay_type: 1,
              paymentMethod: 1,
              Uid: 1,
              OrderId: 1,
              customerBillId: 1,
              date: 1,
              time: 1,
              created: 1,
              timeslot: 1,
              statusUpdate: 1,
              WA_assigned_Time: 1,
              product: '$product',
            },
          },
        ],
        as: 'shoporderclones',
      },
    },
    {
      $lookup: {
        from: 'shoporderclones',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $match: faildstatusMatch,
          },
        ],
        as: 'shoporderclonesun',
      },
    },
    { $unwind: '$shoporderclonesun' },
    {
      $project: {
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
        historydate: 1,
        date: 1,
        time: 1,
        created: 1,
        status: 1,
        Uid: 1,
        shopData: 1,
        lapsed: 1,
        callhistoriestoday: '$callhistoriestoday.count',
        shoptypeName: '$shoplists',
        matching: { $and: [{ $eq: ['$callingUserId', userId] }, { $eq: ['$callingStatus', 'On Call'] }] },
        shoporderclones: '$shoporderclones',
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await Shop.aggregate([
    {
      $match: {
        $and: [{ historydate: { $eq: date } }, keys, { lapsed: { $ne: true } }],
      },
    },
    { $sort: { historydate: -1, sorttime: -1 } },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $sort: { date: -1, historytime: -1 },
          },
          { $limit: 10 },
        ],
        as: 'callhistories',
      },
    },
    {
      $lookup: {
        from: 'shoplists',
        localField: 'SType',
        foreignField: '_id',
        as: 'shoplists',
      },
    },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $match: { date: moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD') },
          },
          {
            $group: {
              _id: null,
              count: {
                $sum: 1,
              },
            },
          },
        ],
        as: 'callhistoriestoday',
      },
    },
    {
      $unwind: {
        path: '$callhistoriestoday',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'shoporderclones',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $match: faildstatusMatch,
          },
        ],
        as: 'shoporderclonesun',
      },
    },
    { $unwind: '$shoporderclonesun' },
    {
      $count: 'passing_scores',
    },
  ]);
  let role = await Role.findOne({ _id: userRole });
  let user = await Users.findOne({ _id: userId });
  return {
    values: values,
    total: total.length != 0 ? total[0].passing_scores : 0,
    RoleName: role.roleName,
    userName: user.name,
  };
};

module.exports = {
  createCallHistory,
  getAll,
  getShop_pending,
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
  previouscallBackAnd_Reshedule,
  getOncallShops,
  oncallstatusByUser,
  getShop_callback,
  getShop_reshedule,
  getShop_oncall,
  call_visit_Count,
  BillHistoryByShopId_date,
  updateStatusLapsed,
  updateStatuscalllapsed,
  createcallHistoryWithTypelapsed,
  getShop_lapsed,
};
