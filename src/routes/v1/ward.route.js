const express = require('express');
const wardController = require('../../controllers/ward.controller')


const router = express.Router();

router
.route('/')
.post(wardController.createWard)

router.route('/:wardId')
.get(wardController.getward)
.put(wardController.updateward)
.delete(wardController.deleteWard);

module.exports = router;