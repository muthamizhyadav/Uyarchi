const express = require('express');
const telecallerAssignController = require('../../controllers/telecallerAssign.controller');
const router = express.Router();
// telecallerheadAssings
router.route('/createtelecallerAssignReassign').post(telecallerAssignController.createtelecallerAssignReassign);

router.route('/getAllTelecallerHead').get(telecallerAssignController.getAllTelecallerHead);
router.route('/getUnassignedtelecaller/:page').get(telecallerAssignController.getUnassignedtelecaller);
router.route('/gettelecallerheadTelecallerdata/:id').get(telecallerAssignController.gettelecallerheadTelecallerdata);

//telecallerShops
router.route('/createTelecallerShop').post(telecallerAssignController.createTelecallerShop);
router.route('/getAllTelecaller').get(telecallerAssignController.getAllTelecaller);
router.route('/getTelecallerAssignedShops/:id').get(telecallerAssignController.getTelecallerAssignedShops);
router.route('/getnotAssignShops/:id/:page/:limit/:uid/:date').get(telecallerAssignController.getnotAssignShops);
router.route('/getUsersWith_skiped/:id').get(telecallerAssignController.getUsersWith_skiped);
router.route('/Return_Assign_To_telecaller/:id').get(telecallerAssignController.Return_Assign_To_telecaller);
router.route('/createtemperaryAssigndata').post(telecallerAssignController.createtemperaryAssigndata);
router.route('/getAssignData_by_Telecaller/:page').get(telecallerAssignController.getAssignData_by_Telecaller);

// report
router.route('/assignShopsTelecaller/:id/:page').get(telecallerAssignController.assignShopsTelecaller);
router.route('/assignShopsTelecallerdatewise/:id/:wardid/:page').get(telecallerAssignController.assignShopsTelecallerdatewise);
router.route('/assignShopsOnlydatewise/:id/:wardid/:page').get(telecallerAssignController.assignShopsOnlydatewise);

module.exports = router;