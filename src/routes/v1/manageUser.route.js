const express = require('express');
const manageUserController = require('../../controllers/manageUser.controller');
const uploadImage = require('../../middlewares/uploadImage');
const proof = require('../../middlewares/proof')
// const upload = require('../../middlewares/upload')
const router = express.Router();

router.route('/').post(manageUserController.createmanageUserService);
router.route('/').get(manageUserController.getmanageUserServiceAll)
router.route('/login').post(manageUserController.login)
router.route('/:id/:districtId/:zoneId/:wardId/:page').get(manageUserController.getAllManageUserTable)
router.route('/manageUserAllData/all').get(manageUserController.getmanageUserServiceAllenable)
router
  .route('/:manageUserId')
  .get(manageUserController.getmanageUserServiceById)
  .put(manageUserController.updatemanageUserService)
  .delete(manageUserController.deletemanageUserService);

module.exports = router;