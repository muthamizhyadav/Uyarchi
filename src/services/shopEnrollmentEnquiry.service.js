const httpStatus = require('http-status');
const { ShopEnrollmentEnquiry } = require('../models/shopEnrollmentEnquiry.model');
const ApiError = require('../utils/ApiError');

const createEnquiry = async (body) => {
  return ShopEnrollmentEnquiry.create(body);
};

const getAllEnquiryDatas = async () => {
    const data = await ShopEnrollmentEnquiry.aggregate([
        {
            $lookup: {
              from: 'b2busers',
              localField: 'uid',
              foreignField: '_id',
              as: 'b2busersData',
            },
          },
          {
            $unwind: '$b2busersData',
          },   
          {
            $project:{
                date:1,
                time:1,
                shopType:1,
                shopName:1,
                mobileNumber:1,
                area:1,
                contactName:1,
                pincode:1,
                status:1,
                uid:1,
                name:"$b2busersData.name"
            }
          }    
    ]);
    return data;
  };

module.exports = {
    createEnquiry,
    getAllEnquiryDatas,
};