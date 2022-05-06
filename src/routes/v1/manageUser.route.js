const express = require('express');
const manageUserController = require('../../controllers/manageUser.controller');
const uploadImage = require('../../middlewares/uploadImage');
const proof = require('../../middlewares/proof')
// const upload = require('../../middlewares/upload')
const router = express.Router();

router.route('/').post(uploadImage.fields([{name:"idProofUpload"}, {name:"addressProofUpload"}, {name:"twoWheelerUpload"}]), manageUserController.createmanageUserService);
router.route('/').get(manageUserController.getmanageUserServiceAll)
router
  .route('/:manageUserId')
  .get(manageUserController.getmanageUserServiceById)
  .put(uploadImage.fields([{name:"idProofUpload"}, {name:"addressProofUpload"}, {name:"twoWheelerUpload"}]), manageUserController.updatemanageUserService)
  .delete(manageUserController.deletemanageUserService);

module.exports = router;