const express = require('express');
const postConroller = require('../../controllers/postorder.controller');
const router = express.Router();

router.route('/').post(postConroller.createpostorder).get(postConroller.getallPostOrder);

router.route('/:id').get(postConroller.getPostOrderById).put(postConroller.updatePostorderById);
module.exports = router;
