const express = require('express');
const hsnController = require('../../controllers/hsn.controller');
const router = express.Router();

router.route('/getAllHsn/:page').get(hsnController.getAllHsn);
router.route('/').post(hsnController.createHsn);

module.exports = router;
