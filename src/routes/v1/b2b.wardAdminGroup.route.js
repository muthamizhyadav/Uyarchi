const express = require('express');
const wardAdminGroupController = require('../../controllers/b2b.wardAdminGroup.controller');
const router = express.Router();


router.route('/craeteGroupId').get(wardAdminGroupController.createGroupOrder);


module.exports = router;