const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const wardAdminGroupService = require('../services/b2b.wardAdminGroup.service');
const { ProductorderClone } = require('../models/shopOrder.model');
const wardAdminGroup = require('../models/b2b.wardAdminGroup.model');


const createGroupOrder = catchAsync(async (req, res) => {
  let userid = req.userId;
  const shopOrderClone = await wardAdminGroupService.createGroup(req.body, userid);
  res.send(shopOrderClone);
});

const updateOrderPickedStatus = catchAsync(async (req, res) => {
    const orderPicked = await wardAdminGroupService.updateOrderStatus(req.params.id , "Order Picked")
    res.send(orderPicked);
});

const updatePickedPettyStock = catchAsync(async(req,res)=>{
  const pickedPettyStock = await wardAdminGroupService.updateOrderStatus(req.params.id, "Picked Petty Stock")
  res.send(pickedPettyStock);
});

const updatePickedPettyCash = catchAsync(async(req,res)=>{
  const pickedPettyCash = await wardAdminGroupService.updateOrderStatus(req.params.id , "Picked Petty Cash")
  res.send(pickedPettyCash);
});

const updateDeliveryStarted = catchAsync(async(req,res)=>{
  const deleiveryStarted = await wardAdminGroupService.updateOrderStatus(req.params.id , "Delivery started");
  res.send(deleiveryStarted);
});

const updateDeliveryCompleted = catchAsync(async(req,res)=>{
  const deliveryCompleted = await wardAdminGroupService.updateOrderStatus(req.params.id , "Delivery Completed");
  res.send(deliveryCompleted);

})

  module.exports = {
    createGroupOrder,
    updateOrderPickedStatus,
    updatePickedPettyStock,
    updatePickedPettyCash,
    updateDeliveryStarted,
    updateDeliveryCompleted,

  }