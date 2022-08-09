const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { ShopOrderClone } = require('../models/shopOrder.model');
const { ProductorderClone } = require('../models/shopOrder.model');
const { Shop } = require('../models/b2b.ShopClone.model');
const {Users} = require('../models/B2Busers.model');
const Roles = require('../models/roles.model');


// GET DETAILS

const getdetails = async (page) => {
    console.log(page)
    let values = await ShopOrderClone.aggregate([
        {
            $lookup: {
                from: 'b2bshopclones',
                localField: 'shopId', //Uid
                foreignField: '_id', //Uid
                as: 'userData',
            },
        },
        {
            $unwind: '$userData'
        },
        {
            $lookup: {
                from: 'productorderclones',
                localField: '_id',
                foreignField: 'orderId',
                as: 'orderData',
            }
        },
       {
        $lookup: {
            from: 'b2busers',
            localField: 'Uid',
                foreignField: '_id',
                as: 'userNameData',
        }

       },
    //    { unwind: '$userNameData'},

        {
            $project: {
                shopId: 1,
                OrderId:1,
                status:1,
                overallTotal:1,
                name : '$userNameData.name',

                shopType: '$userData.type',
                shopName: '$userData.SName',
                // UserName: '$userData.name',
                // orderId: '$orderData.orderId',
                totalItems: { "$size": "$orderData" }

            }
        },
        { $skip: 10 * page },
        { $limit: 10 },
    ]);

    let total = await ShopOrderClone.aggregate([

        {
            $lookup: {
                from: 'b2bshopclones',
                localField: 'shopId', //Uid
                foreignField: '_id', //Uid
                as: 'userData',
            },
        },
        {
            $unwind: '$userData'
        },
        {
            $lookup: {
                from: 'productorderclones',
                localField: '_id',
                foreignField: 'orderId',
                as: 'orderData',
            }
        },
       {
        $lookup: {
            from: 'b2busers',
            localField: 'Uid',
                foreignField: '_id',
                as: 'userNameData',
        }

       },


    ])


    return {values: values, total: total.length }
}


// GET PRODUCT DETAILS


const getproductdetails = async (id) => {
    let getproduct = await ShopOrderClone.findById(id)
    return getproduct
}

// UPDATE PRODUCT DETAILS

const updateProduct = async (id, updateBody) => {
    let product = await ProductorderClone.findById(id);
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'product not found');
    }
    product = await ProductorderClone.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
    return product;
}

//  UPDATE STATUS REJECTION

const updateRejected = async (id, status) => {
    let rejected = await ShopOrderClone.findById(id);
    console.log(rejected);
    if (!rejected) {
        throw new ApiError(httpStatus.NOT_FOUND, ' not found')
    }
    rejected = await ShopOrderClone.findByIdAndUpdate(
        { _id: id },
        { status: status },
        { new: true },
    )
    console.log(rejected);
    return rejected;
}


//WARD LOADING EXECUTIVE


const wardloadExecutive = async (page) => {

    let data = await ShopOrderClone.aggregate([

        {
            $lookup: {
                from:'b2bshopclones',
                localField:'shopId', //Uid
                foreignField:'_id', //Uid
                as: 'b2bshopclonesData',
            },
        },
        {
            $unwind: '$b2bshopclonesData'
        },
        {

            $match: {
              $or: [{ status: { $eq: 'Approved' }},{ status: { $eq: 'Modified' }}, { status: { $eq: 'Packed' }}],
            }
        },
       
        {
            $project: {
                shopId: 1,
                status: 1,
                OrderId:1,
                SName:"$b2bshopclonesData.SName",
                type:"$b2bshopclonesData.type", 
            }
        },
        { $skip: 10 * page },
        { $limit: 10 },

    ]);

    let total = await ShopOrderClone.aggregate([
        {
            $lookup: {
                from:'b2bshopclones',
                localField:'shopId', //Uid
                foreignField:'_id', //Uid
                as: 'b2bshopclonesData',
            },
        },
        {
            $unwind: '$b2bshopclonesData'
        },
        {

            $match: {
              $or: [{ status: { $eq: 'Approved' }},{ status: { $eq: 'Modified' }}, { status: { $eq: 'Packed' }}],
            }
        },
       
        {
            $project: {
                shopId: 1,
                status: 1,
                OrderId:1,
                SName:"$b2bshopclonesData.SName",
                type:"$b2bshopclonesData.type", 
            }
        },
    ])
    return {data: data , total: total.length};
}


// TRACK STATUS FOR PRODUCT STATUS
const updateBilled = async (id, status) => {
    let productOrderBilled = await ShopOrderClone.findById(id);
    if (!productOrderBilled) {
        throw new ApiError(httpStatus.NOT_FOUND, 'productOrderBilled not found')
    }
    productOrderBilled = await ShopOrderClone.findByIdAndUpdate(
        { _id: id },
        { status: status },
        { new: true }
    )
    console.log(productOrderBilled);
    return productOrderBilled;
}

// AFTER PACKED BY WARD LOADING EXECUTE


const wardloadExecutivePacked = async (page) => {
    let data = await ShopOrderClone.aggregate([
        {
            $match: {
                status:{
                    $in: ['Packed']
                }
            }
        },

        {
            $lookup: {
                from: 'b2bshopclones',
                localField: 'shopId',
                foreignField: '_id',
                as: 'shopData',
            }
        },
        { $unwind: '$shopData' },
        {
            $lookup: {
                from: 'streets',
                localField: 'shopData.Strid',
                foreignField: '_id',
                as: 'streetsData',
            }
        },
        { $unwind: '$streetsData'},

        {
            $lookup: {
                from: 'productorderclones',
                localField: '_id',
                foreignField: 'orderId',
                pipeline: [
                    { $group: { _id: null, Qty: { $sum: '$quantity' }, } },
                ],
                as: 'orderData',
            }
        },
        { $unwind: '$orderData' },
        {
            $lookup: {
                from: 'productorderclones',
                localField: '_id',
                foreignField: 'orderId',
                as: 'orderDatafortotal',
            }
        },
       
        {
            $project: {
                _id:1,
                date:1,
                time:1,
                productStatus:1,
                status:1,
                OrderId:1,
                type: '$shopData.type',
                street: '$streetsData.street',
                // orderId: '$orderDatafortotal.orderId',
                // orderDate: '$orderDatafortotal.date',
                // orderTime: '$orderDatafortotal.time',
                totalItems: { $size: "$orderDatafortotal" },
                Qty: "$orderData.Qty",
                // totalcount: '$orderData.totalItems'
            }
        },
        { $skip: 10 * page },
        { $limit: 10 },
    ]);

    let total = await ShopOrderClone.aggregate([
        {
            $match: {
                status:{
                    $in: ['Packed']
                }
            }
        },

        {
            $lookup: {
                from: 'b2bshopclones',
                localField: 'shopId',
                foreignField: '_id',
                as: 'shopData',
            }
        },
        { $unwind: '$shopData' },
        {
            $lookup: {
                from: 'streets',
                localField: 'shopData.Strid',
                foreignField: '_id',
                as: 'streetsData',
            }
        },
        { $unwind: '$streetsData'},

        {
            $lookup: {
                from: 'productorderclones',
                localField: '_id',
                foreignField: 'orderId',
                pipeline: [
                    { $group: { _id: null, Qty: { $sum: '$quantity' }, } },
                ],
                as: 'orderData',
            }
        },
        { $unwind: '$orderData' },
        {
            $lookup: {
                from: 'productorderclones',
                localField: '_id',
                foreignField: 'orderId',
                as: 'orderDatafortotal',
            }
        },

    ])
    return {data:data, total: total.length};
}


const wardDeliveryExecutive = async ()=>{
    let data = await Roles.aggregate([
        {
            $match: {
                roleName:{
                    $in: ["Ward delivery execute(WDE)"]
                }
            }
        },
        {
            $lookup:{
                from: 'b2busers',
                localField: '_id',
                foreignField: 'userRole',
                as: 'deliveryExecutiveName',
            }
        },

        {
            $project: {
                roleName:1,
                deliveryExecutiveName: '$deliveryExecutiveName.name',
            }
        }
    ])
    return data;
}




module.exports = {
    getdetails,
    getproductdetails,
    updateProduct,
    // updateAcknowledge,
    // updateApproved,
    // updateModified,
    updateRejected,

    //WARD LOADING EXECUTIVE
    wardloadExecutive,
    updateBilled,


    wardloadExecutivePacked,

    wardDeliveryExecutive,
}
