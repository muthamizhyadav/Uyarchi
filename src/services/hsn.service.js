const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const HSN = require('../models/hns.mode');

const createHsn = async () => {
  return 'poi Vera vela iruntha paru';
};

const getAllHsn = async (key) => {
  let text = await key.toUpperCase();
//   console.log(text)
  return HSN.aggregate([
    {
      $sort: {
        HSN_Description: 1,
      },
    },
    {
      $match: {
        $or: [{ HSN_Description: { $regex: text } }],
      },
    },
    { $limit: 500 },
  ]);
};

module.exports = { getAllHsn, createHsn };
