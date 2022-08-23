const express = require('express');
const wardAdminGroupController = require('../../controllers/b2b.wardAdminGroup.controller');
const router = express.Router();

router.route('/craeteGroupId').post(wardAdminGroupController.createGroupOrder);

// router.route('/update/orderpicked/:deliveryExecutiveId').put(wardAdminGroupController.updateOrderPickedStatus);

// router.route('/update/pickedPettyStock/:id').put(wardAdminGroupController.updatePickedPettyStock);

// router.route('/update/pickedPettyCash/:id').put(wardAdminGroupController.updatePickedPettyCash);

router.route('/update/deliveryStarted/:id').put(wardAdminGroupController.updateDeliveryStarted);

router.route('/update/delivered/:id').put(wardAdminGroupController.updateDeliveryCompleted);

router.route('/update/unDelivered/:id').put(wardAdminGroupController.UpdateUnDeliveredStatus);

router.route('/getDetails/groupIdFromOrderId/:id').get(wardAdminGroupController.getByIdGroupOrderDetails);

router.route('/getdetails/product/:id').get(wardAdminGroupController.getproductDetails);


router.route('/getGroup/details').get(wardAdminGroupController.getGroupDetails);


router.route('/getDeliveryExecutivestatus/:id').get(wardAdminGroupController.getDeliveryExecutivestatus);


router.route('/get/billDetails/:id').get(wardAdminGroupController.getBillDetails);

router.route('/get/assignedOnle/:page').get(wardAdminGroupController.getAssigned);


router.route('/get/details/deliveryExecutive/:id/:page').get(wardAdminGroupController.getDeliveryOrderSeparate);

router.route('/statusChange/:id').put(wardAdminGroupController.updateManageStatus)

router.route('/groupIdClick/:id').get(wardAdminGroupController.groupIdClick)

router.route('/orderIdClickGetProduct/:id').get(wardAdminGroupController.orderIdClickGetProduct);



router.route('/get/getDetailsAfterDeliveryCompletion/:id').get(wardAdminGroupController.getDetailsAfterDeliveryCompletion);

router.route('/get/BillDetails/perOrder/:id').get(wardAdminGroupController.getBillDetailsPerOrder);


router.route('/get/returnWDEtoWLE/:id/:page').get(wardAdminGroupController.getReturnWDEtoWLE);

router.route('/submit/pettyStockSubmit/:id').put(wardAdminGroupController.pettyStockSubmit);

router.route('/submit/pettyCashSubmit/:id').put(wardAdminGroupController.pettyCashSubmit);

router.route('/Update/orderCompleted/:id').put(wardAdminGroupController.orderCompleted);

router.route('/update/Deliverystart/:id').put(wardAdminGroupController.Deliverystart);

router.route('/update/deliveryCompleted/:id').put(wardAdminGroupController.deliveryCompleted);

router.route('/get/getPettyStockDetails/:id/:page').get(wardAdminGroupController.getPettyStockDetails);

router.route('/get/getdetailsAboutPettyStockByGroupId/:id/:page').get(wardAdminGroupController.getdetailsAboutPettyStockByGroupId);

router.route('/upload/imgae/wastage/').post(wardAdminGroupController.uploadWastageImage);

router.route('/create/array/pettyStockData/:id').put(wardAdminGroupController.createData);

router.route('/update/status/allocateStatus/:id').put(wardAdminGroupController.updateAllocate);

router.route('/update/status/notAloocate/:id').put(wardAdminGroupController.updateDontAllocate);

router.route('/get/getPettyCashDetails/:id/:page').get(wardAdminGroupController.getPettyCashDetails);

router.route('/get/AllGroup/details/:page').get(  wardAdminGroupController.getAllGroup);

router.route("/update/pettycash/return/:id").put(wardAdminGroupController.updatePettyCashReturnStatus);

// router.route('/craete/billNo/:id').post(wardAdminGroupController.createBillNo);

// DELIVERY EXECUTIVE

// router.route('/get/getDeliveryDetails/:page').get(wardAdminGroupController.getDeliveryDetails);

module.exports = router;
