const express = require('express');
const wardAdminGroupController = require('../../controllers/b2b.wardAdminGroup.controller');
const router = express.Router();


router.route('/craeteGroupId').post(wardAdminGroupController.createGroupOrder);

// router.route('/groupId').post(wardAdminGroupController.createGroupId)


module.exports = router;