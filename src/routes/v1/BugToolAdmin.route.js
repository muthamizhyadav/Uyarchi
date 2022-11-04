const express = require('express');
const BugToolAdminController = require('../../controllers/BugToolAdmin.controller');
const reportIssueImage = require('../../middlewares/reportIssue.image');
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
router.route('/createTesterissue').post(reportIssueImage.array('chooseImage'), BugToolAdminController.createTesterissue)
router.route('/getAllTesterIssues/:project/:category/:status').get(BugToolAdminController.getAllTesterIssues)
router.route('/getIdtesterissues/:id').get(BugToolAdminController.getIdtesterissues)
router.route('/updatetesterIssue/:id').put(BugToolAdminController.updatetesterIssue)
router.route('/login').post(BugToolAdminController.B2bUsersLogin)
module.exports = router;