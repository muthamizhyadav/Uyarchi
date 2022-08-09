const reName = require('../models/b2b.redirect.model');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const createRename = async (body) => {
  let rename = await reName.create(body);
  return rename;
};

module.exports = {
  createRename,
};
