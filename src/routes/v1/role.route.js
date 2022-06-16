const express = require('express');
const roleController = require('../../controllers/roles.controller');
const authorization = require('../../controllers/tokenVerify.controller');

const router = express.Router();
router.route("/usermenus").get(authorization,roleController.getusermenus)
router.route('/').post(roleController.createRoles).get(roleController.getAllRoles);
router
  .route('/:roleId')
  .get(roleController.getRoleById)
  .delete(roleController.deletRoleById)
  .put(roleController.updateRolesById);
router.route('/admin/wh').get(roleController.mainWarehouseRoles)

module.exports = router;
