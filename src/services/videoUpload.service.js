const httpStatus = require('http-status');
const videoUploadService = require('../models/videoUpload.model');
const moment = require('moment');
const createVideoUpload = async (body) => {
  let values = { ...body, ...{ created: moment() } };
  const video = await videoUploadService.create(values);
  return video;
};

module.exports = {
  createVideoUpload,
};
