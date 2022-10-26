const httpStatus = require('http-status');
const videoUploadService = require('../models/videoUpload.model');
const moment = require('moment');
const createVideoUpload = async (body) => {
  let values = { ...body, ...{ created: moment() } };
  let shopfind = await videoUploadService.findOne({ shopId: body.shopId });
  if (shopfind.length > 0) {
    const update = await videoUploadService.findByIdAndUpdate({ _id: shopfind._id }, body, { new: true });
    return update;
  } else {
    const video = await videoUploadService.create(values);
    return video;
  }
};

module.exports = {
  createVideoUpload,
};
