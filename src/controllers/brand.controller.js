
const brand = require("../services/brand.service")
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createbrand = catchAsync(async (req, res) => {
    const { body } = req;
    console.log(body)
    const brands = await brand.createbrand(body);
    if (req.files) {
        let path = '';
        req.files.forEach(function (files, index, arr) {
            path = 'images/brands/' + files.filename;
        });
        brands.image = path;
    }
    await brands.save();

    res.status(httpStatus.CREATED).send(brands);
});


const getbrand = catchAsync(async (req, res) => {
    const brands = await brand.getbrand(req.body);
    if (!brands) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Assign Not Fount');
    }
    res.status(httpStatus.CREATED).send(brands);
})


const getBrandServicebyId = catchAsync(async (req, res) => {
    const business = await brand.getBrandById(req.params.brandId);
    // if (!business || !business.active === true) {
    //   throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
    // }
    res.send(business);
  });

  const updateShop = catchAsync(async (req, res) => {
    const brands = await brand.updateBrandById(req.params.brandId, req.body);
    if (req.files) {
        let path = '';
        req.files.forEach(function (files, index, arr) {
            path = 'images/brands/' + files.filename;
        });
        brands.image = path;
    }
    res.send(brands);
  });


module.exports = {
    createbrand,
    getbrand,
    getBrandServicebyId,
    updateShop
}