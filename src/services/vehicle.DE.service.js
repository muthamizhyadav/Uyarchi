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

const getVehicle = async (page) => {
  let values = await Vehicle.aggregate([{ $skip: 10 * page }, { $limit: 10 }]);
  let total = await Vehicle.find().count();
  return { values: values, total: total };
};

// fetch ward DeliveryExecutives && active Vehicles

const getVehicle_and_DE = async () => {
  // find deliveryExecutives
  const DeliveryExecutives = await Users.find({ userRole: '36151bdd-a8ce-4f80-987e-1f454cd0993f' });
  //  find active vehicles
  const getVehicle = await Vehicle.find({ active: true });
  return { DeliveryExecutives: DeliveryExecutives, activeVehicles: getVehicle };
};

const getAll_Vehicle_Details = async () => {
  const vehicles = await Vehicle.aggregate([{}]);
  return vehicles;
};

module.exports = {
  createVehicle,
  getVehicle,
  getVehicle_and_DE,
  getAll_Vehicle_Details,
};
