const express = require('express');
const BusinessUsersController = require('../../controllers/manageBusiness.Users.controller');
const BusinessUsersUpload = require('../../middlewares/bUsers');

const router = express.Router();

router
  .route('/')
  .post(
    BusinessUsersUpload.fields([{ name: 'idproof' }, { name: 'addsproof' }, { name: 'biodata' }]),
    BusinessUsersController.createBusinessUsers
  )
  .get(BusinessUsersController.getAllBusinessUsers);

  router.route('/superAdmin').post(BusinessUsersUpload.fields([{ name: 'idproof' }, { name: 'addsproof' }, { name: 'biodata' }]), BusinessUsersController.createSuperAdminwardAssign)
router
  .route('/manageBusinessUsers/:BUId')
  .put(BusinessUsersUpload.fields([{ name: 'idproof' }, { name: 'addsproof' }, { name: 'biodata' }]), BusinessUsersController.updateBusinessUsers)
  .delete(BusinessUsersController.deleteBusinessUsers)
  .get(BusinessUsersController.getBusinessUsersById)
router.route('/sixRoles').get(BusinessUsersController.getSixRoles)
module.exports = router;
