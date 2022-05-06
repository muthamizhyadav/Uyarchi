const express = require('express');
const manageUserController = require('../../controllers/manageUser.controller');
const uploadImage = require('../../middlewares/uploadImage')
// const upload = require('../../middlewares/upload')
const router = express.Router();

router.route('/').post(uploadImage.array('idProofUpload','addressProofUpload'), manageUserController.createmanageUserService)
router.route('/').get(manageUserController.getmanageUserServiceAll)
router
  .route('/:manageUserId')
  .get(manageUserController.getmanageUserServiceById)
  .put(uploadImage.array('idProofUpload','addressProofUpload'),manageUserController.updatemanageUserService)
  .delete(manageUserController.deletemanageUserService);

module.exports = router;