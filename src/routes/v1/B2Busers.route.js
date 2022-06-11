const express = require('express');
const b2bUsersController = require('../../controllers/B2BUser.Controller');
const router = express.Router();

router.post('/', b2bUsersController.createB2bUsers);
router.post('/login', b2bUsersController.B2bUsersLogin);
router.get('/logout', b2bUsersController.B2bUsersLogout);
module.exports = router;
