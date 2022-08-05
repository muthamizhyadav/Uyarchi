const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const wardAdminGroupService = require('../services/b2b.wardAdminGroup.service');
const { ProductorderClone } = require('../models/shopOrder.model');
const wardAdminGroup = require('../models/b2b.wardAdminGroup.model');


const createGroupOrder = catchAsync(async (req, res) => {
    let userid = req.userId;
    const shopOrder = await wardAdminGroupService.createGroup(req.body, userid);
    if (!shopOrder) {
      throw new ApiError(httpStatus.NOT_FOUND, ' Not Fount.');
    }
    res.status(httpStatus.CREATED).send(shopOrder);
  });

  const createGroupId = catchAsync(async (req, res) => {
    const group = await wardAdminGroup.find();
    let center = '';

    if(group.length < 9){
      center = 'G000';
    }
    if(group.length < 99 && group.length >= 9){
      center = 'G00';
    }
    if(group.length < 999 && group.length >= 99){
      center = 'G0';
    }
    if(group.length < 9999 && group.length >= 999){
      center = '0';
    }

    let userId = '';
    let totalcount = group.length + 1;
    userId = center + totalcount ;

    let craeteGroup;
    if(userId != ''){
      craeteGroup = await wardAdminGroupService.createGroupId(req.body);
    }
    craeteGroup.OrderId = userId;
    res.status(httpStatus.CREATED).send(craeteGroup);
    await craeteGroup.save();
  })


  module.exports = {
    createGroupOrder,
    createGroupId,
  }