const express = require('express');
const wardAdminController = require('../../controllers/b2b.wardAdmin.controller');
const router = express.Router();

router.route('/create/data').post(wardAdminController.createdata);

router.route('/getDetails/:page').get(wardAdminController.getDetails);

router.route('/getProductDetails/:id/').get(wardAdminController.getproductDetails);

router.route('/updateProductById/:id').put(wardAdminController.updateProduct);

router.route('/updateAcknowledge/:id').put(wardAdminController.updateAcknowledge);

router.route('/updateApproved/:id').put(wardAdminController.updateApproved);

router.route('/updateModified/:id').put(wardAdminController.updateModified);

router.route('/updateRejected/:id').put(wardAdminController.updateRejected);

router.route('/wardloadingExecutive/updatePacked/:id').put(wardAdminController.updatePacked);

router.route('/wardloadingExecutive/updateAssign/:id').put(wardAdminController.updateAssigned);

router.route('/wardloadingExecutive/updateProductBilled/:id').put(wardAdminController.updateBilled);

router.route('/wardloadingExecutive/getdetails/:page').get(wardAdminController.wardloadExecutive);


router.route('/wardloadingExecutive/getPackedProductDetails/:page').get(wardAdminController.wardloadExecutivePacked)



router.route('/getWardDeliveryExecutive/name').get(wardAdminController.wardDeliveryExecutive);

router.route('/getWardDeliveryExecutive/name').get(wardAdminController.wardDeliveryExecutive);

router.route('/delivery/Executive/Name/:id').put(wardAdminController.deliveryexecutive);

router.route('/Array/craeteArrayData').post(wardAdminController.createArrayData);

module.exports = router;
