const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const videoUploadService = require('../services/videoUpload.service');

const createVideoUpload = catchAsync(async (req, res) => {
  const video = await videoUploadService.createVideoUpload(req.body);
  if (req.files) {
    req.files.forEach(function (files, index, arr) {
      video.video.push('images/video/' + files.filename);
    });
  }
  res.send(video);
  await video.save();
});

module.exports = {
  createVideoUpload,
};
