const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const PickupLocation = require('../models/manage.pickupLocation.model');
const axios = require('axios');

const createManagePickupLocation = async (body) => {
  let latlan = await axios.get(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${body.address}&key=AIzaSyDoYhbYhtl9HpilAZSy8F_JHmzvwVDoeHI`
  );

  let locations = latlan.data.results[0].geometry;
  let latitude = locations.location.lat;
  let langitude = locations.location.lng;
  let values = { ...body, ...{ latitude: latitude, langitude: langitude } };
  const createpickuplocations = await PickupLocation.create(values);
  return createpickuplocations;
};

module.exports = {
  createManagePickupLocation,
};
