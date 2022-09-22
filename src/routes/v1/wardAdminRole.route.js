const express = require('express');
const wardAdminRoleController = require('../../controllers/wardAdminRole.controller');
const router = express.Router();

router.route('/').post(wardAdminRoleController.createwardAdminRoleService).get(wardAdminRoleController.getAllwardAdminRole);
router.route('/:id').get(wardAdminRoleController.getDataById)

module.exports = router;