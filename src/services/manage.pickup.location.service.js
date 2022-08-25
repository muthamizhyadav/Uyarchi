const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const PickupLocation = require('../models/manage.pickupLocation.model');
const axios = require('axios');
const moment = require('moment');
const { UserBindingPage } = require('twilio/lib/rest/ipMessaging/v2/service/user/userBinding');
const { Users } = require('../models/B2Busers.model');

const createManagePickupLocation = async (body) => {
  // let latlan = await axios.get(
  //   `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${body.address}&key=AIzaSyDoYhbYhtl9HpilAZSy8F_JHmzvwVDoeHI`
  // );
  // let servertime = moment().format('HHmm');
  // let serverdate = moment().format('DD-MM-yyy');
  // if(latlan.data.results.length == 0){
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Address Not Valid');
  // }
  // let locations = latlan.data.results[0].geometry;
  // let latitude = locations.location.lat;
  // let langitude = locations.location.lng;
  // let values = { ...body, ...{ latitude: latitude, langitude: langitude, date: serverdate, time: servertime } };
  const createpickuplocations = await PickupLocation.create(body);
  return createpickuplocations;
};

const getAllManagepickup = async (page, userId) => {
  let values = await PickupLocation.aggregate([
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
  let users = await Users.findOne({ _id: userId });
  return { values: values, total: total.length, userName: users.name };
};

const getManagePickupById = async (id) => {
  let getpickup = await PickupLocation.findById(id);
  if (!getpickup) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pickup Not Found');
  }
  return getpickup;
};

module.exports = {
  createManagePickupLocation,
  getAllManagepickup,
  getManagePickupById,
};
