const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const productpackType = require('../models/productPacktype.model')
const productHistory = require('../models/historyPackType.model')



const createproductpackTypeData = async (packTypeBody) => {
    const check = await productpackType.findOne({ productId: packTypeBody.productId, packtypeId: packTypeBody.packtypeId })
    if (!check) {
        return productpackType.create(packTypeBody);
    }
    else {
        return productpackType.findByIdAndUpdate({ _id: check._id }, packTypeBody, { new: true });
    }
};

// history productpacktype


const createHistoryproductpackTypeData = async (Body, productpack) => {
    let time = moment().format('HHmm');
    let date = moment().format('yyyy-MM-DD');
    let created = moment();
    let row = {
        timeBack: time,
        date: date,
        created: created,
        productPackId: productpack
    }
    let bodydata = { ...row, ...Body }
    return productHistory.create(bodydata);
};

const getproductpackTypeById = async (packTypeId) => {
    return productpackType.findById(packTypeId);
};

const getALLproductpackTypeById = async (page) => {
    let date = moment().format('yyyy-MM-DD');
    const value = await productpackType.aggregate([
        {
            $match: {
                $and: [{ show: { $eq: true } }],
            },
        },
        {
            $lookup: {
                from: 'historypacktypes',
                localField: '_id',
                foreignField: 'productPackId',
                pipeline: [
                    { $match: { date: date } },
                    {
                        $group: {
                            _id: null,
                            averageQuantity: { $avg: '$onlinePrice' },
                            minprice: { $min: '$onlinePrice' },
                            maxprice: { $max: '$onlinePrice' },
                        },
                    },
                ],
                as: 'historypacktypesData',
            },
        },
        {
            $unwind: "$historypacktypesData"
        },
        {
            $lookup: {
                from: 'products',
                localField: 'productId',
                foreignField: '_id',
                as: 'productsData',
            },
        },
        {
            $unwind: "$productsData"
        },
        {
            $lookup: {
                from: 'packtypes',
                localField: 'packtypeId',
                foreignField: '_id',
                as: 'packtypesData',
            },
        },
        {
            $unwind: "$packtypesData"
        },
        {
            $project: {
                onlinePrice: 1,
                salesstartPrice: 1,
                salesendPrice: 1,
                productId: 1,
                packtypeId: 1,
                show: true,
                productTitle: "$productsData.productTitle",
                image: "$productsData.image",
                unit: "$packtypesData.unit",
                quantity: "$packtypesData.quantity",
                material: "$packtypesData.material",

            }
        },

        {
            $skip: 10 * parseInt(page),
        },
        {
            $limit: 10,
        },]);
    const total = await productpackType.aggregate([
        {
            $match: {
                $and: [{ show: { $eq: true } }],
            },
        },
        {
            $lookup: {
                from: 'historypacktypes',
                localField: '_id',
                foreignField: 'productPackId',
                pipeline: [
                    { $match: { date: date } },
                    {
                        $group: {
                            _id: null,
                            averageQuantity: { $avg: '$onlinePrice' },
                            minprice: { $min: '$onlinePrice' },
                            maxprice: { $max: '$onlinePrice' },
                        },
                    },
                ],
                as: 'historypacktypesData',
            },
        },
        {
            $unwind: "$historypacktypesData"
        },
        {
            $lookup: {
                from: 'products',
                localField: 'productId',
                foreignField: '_id',
                as: 'productsData',
            },
        },
        {
            $unwind: "$productsData"
        },
        {
            $lookup: {
                from: 'packtypes',
                localField: 'packtypeId',
                foreignField: '_id',
                as: 'packtypesData',
            },
        },
        {
            $unwind: "$packtypesData"
        },
        {
            $project: {
                onlinePrice: 1,
                salesstartPrice: 1,
                salesendPrice: 1,
                productId: 1,
                packtypeId: 1,
                show: true,
                productTitle: "$productsData.productTitle",
                image: "$productsData.image",
                // packtypesData: "$packtypesData",
                unit: "$packtypesData.unit",
                quantity: "$packtypesData.quantity",
                material: "$packtypesData.material",

            }
        },]);

    return {
        value: value,
        total: total.length
    }
};

const getproductpackTypeshow = async (packTypeId) => {
    let data = await getproductpackTypeById(packTypeId);
    if (!data) {
        throw new ApiError(httpStatus.NOT_FOUND, 'productPacktype not found');
    }
    let show = !data.show;
    Manage = await productpackType.findByIdAndUpdate({ _id: packTypeId }, { show: show }, { new: true });
    return Manage;
};




const updateproductpackTypeId = async (packTypeId, updateBody) => {
    let Manage = await getproductpackTypeById(packTypeId);

    if (!Manage) {
        throw new ApiError(httpStatus.NOT_FOUND, 'productPacktype not found');
    }
    Manage = await productpackType.findByIdAndUpdate({ _id: packTypeId }, updateBody, { new: true });
    return Manage;
};

const deleteproductPackTypeById = async (packTypeId) => {
    const Manage = await getproductpackTypeById(packTypeId);
    if (!Manage) {
        throw new ApiError(httpStatus.NOT_FOUND, 'productPacktype not found');
    }
    (Manage.active = false), (Manage.archive = true), await Manage.save();
    return Manage;
};

module.exports = { deleteproductPackTypeById, updateproductpackTypeId, getproductpackTypeById, createproductpackTypeData, createHistoryproductpackTypeData, getproductpackTypeshow, getALLproductpackTypeById };