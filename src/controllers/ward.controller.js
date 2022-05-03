const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const wardService = require('../services/ward.service');

const createWard = catchAsync(async (req, res) => {
  const ward = await wardService.createWard(req.body);
  res.status(httpStatus.CREATED).send(ward);
});

// const getProducts = catchAsync(async (req, res) => {
//   const filter = pick(req.query, ['productTitle', 'unit']);
//   const options = pick(req.query, ['sortBy', 'limit', 'page']);
//   const result = await productService.queryProduct(filter, options);
//   res.send(result);
// });

const getWardByZoneId = catchAsync(async(req, res)=>{
  const dis = await wardService.getWardByZoneId(req.params.zoneId)
  res.send(dis)
})

const getward = catchAsync(async (req, res) => {
  const ward = await wardService.getWardById(req.params.wardId);
  if (!ward || ward.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ward not found');
  }
  res.send(ward);
});
const getAllWard = catchAsync (async(req, res)=>{
  const allWard = await wardService.getAllWard(req.params);
  res.send(allWard);
});
const updateward = catchAsync(async (req, res) => {
  const ward = await wardService.updatewardById(req.params.wardId, req.body);
  res.send(ward);
});

const deleteWard = catchAsync(async (req, res) => {
  await wardService.deleteWardById(req.params.wardId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createWard,
  getAllWard,
  getward,
  getWardByZoneId,
  updateward,
  deleteWard,
};
