const express = require('express');
const telecallerAssignController = require('../../controllers/telecallerAssign.controller');
const router = express.Router();

router.route('/').post(telecallerAssignController.createtelecallerAssignReassign);

module.exports = router;