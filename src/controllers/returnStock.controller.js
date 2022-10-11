const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const ReturnService = require('../services/returnStock.service');

const create_ReturnStock = catchAsync(async (req, res) => {
  const returnstock = await ReturnService.create_ReturnStock(req.body);
  if (req.files) {
    req.files.forEach(function (files, index, arr) {
      returnstock.image.push('images/returnstock/' + files.filename);
    });
  }

  res.send(returnstock);
  await returnstock.save();
});

module.exports = {
  create_ReturnStock,
};
