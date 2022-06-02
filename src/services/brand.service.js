const brand = require("../models/brand.model");

const createbrand = async (brandBody) => {
    return brand.create(brandBody);
};

const getbrand = async () => {
    return brand.find();
};


module.exports = {
    createbrand,
    getbrand
}