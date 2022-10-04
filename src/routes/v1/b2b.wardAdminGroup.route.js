const express = require('express');
const wardAdminGroupController = require('../../controllers/b2b.wardAdminGroup.controller');
const returnStockWastage = require('../../middlewares/returnStockWastage');
const router = express.Router();

router.route('/craeteGroupId').post(wardAdminGroupController.createGroupOrder);

router.route('/update/orderpicked/:deliveryExecutiveId').put(wardAdminGroupController.updateOrderPickedStatus);

router.route('/update/pickedPettyStock/:id').put(wardAdminGroupController.updatePickedPettyStock);

router.route('/update/pickedPettyCash/:id').put(wardAdminGroupController.updatePickedPettyCash);
// new Api
router.route('/update/pickedPettystock/collected/:id').put(wardAdminGroupController.updatePickedPettystockcollected);
// new Api
router.route('/update/pickedPettycash/collected/:id').put(wardAdminGroupController.updateManageStatuscashcollect);

router.route('/update/deliveryStarted/:id').put(wardAdminGroupController.updateDeliveryStarted);

router.route('/update/delivered/:id').put(wardAdminGroupController.updateDeliveryCompleted);

router.route('/update/unDelivered/:id').put(wardAdminGroupController.UpdateUnDeliveredStatus);

router.route('/getDetails/groupIdFromOrderId/:id').get(wardAdminGroupController.getByIdGroupOrderDetails);

router.route('/getdetails/product/:id').get(wardAdminGroupController.getproductDetailsPettyStock);

router.route('/getGroup/details').get(wardAdminGroupController.getGroupDetails);

router.route('/getDeliveryExecutivestatus/:id').get(wardAdminGroupController.getDeliveryExecutivestatus);

router.route('/get/billDetails/:id').get(wardAdminGroupController.getBillDetails);

//checked
router.route('/get/assignedOnle/:page').get(wardAdminGroupController.getAssigned);
router.route('/get/assignedOnle/cash/:page').get(wardAdminGroupController.cashgetAssigned);
router.route('/get/assignedOnle/delivery/:page').get(wardAdminGroupController.deliverygetAssigned);

router.route('/get/details/deliveryExecutive/:id/:page').get(wardAdminGroupController.getDeliveryOrderSeparate);

router.route('/statusChange/:id').put(wardAdminGroupController.updateManageStatus);

//  new API
router.route('/statusChange/completed/:id').put(wardAdminGroupController.updateManagecompleted);

router.route('/groupIdClick/:id').get(wardAdminGroupController.groupIdClick);

router.route('/orderIdClickGetProduct/:id').get(wardAdminGroupController.orderIdClickGetProduct);

router.route('/get/getDetailsAfterDeliveryCompletion/:id').get(wardAdminGroupController.getDetailsAfterDeliveryCompletion);

router.route('/get/BillDetails/perOrder/:id').get(wardAdminGroupController.getBillDetailsPerOrder);

router.route('/get/returnWDEtoWLE/:id/:page').get(wardAdminGroupController.getReturnWDEtoWLE);

// router.route('/submit/pettyStockSubmit').post(wardAdminGroupController.pettyStockSubmit);
// checked
router.route('/submit/pettyCashSubmit/:id').put(wardAdminGroupController.pettyCashSubmit);

router.route('/Update/orderCompleted/:id').put(wardAdminGroupController.orderCompleted);

// router.route('/update/Deliverystart/:id').put(wardAdminGroupController.Deliverystart);

router.route('/update/deliveryCompleted/:id').put(wardAdminGroupController.deliveryCompleted);

router.route('/get/getPettyStockDetails/:id/:page').get(wardAdminGroupController.getPettyStockDetails);

router
  .route('/get/getdetailsAboutPettyStockByGroupId/:id/:page')
  .get(wardAdminGroupController.getdetailsAboutPettyStockByGroupId);

// router.route('/upload/imgae/wastage/').post(wardAdminGroupController.uploadWastageImage);

// router.route('/create/array/pettyStockData/:id').put(wardAdminGroupController.createData);

router.route('/update/status/allocateStatus/:id').put(wardAdminGroupController.updateAllocate);

// checked
router.route('/update/status/notAloocate/:id').put(wardAdminGroupController.updateDontAllocate);
router.route('/cash/update/status/notAloocate/:id').put(wardAdminGroupController.updateDontAllocatecash);

router.route('/get/getPettyCashDetails/:id/:page').get(wardAdminGroupController.getPettyCashDetails);

router.route('/get/AllGroup/details/:page').get(wardAdminGroupController.getAllGroup);

router.route('/update/pettycash/return/:id').put(wardAdminGroupController.updatePettyCashReturnStatus);

// checked Modified
router.route('/create/pettyStock/create/:id').put(wardAdminGroupController.pettyStockCreate);

router.route('/get/cashDetails/fromDB/:id').get(wardAdminGroupController.getcashAmountViewFromDB);
router.route('/submitPEttyCashGivenByWDE/submit/:id').put(wardAdminGroupController.submitPEttyCashGivenByWDE);

// router.route('/Update/create/pettyStock/details/:id').put(wardAdminGroupController.createDatasInPettyStockModel);

router.route('/get/details/pettyCash/:id').get(wardAdminGroupController.getPEttyCashQuantity);

router
  .route('/create/detatisl/About/pettyStock/returnstock')
  .post(returnStockWastage.array('wastageImageUpload'), wardAdminGroupController.uploadWastageImage);

router.route('/get/return/stock/:id').get(wardAdminGroupController.returnStock);

// checked Modified
router.route('/create/pettyStock/:id').put(wardAdminGroupController.lastPettyStckAdd);

router.route('/get/shop/details/:id').get(wardAdminGroupController.getShopDetailsForProj);

router.route('/submit/pettyCash/AsGivenByWDE/:id').put(wardAdminGroupController.submitCashGivenByWDE);

router.route('/update/groupDetails/:id').put(wardAdminGroupController.createAddOrdINGrp);
// router.route('/craete/billNo/:id').post(wardAdminGroupController.createBillNo);

// DELIVERY EXECUTIVE

// router.route('/get/getDeliveryDetails/:page').get(wardAdminGroupController.getDeliveryDetails);

router.route('/get/details/finishing/account/:id/:page').get(wardAdminGroupController.finishingAccount)

module.exports = router;
