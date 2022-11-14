const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const PickupLocation = require('../models/manage.pickupLocation.model');
const axios = require('axios');
const moment = require('moment');
const { UserBindingPage } = require('twilio/lib/rest/ipMessaging/v2/service/user/userBinding');
const { Users } = require('../models/B2Busers.model');

const createManagePickupLocation = async (body, userId) => {
  // let latlan = await axios.get(
  //   `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${body.address}&key=AIzaSyDoYhbYhtl9HpilAZSy8F_JHmzvwVDoeHI`
  // );
  let servertime = moment().format('HHmmss');
  let serverdate = moment().format('YYYY-MM-DD');
  // if(latlan.data.results.length == 0){
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Address Not Valid');
  // }
  // let locations = latlan.data.results[0].geometry;
  // let latitude = locations.location.lat;
  // let langitude = locations.location.lng;
  let values = { ...body, ...{ date: serverdate, time: servertime, created: moment(), userId: userId } };
  const createpickuplocations = await PickupLocation.create(values);
  return createpickuplocations;
};

const getAllManagepickup = async (userId, date, page) => {
  let datematch = { active: { $eq: true } };
  let usermatch = { active: { $eq: true } };
  if (userId != 'null') {
    usermatch = {
      userId: { $eq: userId },
    };
  }
  if (date != 'null') {
    datematch = {
      date: { $eq: date },
    };
  }
  let values = await PickupLocation.aggregate([
    {
      $sort: {
        date: -1,
        time: -1,
      },
    },
    {
      $match: {
        $and: [datematch, usermatch],
      },
    },
    {
      $lookup: {
        from: 'wards',
        localField: 'wardId',
        foreignField: '_id',
        as: 'wardData',
      },
    },
    {
      $unwind: '$wardData',
    },
    {
      $lookup: {
        from: 'streets',
        localField: 'streetId',
        foreignField: '_id',
        as: 'streetData',
      },
    },
    {
      $unwind: '$streetData',
    },
    {
      $project: {
        _id: 1,
        ward: '$wardData.ward',
        street: '$streetData.street',
        locationName: 1,
        ownerName: 1,
        address: 1,
        contact: 1,
        created: 1,
        photoCapture: 1,
        landMark: 1,
        latitude: 1,
        date: 1,
        time: 1,
        langitude: 1,
        pick_Up_Type: 1,
        picku_Up_Mode: 1,
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await PickupLocation.aggregate([
    {
      $sort: {
        date: -1,
        time: -1,
      },
    },
    {
      $match: {
        $and: [datematch, usermatch],
      },
    },
    {
      $lookup: {
        from: 'wards',
        localField: 'wardId',
        foreignField: '_id',
        as: 'wardData',
      },
    },
    {
      $unwind: '$wardData',
    },
    {
      $lookup: {
        from: 'streets',
        localField: 'streetId',
        foreignField: '_id',
        as: 'streetData',
      },
    },
    {
      $unwind: '$streetData',
    },
  ]);

  return { values: values, total: total.length };
};

const getManagePickupById = async (id) => {
  let getpickup = await PickupLocation.findById(id);
  if (!getpickup) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pickup Not Found');
  }
  return getpickup;
};

const getAllManagepickupLocation = async (userId, date, todate) => {
  let datematch = { active: { $eq: true } };
  let usermatch = { active: { $eq: true } };
  if (userId != 'null') {
    usermatch = {
      userId: { $eq: userId },
    };
  }
  if (date != 'null' && todate != 'null') {
    datematch = {
      date: { $gte: date, $lte: todate },
    };
  }
  let values = await PickupLocation.aggregate([
    {
      $sort: {
        date: -1,
        time: -1,
      },
    },
    {
      $match: {
        $and: [datematch, usermatch],
      },
    },
    {
      $lookup: {
        from: 'wards',
        localField: 'wardId',
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
        localField: 'userId',
        foreignField: '_id',
        as: 'userData',
      },
    },
    {
      $unwind: '$userData',
    },
    {
      $lookup: {
        from: 'streets',
        localField: 'streetId',
        foreignField: '_id',
        as: 'streetData',
      },
    },
    {
      $unwind: '$streetData',
    },
    {
      $project: {
        _id: 1,
        ward: '$wardData.ward',
        street: '$streetData.street',
        locationName: 1,
        ownerName: 1,
        address: 1,
        contact: 1,
        created: 1,
        photoCapture: 1,
        userId: 1,
        landMark: 1,
        latitude: 1,
        date: 1,
        time: 1,
        langitude: 1,
        pick_Up_Type: 1,
        picku_Up_Mode: 1,
        userName: '$userData.name',
      },
    },
    
  ]);
  return values;
};


const getallPickuplocation = async () => {
  let values = await PickupLocation.find();
  return values;
}
module.exports = {
  createManagePickupLocation,
  getAllManagepickup,
  getManagePickupById,
  getAllManagepickupLocation,
  getallPickuplocation
};
