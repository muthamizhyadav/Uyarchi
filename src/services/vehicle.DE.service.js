const httpStatus = require('http-status');
const { Vehicle, AssignDriver, AssignDrivechild } = require('../models/vehicle.DE.model');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const { Users } = require('../models/B2Busers.model');
const { response } = require('express');

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
  const vehicles = await Vehicle.aggregate([
    {
      $lookup: {
        from: 'wardadmingroups',
        localField: '_id',
        foreignField: 'vehicleId',
        pipeline: [
          { $match: { manageDeliveryStatus: { $ne: "Delivery Completed" } } }
        ],
        as: 'wardadmingroups',
      }
    },
    {
      $project: {
        RC_book_image: 1,
        vehicle_image: 1,
        active: 1,
        archive: 1,
        vehicle_type: 1,
        vehicle_Owner_Name: 1,
        ownerShip_Type: 1,
        vehicleNo: 1,
        tonne_Capacity: 1,
        vehicle_Name: 1,
        created: 1,
        date: 1,
        time: 1,
        wardadmingroups: { $size: "$wardadmingroups" }
      },
    },
    { $match: { wardadmingroups: { $eq: 0 } } }
  ])
  return vehicles;
};


const assigndriverVehile = async (body) => {

  let bodydata = { ...body, ...{ created: moment(), date: moment().format('YYYY-MM-DD'), time: moment().format('HHmm') } }
  let driver = await AssignDriver.create(bodydata);
  body.group.forEach(async (res) => {
    await AssignDrivechild.create({
      groupID: res,
      assignGroupId: driver._id,
      created: moment(),
      date: moment().format('YYYY-MM-DD'),
      time: moment().format('HHmm')
    })
  })


  return driver;

}

module.exports = {
  createVehicle,
  getVehicle,
  getVehicle_and_DE,
  getAll_Vehicle_Details,
  assigndriverVehile
};
