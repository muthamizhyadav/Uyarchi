const express = require('express');
const wardAdminGroupController = require('../../controllers/b2b.wardAdminGroup.controller');
const router = express.Router();

router.route('/craeteGroupId').post(wardAdminGroupController.createGroupOrder);

router.route('/update/orderpicked/:id').put(wardAdminGroupController.updateOrderPickedStatus);

router.route('/update/pickedPettyStock/:id').put(wardAdminGroupController.updatePickedPettyStock);

router.route('/update/pickedPettyCash/:id').put(wardAdminGroupController.updatePickedPettyCash);

router.route('/update/deliveryStarted/:id').put(wardAdminGroupController.updateDeliveryStarted);

router.route('/update/deliveryCompleted/:id').put(wardAdminGroupController.updateDeliveryCompleted);

router.route('/update/unDelivered/:id').put(wardAdminGroupController.UpdateUnDeliveredStatus);

router.route('/getDetails/groupIdFromOrderId/:id').get(wardAdminGroupController.getByIdGroupOrderDetails);

router.route('/getdetails/product/:id').get(wardAdminGroupController.getproductDetails);


router.route('/getGroup/details/:page').get(wardAdminGroupController.getGroupDetails);

// DELIVERY EXECUTIVE

// router.route('/get/getDeliveryDetails/:page').get(wardAdminGroupController.getDeliveryDetails);

module.exports = router;
