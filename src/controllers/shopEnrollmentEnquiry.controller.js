const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const shopEnrollmentEnquiryService = require('../services/shopEnrollmentEnquiry.service');

const createEnquiry = catchAsync(async (req, res) => {
    let userId = req.userId;
    console.log(userId);
  const data = await shopEnrollmentEnquiryService.createEnquiry(userId, req.body);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ShopEnrollmentEnquiry Not Fount');
  }
  res.status(httpStatus.CREATED).send(data);
});


const getAllEnquiryDatas = catchAsync(async (req, res) => {
    const data = await shopEnrollmentEnquiryService.getAllEnquiryDatas(req.params.pincode);
    res.send(data);
  });

const updateEnquiryById = catchAsync(async (req, res) => {
    const data = await shopEnrollmentEnquiryService.updateEnquiryById(req.params.id, req.body);
    res.send(data);
});



const AssignShops = catchAsync(async (req, res) => {
  const data = await shopEnrollmentEnquiryService.AssignShops(req.body);
  res.send(data);
});

const pincode = catchAsync(async (req, res) => {
    const data = await shopEnrollmentEnquiryService.pincode();
    res.send(data);
  });

module.exports = {
    createEnquiry,
    getAllEnquiryDatas,
    updateEnquiryById,
    AssignShops,
    pincode,
};
