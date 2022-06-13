const express = require('express');
const b2bUsersController = require('../../controllers/B2BUser.Controller');
const router = express.Router();
const cookieparser = require('cookie-parser');

router.post('/', b2bUsersController.createB2bUsers);
router.post('/login', b2bUsersController.B2bUsersLogin);
router.get('/logout', b2bUsersController.B2bUsersLogout);

router.post('/user/login', b2bUsersController.B2bUsersAdminLogin);
router.route('/metauser/create').post(b2bUsersController.createmetauser).get(b2bUsersController.getAllMetaUser);
router
  .route('/metauser/:id')
  .get(b2bUsersController.getusermetaDataById)
  .put(b2bUsersController.updateMetaUsers)
  .delete(b2bUsersController.deleteMetaUser);
module.exports = router;
