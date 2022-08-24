const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const wardAdminGroupService = require('../services/b2b.wardAdminGroup.service');
const { ProductorderClone } = require('../models/shopOrder.model');
const wardAdminGroup = require('../models/b2b.wardAdminGroup.model');
const pettyStockModel = require('../models/b2b.pettyStock.model')

const createGroupOrder = catchAsync(async (req, res) => {
  let userid = req.userId;
  const shopOrderClone = await wardAdminGroupService.createGroup(req.body, userid);
  res.send(shopOrderClone);
});

const updateOrderPickedStatus = catchAsync(async (req, res) => {
  const orderPicked = await wardAdminGroupService.orderPicked(req.params.deliveryExecutiveId);
  res.send(orderPicked);
});

const updatePickedPettyStock = catchAsync(async (req, res) => {
  const pickedPettyStock = await wardAdminGroupService.updateManageStatus(req.params.id, req.body);
  res.send(pickedPettyStock);
});

const updatePickedPettyCash = catchAsync(async (req, res) => {
  const pickedPettyCash = await wardAdminGroupService.updateManageStatus(req.params.id, req.body);
  res.send(pickedPettyCash);
});

const updateDontAllocate = catchAsync(async (req, res) => {
  const  notAloocate= await wardAdminGroupService.updateManageStatus(req.params.id, req.body);
  res.send(notAloocate);
});

const updateAllocate = catchAsync(async (req, res) => {
  const  notAloocate= await wardAdminGroupService.updateManageStatus(req.params.id, req.body);
  res.send(notAloocate);
});


const updateDeliveryStarted = catchAsync(async (req, res) => {
  const deleiveryStarted = await wardAdminGroupService.updateManageStatus(req.params.id, req.body);
  res.send(deleiveryStarted);
});

const updatePettyCashReturnStatus = catchAsync(async (req, res) => {
  const status = await wardAdminGroupService.updateShopOrderCloneById(req.params.id, req.body);
  res.send(status);
})

const updateDeliveryCompleted = catchAsync(async (req, res) => {
  const deliveryCompleted = await wardAdminGroupService.updateOrderStatus(req.params.id, req.body);
  res.send(deliveryCompleted);
});

const UpdateUnDeliveredStatus = catchAsync(async (req, res) => {
  const deliveryStatus = await wardAdminGroupService.updateOrderStatus(req.params.id, 'UnDelivered' , req.body);
  res.send(deliveryStatus);
});

const getproductDetails = catchAsync(async (req, res) => {
  const details = await wardAdminGroupService.getPettyStock(req.params.id);
  res.send(details);
});

const updateManageStatus = catchAsync(async (req, res) => {
  const data = await wardAdminGroupService.updateManageStatus(req.params.id, req.body);
  res.send(data);
});

// const getDeliveryDetails = catchAsync(async (req, res) => {
//   const deliveryDetails = await wardAdminGroupService.getDeliveryDetails(req.params.page);
//   res.send(deliveryDetails);
// });

const getByIdGroupOrderDetails = catchAsync(async (req, res) => {
  const sample = await wardAdminGroupService.getOrderFromGroupById(req.params.id);
  res.send(sample);
});

const getGroupDetails = catchAsync(async (req, res) => {
  const getDetails = await wardAdminGroupService.getGroupdetails();
  res.send(getDetails);
});

const getDeliveryExecutivestatus = catchAsync(async (req, res) => {
  const details = await wardAdminGroupService.getstatus(req.params.id);
  res.send(details)
});

const getBillDetails = catchAsync(async (req, res) => {
  const details = await wardAdminGroupService.getBillDetails(req.params.id);
  res.send(details)
});

const getAssigned = catchAsync(async (req, res) => {
  const details = await wardAdminGroupService.assignOnly(req.params.page);
  res.send(details)
});


const getDeliveryOrderSeparate = catchAsync(async (req, res) => {
  const details = await wardAdminGroupService.getDeliveryOrderSeparate(req.params.id, req.params.page);
  res.send(details);
})


const groupIdClick = catchAsync(async (req, res) => {
  const details = await wardAdminGroupService.groupIdClick(req.params.id);
  res.send(details)
});

const orderIdClickGetProduct = catchAsync(async (req, res) => {
  console.log(req.params.id)
  const details = await wardAdminGroupService.orderIdClickGetProduct(req.params.id);
  res.send(details)
});

const getDetailsAfterDeliveryCompletion = catchAsync(async (req, res) => {
  const getdetails = await wardAdminGroupService.getDetailsAfterDeliveryCompletion(req.params.id);
  res.send(getdetails);
});


const getBillDetailsPerOrder = catchAsync(async (req, res) => {
  const getdetails = await wardAdminGroupService.getBillDetailsPerOrder(req.params.id);
  res.send(getdetails);
});

const getReturnWDEtoWLE = catchAsync(async (req, res) => {
  const getReturnDetails = await wardAdminGroupService.getReturnWDEtoWLE(req.params.id , req.params.page);
  res.send(getReturnDetails);
});

const pettyStockSubmit =  catchAsync(async (req, res) => {
  const pettystock = await wardAdminGroupService.pettyStockSubmit(req.params.id, req.body);
  res.send(pettystock)
})

const pettyCashSubmit =  catchAsync(async (req, res) => {
  const pettystock = await wardAdminGroupService.pettyStockSubmit(req.params.id, req.body);
  res.send(pettystock)
});

const orderCompleted =  catchAsync(async (req, res) => {
  const complete = await wardAdminGroupService.pettyStockSubmit(req.params.id, req.body);
  res.send(complete)
});

const Deliverystart =  catchAsync(async (req, res) => {
  const start = await wardAdminGroupService.pettyStockSubmit(req.params.id, req.body);
  res.send(start)
});

const deliveryCompleted =  catchAsync(async (req, res) => {
  const completed = await wardAdminGroupService.pettyStockSubmit(req.params.id, req.body);
  res.send(completed)
});


const getPettyStockDetails =  catchAsync(async (req, res) => {
  const completed = await wardAdminGroupService.getPettyStockDetails(req.params.id, req.params.page);
  res.send(completed)
});



const getdetailsAboutPettyStockByGroupId =  catchAsync(async (req, res) => {
  const datas = await wardAdminGroupService.getdetailsAboutPettyStockByGroupId(req.params.id, req.params.page);
  res.send(datas)
});



const uploadWastageImage = catchAsync(async (req, res) => {
  const { body } = req;
  const otherExp = await wardAdminGroupService.uploadWastageImage(body);
  if (req.files) {
    let path = '';
    req.files.forEach(function (files, index, arr) {
      path = 'images/bills/' + files.filename;
    });
    otherExp.wastageImageUpload = path;
  }
  await otherExp.save();
  res.status(httpStatus.CREATED).send(otherExp);
});

const createData = catchAsync(async (req, res) => {
  const data = await wardAdminGroupService.getpettyStockData( req.params.id, req.body);
  res.send(data)
});

const getPettyCashDetails = catchAsync(async (req, res) => {
  const data = await wardAdminGroupService.getPettyCashDetails(req.params.id, req.params.page);
  res.send(data)
});

const getAllGroup = catchAsync(async (req, res) => {
  const group = await wardAdminGroupService.getAllGroup(req.params.page)
  res.send(group)
});

const pettyStockCreate = catchAsync(async (req, res) => {
  // let userid = req.userId;
  const shopOrder = await wardAdminGroupService.pettyStockCreate(req.body);
  if (!shopOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'product Not Fount.');
  }
  res.status(httpStatus.CREATED).send(shopOrder);
});


const getcashAmountViewFromDB = catchAsync(async (req, res) => {
  const getcashFromDb = await wardAdminGroupService.getcashAmountViewFromDB(req.params.id, req.params.page);
  res.send(getcashFromDb)
});


module.exports = {
  createGroupOrder,
  updateOrderPickedStatus,
  updatePickedPettyStock,
  updatePickedPettyCash,
  updateDeliveryStarted,
  updateDeliveryCompleted,

  // getDeliveryDetails,

  // get details from groupid
  getByIdGroupOrderDetails,
  UpdateUnDeliveredStatus,

  getproductDetails,
  getGroupDetails,


  getDeliveryExecutivestatus,
  getBillDetails,

  getAssigned,


  getDeliveryOrderSeparate,

  updateManageStatus,
  groupIdClick,
  orderIdClickGetProduct,

  getDetailsAfterDeliveryCompletion,
  getBillDetailsPerOrder,


  getReturnWDEtoWLE,

  pettyStockSubmit,
  pettyCashSubmit,
  orderCompleted,
  Deliverystart,
  deliveryCompleted,


  getPettyStockDetails,
  getdetailsAboutPettyStockByGroupId,

  uploadWastageImage,

  updateDontAllocate,

  updateAllocate,

  createData,
  getPettyCashDetails,
  getAllGroup,

  updatePettyCashReturnStatus,
  pettyStockCreate,
  getcashAmountViewFromDB,

};
