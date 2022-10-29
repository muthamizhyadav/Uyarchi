const httpStatus = require('http-status');
const Vehicle = require('../models/vehicle.DE.model');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const { Users } = require('../models/B2Busers.model');

// create New Vehicle for DeliveryExecutive
const createVehicle = async (body) => {
  const values = { ...body, ...{ created: moment(), date: moment().format('YYYY-MM-DD'), time: moment().format('HH:mm') } };
  let create = await Vehicle.create(values);
  return create;
};

// fetch All Active Vehicles for DeliveryExecutive

const getVehicle = async () => {
  let values = await Vehicle.find();
  return values;
};

// fetch ward DeliveryExecutives && active Vehicles

const getVehicle_and_DE = async () => {
  // find deliveryExecutives
  const DeliveryExecutives = await Users.find({ userRole: '36151bdd-a8ce-4f80-987e-1f454cd0993f' });
  //  find active vehicles
  const getVehicle = await Vehicle.find({ active: true });
  return { DeliveryExecutives: DeliveryExecutives, activeVehicles: getVehicle };
};

module.exports = {
  createVehicle,
  getVehicle,
  getVehicle_and_DE,
};
