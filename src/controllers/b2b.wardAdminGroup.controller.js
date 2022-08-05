const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const wardAdminGroupService = require('../services/b2b.wardAdminGroup.service')


const createGroupOrder = catchAsync(async (req, res) => {
    let userid = req.userId;
    const shopOrder = await wardAdminGroupService.createGroup(req.body, userid);
    if (!shopOrder) {
      throw new ApiError(httpStatus.NOT_FOUND, ' Not Fount.');
    }
    res.status(httpStatus.CREATED).send(shopOrder);
  });


  module.exports = {
    createGroupOrder,
  }