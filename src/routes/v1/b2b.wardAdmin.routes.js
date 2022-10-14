const express = require('express');
const wardAdminController = require('../../controllers/b2b.wardAdmin.controller');
const router = express.Router();
router.route('/create/data').post(wardAdminController.createdata);
// checked
router.route('/getDetails/:limit/:page/:status').get(wardAdminController.statusMatchingAppOrModi);

router.route('/getProductDetails/:id').get(wardAdminController.getproductDetails);
// checked modified
router.route('/updateProductById/:orderId').put(wardAdminController.updateProduct);

// router.route('/getDetails/:limit/:page/:status').get(wardAdminController.statusMatchingAppOrModi);
router.route('/getDetails/:type/:time/:status/:limit/:page').get(wardAdminController.statusMatchingAppOrModi);
router.route('/getProductDetails/:id').get(wardAdminController.getproductDetails);
// checked modified
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
// checked
router.route('/wardloadingExecutive/getdetails/:id').get(wardAdminController.wardloadExecutive);
router.route('/wardloadingExecutive/getdetails/bygroup/:page').get(wardAdminController.wardloadExecutivebtgroup);
router
  .route('/wardloadingExecutive/getdetails/afterpacked/:status/:date/:page')
  .get(wardAdminController.wardloadExecutivepacked);

router.route('/wardloadingExecutive/getPackedProductDetails/:range/:page').get(wardAdminController.wardloadExecutivePacked);

router.route('/getWardDeliveryExecutive/name').get(wardAdminController.wardDeliveryExecutive);

// router.route('/getWardDeliveryExecutive/name').get(wardAdminController.wardDeliveryExecutive);

router.route('/delivery/Executive/Name/:id').put(wardAdminController.deliveryexecutive);

router.route('/Array/craeteArrayData').post(wardAdminController.createArrayData);
// checked
router.route('/update/acknowleded/status/single/:id').put(wardAdminController.updateAcknowledgeSingle);

router.route('/get/status/Count').get(wardAdminController.countStatus);
// checked Modified
router.route('/order/Assign').get(wardAdminController.getAssigned_details);
// mismatcheddata
router.route('/mismatchCount/:page').get(wardAdminController.mismatchCount);
router.route('/mismatchGroup/:id').get(wardAdminController.mismatchGroup);
module.exports = router;
