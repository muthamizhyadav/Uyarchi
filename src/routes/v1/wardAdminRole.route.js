const express = require('express');
const wardAdminRoleController = require('../../controllers/wardAdminRole.controller');
const router = express.Router();

router.route('/').post(wardAdminRoleController.createwardAdminRoleService).get(wardAdminRoleController.getAllwardAdminRole);
router.route('/getAllData/:id').get(wardAdminRoleController.getDataById)
router.route('/createwardAdminRoleAsm/data').post(wardAdminRoleController.createwardAdminRoleAsmService)
router.route('/data/:id').get(wardAdminRoleController.getAllWardAdminRoleData)
router.route('/smData/data').get(wardAdminRoleController.smData)
module.exports = router;