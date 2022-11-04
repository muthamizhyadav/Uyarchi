const express = require('express');
const BugToolAdminController = require('../../controllers/BugToolAdmin.controller');
const router = express.Router();

router.route('/').post(BugToolAdminController.createBugToolAdminService).get(BugToolAdminController.getAll);
router.route('/addproject').post(BugToolAdminController.createAdminAddproject).get(BugToolAdminController.getAllProject);
router.route('/updateProject/:id').put(BugToolAdminController.updateByProjectId)
router.route('/updateUser/:id').put(BugToolAdminController.updateByUserId)
router.route('/deleteUser/:id').delete(BugToolAdminController.deleteUserById)
router.route('/deleteProject/:id').delete(BugToolAdminController.deleteProjectById)
router.route('/BugToolusersAndId/:id').get(BugToolAdminController.BugToolusersAndId)
router.route('/getAllprojectById/:id').get(BugToolAdminController.getAllprojectById)
router.route('/getAlluserById/:id').get(BugToolAdminController.getAlluserById)
module.exports = router;