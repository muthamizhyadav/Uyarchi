const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
let currentDate = moment().format('DD-MM-YYYY');
const { Shop } = require('../models/b2b.ShopClone.model');
const { ShopOrderClone } = require('../models/shopOrder.model');
const { ProductorderClone } = require('../models/shopOrder.model');
const wardAdminGroup = require('../models/b2b.wardAdminGroup.model');
const wardAdminGroupDetails = require('../models/b2b.wardAdminGroupDetails.model');

const createGroup = async (body) => {

  let serverdates = moment().format('YYYY-MM-DD');
  let servertime = moment().format('hh:mm a');
  const group = await wardAdminGroup.find({ assignDate: serverdates  });

  let center = '';

  if (group.length < 9) {
    center = '0000';
  }
  if (group.length < 99 && group.length >= 9) {
    center = '000';
  }
  if (group.length < 999 && group.length >= 99) {
    center = '00';
  }
  if (group.length < 9999 && group.length >= 999) {
    center = '0';
  }
  let userId = '';
  let totalcount = group.length + 1;
  console.log(totalcount);
  userId = 'G' + center + totalcount;

  let values = { ...body, ...{ groupId: userId, assignDate: serverdates, assignTime:servertime} };
  body.Orderdatas.forEach(async (e) => {
   let productId = e._id
    await ShopOrderClone.findByIdAndUpdate({ _id:productId }, { status: "Assigned" }, { new: true });
  });
  let wardAdminGroupcreate = await wardAdminGroup.create(values);
  return wardAdminGroupcreate;
};

const updateOrderStatus = async (id, status) => {
  let deliveryStatus = await wardAdminGroup.findById(id);
  console.log(deliveryStatus);
  if (!deliveryStatus) {
    throw new ApiError(httpStatus.NOT_FOUND, 'status not found');
  }
  deliveryStatus = await wardAdminGroup.findByIdAndUpdate({ _id: id }, { status: status }, { new: true });
  console.log(deliveryStatus);
  return deliveryStatus;
};

// GET ORDER DETAILS FROM GROUP BY ID

const getOrderFromGroupById = async (id) => {
  let getDetails = await wardAdminGroup.findById(id);
  return getDetails;
};



const getPettyStock = async (id) => {
  let values = await wardAdminGroup.aggregate([
    {
      $match: {
        _id: { $eq: id },
      },
    },
    { $unwind: "$Orderdatas" },
    { $group : {
        _id : "$Orderdatas.",
        "Total quantity sum" : {$sum : "$arrlstdetails.quantity"}
    }}
  ]);
  // console.log(values);
  return values;
};



const getGroupdetails = async () => {
  return wardAdminGroup.find();
};

// GET ASSIGN DATA BY DEVIVERY EXECUTIVE NAME

  const getstatus = async (id)=>{
    let details = await wardAdminGroup.aggregate([

      {
        $match: {
          $and: [
            {deliveryExecutiveId: { $eq: id }},
          {status: { $eq: "Assigned" }},
          ]
        },
      },
    //   {
    //     $lookup:{
    //       from: 'wardadmingroups',
    //       localField: 'deliveryExecutiveId',
    //       foreignField: 'deliveryExecutiveId',
    //       as: 'deliveryExecutiveStatus'
    //     }
    //   },
    //  {$unwind : '$deliveryExecutiveStatus'},
    //  {
    //   $project:{
    //     groupId: '$deliveryExecutiveStatus.groupId',
    //     assignTime: '$deliveryExecutiveStatus.assignTime',
    //     assignDate: '$deliveryExecutiveStatus.assignDate',
    //     totalOrders: '$deliveryExecutiveStatus.totalOrders',
    //     status:1,
    //   }
    //  }

     
    ]);
    return details;
  }


  const getBillDetails = async(id)=>{
    let values = await wardAdminGroup.aggregate([
      {
        $match: {
          deliveryExecutiveId: { $eq: id },
        },
      },
      {
        $lookup: {
          from: 'shoporderclones',
          localField: 'deliveryExecutiveId',
          foreignField: 'deliveryExecutiveId',
          as: 'delivery',
        }
      },
      {
        $unwind : '$delivery'
      }



    ])
    return values;
  }

module.exports = {
  createGroup,
  updateOrderStatus,
  getOrderFromGroupById,

  getPettyStock,

  // group Details
  getGroupdetails,

  // DELEIVERY DETAILS
  // getDeliveryDetails,

  getstatus,
  getBillDetails,
};
