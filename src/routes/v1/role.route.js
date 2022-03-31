const express = require('express');
const roleController = require('../../controllers/roles.controller');

const router = express.Router();

router.route('/').post(roleController.createRoles).get(roleController.getAllRoles);
router
  .route('/:roleId')
  .get(roleController.getRoleById)
  .delete(roleController.deletRoleById)
  .put(roleController.updateRolesById);

module.exports = router;
