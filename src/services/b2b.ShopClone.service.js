const httpStatus = require('http-status');
const { Shop, AttendanceClone } = require('../models/b2b.ShopClone.model');
const ApiError = require('../utils/ApiError');

// Shop Clone Serive

const createShopClone = async (shopBody) => {
  const shop = await Shop.create(shopBody);
  console.log(shop);
  return shop;
};

const filterShopwithNameAndContact = async (key) => {
  const shop = await Shop.find({ $or: [{ SName: { $regex: key } }, { SCont1: { $regex: key } }] });
  return shop;
};

const getAllShopClone = async () => {
  return Shop.find();
};

const getShopById = async (id) => {
  const shop = await Shop.findById(id);
  return shop;
};

const updateShopById = async (id, updateBody) => {
  let shop = await getShopById(id);
  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop Not found');
  }
  shop = await Shop.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return shop;
};

const deleteShopById = async (id) => {
  let shop = await getShopById(id);
  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUNDm, 'Shop Not Found');
  }
  (shop.active = false), (shop.archive = true);
  await shop.save();
  return shop;
};

// Attendance Clone Service

const createAttendanceClone = async (shopBody) => {
  const attendance = await AttendanceClone.create(shopBody);
  console.log(attendance);
  return attendance;
};

const getAllAttendanceClone = async () => {
  return AttendanceClone.find();
};

const getAttendanceById = async (id) => {
  const attendance = await AttendanceClone.findById(id);
  return attendance;
};

const updateAttendanceById = async (id, updateBody) => {
  let attendance = await getAttendanceById(id);
  if (!attendance) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop Not found');
  }
  attendance = await AttendanceClone.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return attendance;
};

const deleteAttendanceById = async (id) => {
  let attendance = await getAttendanceById(id);
  if (!attendance) {
    throw new ApiError(httpStatus.NOT_FOUNDm, 'attendance Not Found');
  }
  (attendance.active = false), (attendance.archive = true);
  await attendance.save();
  return attendance;
};

module.exports = {
  createShopClone,
  getAllShopClone,
  getShopById,
  updateShopById,
  deleteShopById,
  filterShopwithNameAndContact,
  // Attendace exports
  createAttendanceClone,
  getAllAttendanceClone,
  getAttendanceById,
  updateAttendanceById,
  deleteAttendanceById,
};
