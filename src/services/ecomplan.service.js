const httpStatus = require('http-status');
const { Streamplan, StreamPost } = require('../models/ecomplan.model');
const ApiError = require('../utils/ApiError');

const Date = require('./Date.serive')

const create_Plans = async (req) => {
    console.log(req.body)
    const value = await Streamplan.create(req.body)
    await Date.create_date(value)
    console.log(value);
    return value;
};

const get_all_Plans = async (req) => {
    let page = req.query.page == '' || req.query.page == null || req.query.page == null ? 0 : req.query.page;
    const value = await Streamplan.aggregate([
        { $sort: { DateIso: -1 } },
        { $skip: 10 * page },
        { $limit: 10 },
    ])
    return value;
};



const get_one_Plans = async (req) => {
    const value = await Streamplan.findById(req.query.id);
    return value;
};


const update_one_Plans = async (req) => {
    const value = await Streamplan.findByIdAndUpdate({ _id: req.query.id }, req.body, { new: true })
    return value;
};


const delete_one_Plans = async (req) => {
    await Streamplan.findByIdAndDelete({ _id: req.query.id });
    return { message: "deleted" };
};

const create_post = async (req) => {
    console.log(req.userId,"asdas",{...req.body,...{suppierId:req.userId}})
    const value = await StreamPost.create({...req.body,...{suppierId:req.userId}})
    await Date.create_date(value)
    return value;
};

const get_all_Post = async (req) => {
    let page = req.query.page == '' || req.query.page == null || req.query.page == null ? 0 : req.query.page;
    console.log(req.userId)
    const value = await StreamPost.aggregate([
        { $match: { $and: [{ suppierId: { $eq: req.userId } }] } },
        {
            $lookup: {
                from: 'products',
                localField: 'productId',
                foreignField: '_id',
                as: 'productName',
            },
        },
        // {
        //     $unwind: '$productName',
        // },
        {
            $lookup: {
                from: 'categories',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'categories',
            },
        },
        // {
        //     $unwind: '$categories',
        // },
        // categoryName
        { $sort: { DateIso: -1 } },
        { $skip: 10 * page },
        { $limit: 10 },
    ])
    return value;
};



const get_one_Post = async (req) => {
    const value = await StreamPost.findById(req.query.id);
    if (value.suppierId !=req.userId) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
      }
    return value;
};


const update_one_Post = async (req) => {
    const value = await StreamPost.findByIdAndUpdate({ _id: req.query.id, suppierId: req.userId }, req.body, { new: true })
    if (!value) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
      }
    return value;
};
const delete_one_Post = async (req) => {
    const value = await StreamPost.findByIdAndDelete({ _id: req.query.id, suppierId: req.userId });
    if (!value) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
      }
    return { message: "deleted" };
};

module.exports = {
    create_Plans,
    get_all_Plans,
    get_one_Plans,
    update_one_Plans,
    delete_one_Plans,
    create_post,
    get_all_Post,
    get_one_Post,
    update_one_Post,
    delete_one_Post
};
