const httpStatus = require('http-status');
const { ShopEnrollmentEnquiry, ShopEnrollmentEnquiryAssign} = require('../models/shopEnrollmentEnquiry.model');
const {Shop} = require('../models/b2b.ShopClone.model');
const Supplier = require('../models/supplier.model');
const ApiError = require('../utils/ApiError');
const moment = require('moment');

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


const viewdatagetById = async (id) =>{
    const data = await ShopEnrollmentEnquiryAssign.aggregate([
        {
            $match: {
              $and: [{ assignTo: { $eq:id} }],
            },
        },

        {
            $lookup: {
              from: 'enrollmentenquiryshops',
              localField: 'shopId',
              foreignField: '_id',
              as: 'enrollmentenquiryshops',
            },
          },
          {
            $unwind: '$enrollmentenquiryshops',
          },
          {
            $project:{
                assignTo:1,
                shopName:"$enrollmentenquiryshops.shopName",
                status:"$enrollmentenquiryshops.status",
                area:"$enrollmentenquiryshops.area",
                pincode:"$enrollmentenquiryshops.pincode",
                mobileNumber:"$enrollmentenquiryshops.mobileNumber",
                shopType:"$enrollmentenquiryshops.shopType",
                shopId:"$enrollmentenquiryshops._id",
            }
          }

       ])
    return data
}

const createShops = async (body) =>{
    let servertime = moment().format('HHmm');
    let createdtime = moment().format('hh:mm a');
    let serverdate = moment().format('DD-MM-yyy');
    let filterDate = moment().format('yyy-MM-DD');
    let values = {
      ...body,
      ...{ date: serverdate, time: servertime, filterDate: filterDate, status: 'Pending', created: createdtime },
    };
    const shop = await Shop.create(values);
    return shop;
}

const getAllSupplierDatas = async () =>{
    const data = await Supplier.find({active:true});
    return data
}


const getIdEnquiryShops = async (id) =>{
    const data = await ShopEnrollmentEnquiry.aggregate([
        {
            $match: {
              $and: [{ _id: { $eq:id} }],
            },
        },
        {
            $lookup: {
              from: 'shoplists',
              localField: 'shopType',
              foreignField: '_id',
              as: 'shoplists',
            },
          },
          {
            $unwind: '$shoplists',
          },
          {
            $project:{
                date:1,
                time:1,
                status:1,
                shopName:1,
                shopType:1,
                mobileNumber:1,
                area:1,
                contactName:1,
                pincode:1,
                uid:1,
                shopTypeName:"$shoplists.shopList",
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
    viewdatagetById,
    createShops,
    getAllSupplierDatas,
    getIdEnquiryShops,
};