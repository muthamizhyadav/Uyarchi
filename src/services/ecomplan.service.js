const httpStatus = require('http-status');
const { Streamplan } = require('../models/ecomplan.model');
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
    let page =req.query.page=='' || req.query.page ==null || req.query.page ==null?0:req.query.page;
    const value = await Streamplan.aggregate([
        {$sort:{DateIso:-1}},
        { $skip: 10 * page },
        { $limit: 10 },
    ])
    return value;
};


module.exports = {
    create_Plans,
    get_all_Plans
};
