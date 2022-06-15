const express = require('express');
const b2bUsersController = require('../../controllers/B2BUser.Controller');
const router = express.Router();
const cookieparser = require('cookie-parser');

router.post('/', b2bUsersController.createB2bUsers)
router.get('/All',b2bUsersController.getAllUsers)
router.post('/login', b2bUsersController.B2bUsersLogin);
router.get('/logout', b2bUsersController.B2bUsersLogout);

router.post('/shopOrder/login', b2bUsersController.B2bUsersAdminLogin);

// metaUser Route
router.route('/meta/user').post(b2bUsersController.createMetaUSers);
router
  .route('/metauser/:id')
  .get(b2bUsersController.getusermetaDataById)
  .put(b2bUsersController.updateMetaUsers)
  .delete(b2bUsersController.deleteMetaUser);
module.exports = router;
