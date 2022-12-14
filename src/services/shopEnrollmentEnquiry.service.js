const httpStatus = require('http-status');
const { ShopEnrollmentEnquiry, ShopEnrollmentEnquiryAssign} = require('../models/shopEnrollmentEnquiry.model');
const ApiError = require('../utils/ApiError');

const createEnquiry = async (userId, body) => {
    let value = {...body, ...{uid:userId}}
  return ShopEnrollmentEnquiry.create(value);
};

const getAllEnquiryDatas = async (pincode) => {

  let pincodematch = [{ active: { $eq: true } }];
    if(pincode != "null"){
        pincodematch = [{ pincode: { $eq: parseInt(pincode) } }];
    }
    const data = await ShopEnrollmentEnquiry.aggregate([
        {
            $match: {
              $and: pincodematch,
            },
        },
        {
            $lookup: {
              from: 'b2busers',
              localField: 'uid',
              foreignField: '_id',
              pipeline:[
                {
                    $lookup: {
                      from: 'roles',
                      localField: 'userRole',
                      foreignField: '_id',
                      as: 'rolesData',
                    },
                  },
                  {
                    $unwind: '$rolesData',
                  }, 
              ],
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
                name:"$b2busersData.name",
                createdBy:"$b2busersData.rolesData.roleName"
            }
          }    
    ]);
    return data;
  };

  const getEnquiryById = async (id) => {
    let values = await ShopEnrollmentEnquiry.findById(id);
    if (!values) {
      throw new ApiError(httpStatus.NOT_FOUND, 'ShopEnrollmentEnquiry Not Found');
    }
    return values;
  };

  const updateEnquiryById = async (id,updateBody) => {
    const {arr} = updateBody
    let data = await getEnquiryById.findById(id);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'ShopEnrollmentEnquiry Not Found');
    }
    data = await ShopEnrollmentEnquiry.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
    return data;
  };


  const AssignShops = async (body) => {
    const {arr, assignTo, status} = body
    arr.forEach(async (e) => {
        data = await ShopEnrollmentEnquiry.findByIdAndUpdate({ _id: e }, {status:status}, { new: true });
        await ShopEnrollmentEnquiryAssign.create({
          assignTo:assignTo,
          shopId: e,
          status:status,
        });
    })
    return {message:"Assignshops Completed"};
  };

  const pincode = async () => {
      const data = await ShopEnrollmentEnquiry.aggregate([
          {
            $group: {
              _id: {pincode:'$pincode'},
            },
          },
          {
            $project:{
                pincode:"$_id.pincode",
            }
          }
         ])
      return data
}



module.exports = {
    createEnquiry,
    getAllEnquiryDatas,
    updateEnquiryById,
    AssignShops,
    pincode,
};