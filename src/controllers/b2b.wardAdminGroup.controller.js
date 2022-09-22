const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const wardAdminGroupService = require('../services/b2b.wardAdminGroup.service');
const { ProductorderClone } = require('../models/shopOrder.model');
const wardAdminGroup = require('../models/b2b.wardAdminGroup.model');
const pettyStockModel = require('../models/b2b.pettyStock.model');

const createGroupOrder = catchAsync(async (req, res) => {
  const shopOrderClone = await wardAdminGroupService.createGroup(req.body);
  res.send(shopOrderClone);
});

const updateOrderPickedStatus = catchAsync(async (req, res) => {
  const orderPicked = await wardAdminGroupService.orderPicked(req.params.deliveryExecutiveId);
  res.send(orderPicked);
});

const submitPEttyCashGivenByWDE = catchAsync(async (req, res) => {
  const cashAsGivenByWDE = await wardAdminGroupService.updateManageStatus(req.params.id, req.body);
  res.send(cashAsGivenByWDE);
});

const updatePickedPettyStock = catchAsync(async (req, res) => {
  const pickedPettyStock = await wardAdminGroupService.updateManageStatus(req.params.id, req.body);
  res.send(pickedPettyStock);
});

const updateManageStatuscashcollect = catchAsync(async (req, res) => {
  const pickedPettyStock = await wardAdminGroupService.updateManageStatuscashcollect(req.params.id, req.body);
  res.send(pickedPettyStock);
});

const updatePickedPettyCash = catchAsync(async (req, res) => {
  const pickedPettyCash = await wardAdminGroupService.updateManageStatus(req.params.id, req.body);
  res.send(pickedPettyCash);
});

const updatePickedPettystockcollected = catchAsync(async (req, res) => {
  const pickedPettyCash = await wardAdminGroupService.updateManageStatuscollected(req.params.id, req.body);
  res.send(pickedPettyCash);
});

const updateDontAllocate = catchAsync(async (req, res) => {
  const notAloocate = await wardAdminGroupService.updateManageStatus(req.params.id, req.body);
  res.send(notAloocate);
});
const updateDontAllocatecash = catchAsync(async (req, res) => {
  const notAloocate = await wardAdminGroupService.updateManageStatuscash(req.params.id, req.body);
  res.send(notAloocate);
});
const updateAllocate = catchAsync(async (req, res) => {
  const notAloocate = await wardAdminGroupService.updateManageStatus(req.params.id, req.body);
  res.send(notAloocate);
});

const updateDeliveryStarted = catchAsync(async (req, res) => {
  const deleiveryStarted = await wardAdminGroupService.delevery_start(req.params.id, req.body);
  res.send(deleiveryStarted);
});

const updatePettyCashReturnStatus = catchAsync(async (req, res) => {
  const status = await wardAdminGroupService.updateShopOrderCloneById(req.params.id, {
    pettyCashReceiveStatus: 'Approved',
  });
  res.send(status);
});

const updateDeliveryCompleted = catchAsync(async (req, res) => {
  const deliveryCompleted = await wardAdminGroupService.updateOrderStatus(req.params.id, req.body, {
    status: 'Delivered',
    customerDeliveryStatus: 'Delivered',
  });
  res.send(deliveryCompleted);
});

const UpdateUnDeliveredStatus = catchAsync(async (req, res) => {
  const deliveryStatus = await wardAdminGroupService.updateOrderStatus(req.params.id, {
    status: 'UnDelivered',
    customerDeliveryStatus: 'UnDelivered',
  });
  res.send(deliveryStatus);
});

const getproductDetailsPettyStock = catchAsync(async (req, res) => {
  const details = await wardAdminGroupService.getPettyStock(req.params.id);
  res.send(details);
});

const updateManageStatus = catchAsync(async (req, res) => {
  const data = await wardAdminGroupService.updateManageStatus(req.params.id, req.body);
  res.send(data);
});

const updateManagecompleted = catchAsync(async (req, res) => {
  const data = await wardAdminGroupService.updateordercomplete(req.params.id, req.body);
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
  res.send(details);
});

const getBillDetails = catchAsync(async (req, res) => {
  const details = await wardAdminGroupService.getBillDetails(req.params.id);
  res.send(details);
});

const getAssigned = catchAsync(async (req, res) => {
  const details = await wardAdminGroupService.assignOnly(req.params.page, 'stock');
  res.send(details);
});
const cashgetAssigned = catchAsync(async (req, res) => {
  const details = await wardAdminGroupService.assignOnly(req.params.page, 'cash');
  res.send(details);
});
const deliverygetAssigned = catchAsync(async (req, res) => {
  const details = await wardAdminGroupService.assignOnly(req.params.page, 'delivery');
  res.send(details);
});

const getDeliveryOrderSeparate = catchAsync(async (req, res) => {
  const details = await wardAdminGroupService.getDeliveryOrderSeparate(req.params.id, req.params.page);
  res.send(details);
});

const groupIdClick = catchAsync(async (req, res) => {
  const details = await wardAdminGroupService.groupIdClick(req.params.id);
  res.send(details);
});

const orderIdClickGetProduct = catchAsync(async (req, res) => {
  console.log(req.params.id);
  const details = await wardAdminGroupService.orderIdClickGetProduct(req.params.id);
  res.send(details);
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
  const getReturnDetails = await wardAdminGroupService.getReturnWDEtoWLE(req.params.id, req.params.page);
  res.send(getReturnDetails);
});

// const pettyStockSubmit = catchAsync(async (req, res) => {
//   const pettystock = await wardAdminGroupService.pettyStockSubmit( req.body);
//   res.send(pettystock);
// });

const pettyCashSubmit = catchAsync(async (req, res) => {
  const pettystock = await wardAdminGroupService.pettyCashSubmit(req.params.id, req.body);
  res.send(pettystock);
});

const orderCompleted = catchAsync(async (req, res) => {
  const complete = await wardAdminGroupService.pettyStockSubmit(req.params.id, req.body);
  res.send(complete);
});

const Deliverystart = catchAsync(async (req, res) => {
  const start = await wardAdminGroupService.pettyStockSubmit(req.params.id, req.body);
  res.send(start);
});

const deliveryCompleted = catchAsync(async (req, res) => {
  const completed = await wardAdminGroupService.pettyStockSubmit(req.params.id, req.body);
  res.send(completed);
});

const getPettyStockDetails = catchAsync(async (req, res) => {
  const completed = await wardAdminGroupService.getPettyStockDetails(req.params.id, req.params.page);
  res.send(completed);
});

const getdetailsAboutPettyStockByGroupId = catchAsync(async (req, res) => {
  const datas = await wardAdminGroupService.getdetailsAboutPettyStockByGroupId(req.params.id, req.params.page);
  res.send(datas);
});

// const uploadWastageImage = catchAsync(async (req, res) => {
//   const { body } = req;
//   const otherExp = await wardAdminGroupService.uploadWastageImage(req);
//   if (req.files) {
//     let path = '';
//     req.files.forEach(function (files, index, arr) {
//       path = 'images/wastageProduct/' + files.filename;
//     });
//     otherExp.wastageImageUpload = path;
//   }
//   await otherExp.save();
//   res.status(httpStatus.CREATED).send(otherExp);
// });

const createData = catchAsync(async (req, res) => {
  const data = await wardAdminGroupService.getpettyStockData(req.params.id, req.body);
  res.send(data);
});

const getPettyCashDetails = catchAsync(async (req, res) => {
  const data = await wardAdminGroupService.getPettyCashDetails(req.params.id, req.params.page);
  res.send(data);
});

const getAllGroup = catchAsync(async (req, res) => {
  const group = await wardAdminGroupService.getAllGroup(req.params.page);
  res.send(group);
});

const pettyStockCreate = catchAsync(async (req, res) => {
  const shopOrder = await wardAdminGroupService.pettyStockCreate(req.params.id, req.body);
  res.send(shopOrder);
});

const getcashAmountViewFromDB = catchAsync(async (req, res) => {
  const getcashFromDb = await wardAdminGroupService.getcashAmountViewFromDB(req.params.id);
  res.send(getcashFromDb);
});

const createDatasInPettyStockModel = catchAsync(async (req, res) => {
  const createAndUpdateDataINPettyStock = await wardAdminGroupService.createDatasInPettyStockModel(req.params.id, req.body);
  res.send(createAndUpdateDataINPettyStock);
});

const getPEttyCashQuantity = catchAsync(async (req, res) => {
  const createAndUpdateDataINPettyStock = await wardAdminGroupService.getPEttyCashQuantity(req.params.id);
  res.send(createAndUpdateDataINPettyStock);
});

const returnStock = catchAsync(async (req, res) => {
  const returnStock = await wardAdminGroupService.returnStock(req.params.id);
  res.send(returnStock);
});

const uploadWastageImage = catchAsync(async (req, res) => {
  const returnStock = await wardAdminGroupService.uploadWastageImage(req.body);
  if (req.files) {
    req.files.forEach(function (files, index, arr) {
      returnStock.wastageImageUpload.push('images/returnStockWastage/' + files.filename);
    });
  }

  res.send(returnStock);
  await returnStock.save();
});

const lastPettyStckAdd = catchAsync(async (req, res) => {
  const returnStock = await wardAdminGroupService.lastPettyStckAdd(req.params.id, req.body);
  res.send(returnStock);
});

const getShopDetailsForProj = catchAsync(async (req, res) => {
  const getShopDetailsForProj = await wardAdminGroupService.getShopDetailsForProj(req.params.id);
  res.send(getShopDetailsForProj);
});

const submitCashGivenByWDE = catchAsync(async (req, res) => {
  const cashAsGivenByWDE = await wardAdminGroupService.submitCashGivenByWDE(req.params.id, req.body);
  res.send(cashAsGivenByWDE);
});

const createAddOrdINGrp = catchAsync(async (req, res) => {
  const cashAsGivenByWDE = await wardAdminGroupService.createAddOrdINGrp(req.params.id, req.body);
  res.send(cashAsGivenByWDE);
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

  getproductDetailsPettyStock,
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

  // pettyStockSubmit,
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

  submitPEttyCashGivenByWDE,
  createDatasInPettyStockModel,

  getPEttyCashQuantity,

  returnStock,

  lastPettyStckAdd,
  updateDontAllocatecash,
  updatePickedPettystockcollected,
  // createImageUploadAndDetails,
  updateManageStatuscashcollect,
  updateManagecompleted,

  getShopDetailsForProj,
  submitCashGivenByWDE,
  createAddOrdINGrp,
  cashgetAssigned,
  deliverygetAssigned,
};
