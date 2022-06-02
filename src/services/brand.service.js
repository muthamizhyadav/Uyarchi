const brand = require("../models/brand.model");

const createbrand = async (brandBody) => {
    return brand.create(brandBody);
};

const getbrand = async () => {
    // return brand.find()
    return brand.aggregate([
        {
            $lookup: {
                from: 'categories',
                pipeline: [],
                as: 'categorydata',
            },
        },
        {
            $unwind: "$categorydata"
        },
        {
            $lookup: {
                from: 'subcategories',
                localField: 'category',
                foreignField: 'parentCategoryId',
                as: 'subcategorydata',
            },
        },
        {
            $unwind: "$subcategorydata"
        },
        {
            $project: {
                _id: 1,
                brandname: 1,
                subcategory: "$subcategorydata.subcategoryName",
                category: "$categorydata.categoryName",
                image: 1
            }
        }
    ])
};

const getBrandById = async (id) => {
    console.log(id)
    const brands = await brand.aggregate([
        {
            $match: {
                $and: [{ _id: { $eq: id } }],
            },
        },
        {
            $lookup: {
                from: 'categories',
                pipeline: [],
                as: 'categorydata',
            },
        },
        {
            $lookup: {
                from: 'subcategories',
                localField: 'category',
                foreignField: 'parentCategoryId',
                as: 'subcategorydata',
            },
        },

    ])
    if (brands.length == 0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'brand not found');
    }
    
    return brands[0];

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