const express = require('express');
const wardAdminRoleController = require('../../controllers/wardAdminRole.controller');
const router = express.Router();

router.route('/').post(wardAdminRoleController.createwardAdminRoleService)
router.route('/:date').get(wardAdminRoleController.getAllwardAdminRole);
router.route('/getAllData/:id').get(wardAdminRoleController.getDataById)
router.route('/createwardAdminRoleAsm/data').post(wardAdminRoleController.createwardAdminRoleAsmService)
router.route('/data/:id').get(wardAdminRoleController.getAllWardAdminRoleData)
router.route('/smData/data/:date').get(wardAdminRoleController.smData)
router.route('/totalChange/:id').put(wardAdminRoleController.total)
router.route('/createAsmSamesman').post(wardAdminRoleController.createAsmSalesman)
router.route('/getAllSalesmanData/:id').get(wardAdminRoleController.allAsmSalesmanData)
router.route('/getAllAssignReassign/:id').get(wardAdminRoleController.getAllAssignReassignData)
router.route('/createSalesmanShop').post(wardAdminRoleController.createSalesmanShop)
router.route('/data/getAllAssignSalesmanShopData/data/:id').get(wardAdminRoleController.getAllAssignSalesmanShopData)
router.route('/getAllSalesMandataCurrentdate/:id').get(wardAdminRoleController.getAllSalesMandataCurrentdate)
router.route('/createwithoutoutAsmSalesman').post(wardAdminRoleController.createwithoutoutAsmSalesman)
router.route('/withoutoutAsmSalesmanCurrentDate/:id').get(wardAdminRoleController.withoutoutAsmSalesmanCurrentDate)
router.route('/withoutoutAsmSalesman/data/:date').get(wardAdminRoleController.withoutoutAsmSalesman)
module.exports = router;