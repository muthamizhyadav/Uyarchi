const brand = require("../models/brand.model");

const createbrand = async (brandBody) => {
    return brand.create(brandBody);
};

const getbrand = async () => {
    return brand.find();
};

const getBrandById = async (id) => {
    const category = brand.findById(id);
    if (!category) {
      throw new ApiError(httpStatus.NOT_FOUND, 'brand Not Found');
    }
    return category;
  };

  const updateBrandById = async (brandId, updateBody) => {
    let cate = await getBrandById(brandId);
    if (!cate) {
      throw new ApiError(httpStatus.NOT_FOUND, 'brand not found');
    }
    cate = await brand.findByIdAndUpdate({ _id: brandId }, updateBody, { new: true });
    return cate;
  };

module.exports = {
    createbrand,
    getbrand,
    getBrandById,
    updateBrandById

}