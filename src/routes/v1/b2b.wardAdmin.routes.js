const express = require('express');
const wardAdminController = require('../../controllers/b2b.wardAdmin.controller');
const router = express.Router();

router.route('/create/data').post(wardAdminController.createdata);

// checked
router.route('/getDetails/:limit/:page/:status').get(wardAdminController.statusMatchingAppOrModi);

router.route('/getProductDetails/:id').get(wardAdminController.getproductDetails);
// checked modified
router.route('/updateProductById/:orderId').put(wardAdminController.updateProduct);

// checked
router.route('/updateAcknowledge').put(wardAdminController.updateAcknowledge);
// checked
router.route('/updateApproved').put(wardAdminController.updateApproval);

router.route('/updatePacked').put(wardAdminController.updatePackedStatus);

// checked
router.route('/updateRejected').put(wardAdminController.updateRejectionStatus);

// Checked;
router.route('/updateApproved/:id').put(wardAdminController.updateApproved);

// checked not Use
router.route('/updateModified/:id').put(wardAdminController.updateModified);

// checked Modified
router.route('/updateRejected/:id').put(wardAdminController.updateRejected);

router.route('/wardloadingExecutive/updatePacked/:id').put(wardAdminController.updatePacked);

router.route('/wardloadingExecutive/updateAssign/:id').put(wardAdminController.updateAssigned);

router.route('/wardloadingExecutive/updateProductBilled/:id').put(wardAdminController.updateBilled);

router.route('/wardloadingExecutive/getdetails/:page').get(wardAdminController.wardloadExecutive);

router.route('/wardloadingExecutive/getPackedProductDetails/:page').get(wardAdminController.wardloadExecutivePacked);

router.route('/getWardDeliveryExecutive/name').get(wardAdminController.wardDeliveryExecutive);

router.route('/getWardDeliveryExecutive/name').get(wardAdminController.wardDeliveryExecutive);

router.route('/delivery/Executive/Name/:id').put(wardAdminController.deliveryexecutive);

router.route('/Array/craeteArrayData').post(wardAdminController.createArrayData);
// checked
router.route('/update/acknowleded/status/single/:id').put(wardAdminController.updateAcknowledgeSingle);

router.route('/get/status/Count').get(wardAdminController.countStatus);
router.route('/order/Assign').get(wardAdminController.getAssigned_details);
module.exports = router;
