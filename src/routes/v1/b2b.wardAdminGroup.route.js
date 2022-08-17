const express = require('express');
const wardAdminGroupController = require('../../controllers/b2b.wardAdminGroup.controller');
const router = express.Router();

router.route('/craeteGroupId').post(wardAdminGroupController.createGroupOrder);

router.route('/update/orderpicked/:deliveryExecutiveId').put(wardAdminGroupController.updateOrderPickedStatus);

router.route('/update/pickedPettyStock/:id').put(wardAdminGroupController.updatePickedPettyStock);

router.route('/update/pickedPettyCash/:id').put(wardAdminGroupController.updatePickedPettyCash);

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

// DELIVERY EXECUTIVE

// router.route('/get/getDeliveryDetails/:page').get(wardAdminGroupController.getDeliveryDetails);

module.exports = router;
