const express = require('express');
const router = express.Router();
const shopregister = require('../../controllers/shopregister.controller');
const authorization = require('../../controllers/tokenVerify.controller');
router.route('/regiter').post(shopregister.register_shop);

module.exports = router;
