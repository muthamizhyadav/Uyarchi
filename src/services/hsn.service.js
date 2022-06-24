const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const HSN = require('../models/hns.mode');

const createHsn = async () => {
  return 'poi Vera vela iruntha paru';
};

const getAllHsn = async (page) => {
  return HSN.aggregate([
    {
      $sort: {
        HSN_Description: 1,
      },
    },
    { $skip: 20 * page },
    { $limit: 20 },
  ]);
};

module.exports = { getAllHsn, createHsn };
