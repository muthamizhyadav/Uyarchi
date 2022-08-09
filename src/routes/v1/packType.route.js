const express = require('express');
const packTypeController = require('../../controllers/packType.controller');

const router = express.Router();

router.route('/').post(packTypeController.createpack).get(packTypeController.getallPack);
router
  .route('/:id')
  .get(packTypeController.getpackrById)
  .delete(packTypeController.deletepack)
  .put(packTypeController.updatepackById);

module.exports = router;