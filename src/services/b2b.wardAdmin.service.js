const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { ShopOrderClone } = require('../models/shopOrder.model');
const { ProductorderClone } = require('../models/shopOrder.model')


// GET DETAILS

const getdetails = async (page) => {
    console.log(page)
    let values = await ShopOrderClone.aggregate([
        {
            $lookup: {
                from: 'b2bshopclones',
                localField: 'Uid', //Uid
                foreignField: 'Uid', //Uid
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
            $project: {
                shopId:1,
                shopType: '$userData.type',
                shopName: '$userData.SName',
                orderId : '$orderData.orderId',
                totalItems: {"$size":"$orderData"}

            }
        },
        { $skip: 10 * page },
        { $limit: 10 },
    ]);

                
    return  values;
}


// GET PRODUCT DETAILS


const getproductdetails = async (orderId) => {
    let getproduct = await ShopOrderClone.findById(orderId)
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



// UPDATE STATUS ACKNOWLEDGE


const updateAcknowledge = async (id) => {
    let acknowledge = await ShopOrderClone.findById(id);
    console.log(acknowledge);
    if (!acknowledge) {
        throw new ApiError(httpStatus.NOT_FOUND, 'acknowledge not found')
    }
    acknowledge = await ShopOrderClone.findByIdAndUpdate(
        { _id: id },
        { status: 'Acknowledge' },
        { new: true }
    )
    console.log(acknowledge)
    return acknowledge;
};


// UPDATE STATUS APPROVED


const updateApproved = async (id) => {
    let approved = await ShopOrderClone.findById(id);
    console.log(approved);
    if (!approved) {
        throw new ApiError(httpStatus.NOT_FOUND, 'approved not found')
    }
    approved = await ShopOrderClone.findByIdAndUpdate(
        { _id: id },
        { status: 'Approved' },
        { new: true }
    )
    console.log(approved);
    return approved;
}


//  UPDATE STATUS MODIFIED


const updateModified = async (id) => {
    let modified = await ShopOrderClone.findById(id);
    console.log(modified);
    if (!modified) {
        throw new ApiError(httpStatus.NOT_FOUND, 'modified not found')
    }
    modified = await ShopOrderClone.findByIdAndUpdate(
        { _id: id },
        { status: 'Modified' },
        { new: true }
    )
    console.log(modified)
    return modified;
}


//  UPDATE STATUS REJECTION

const updateRejected = async (id) => {
    let rejected = await ShopOrderClone.findById(id);
    console.log(rejected);
    if (!rejected) {
        throw new ApiError(httpStatus.NOT_FOUND, 'rejection not found')
    }
    rejected = await ShopOrderClone.findByIdAndUpdate(
        { _id: id },
        { status: 'Rejected' },
        { new: true },
    )
    console.log(rejected);
    return rejected;
}


//WARD LOADING EXECUTIVE


const wardloadExecutive = async (page) => {
    let data = await ShopOrderClone.aggregate([

        {
        $match: { 
            'status': { 
              $in: ['Approved','Modified'] 
            } 
          }
        },
        {
            $lookup: {
                from: 'b2bshopclones',
                localField: 'Uid', //Uid
                foreignField: 'Uid', //Uid
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
            $project: {
                shopId:1,
                status:1,
                shopType: '$userData.type',
                shopName: '$userData.SName',
                orderId : '$orderData.orderId',
            }
        },
        { $skip: 10 * page },
        { $limit: 10 },
        
    ])
    return data;
}

//  UPDATE PACKED STATUS FOR PRODUCT STATUS


    const updatePacked = async(id)=>{
        let productPacked = await ShopOrderClone.findById(id);
        if(!productPacked){
            throw new ApiError(httpStatus.NOT_FOUND, 'productPacked not found')
        }
        productPacked = await ShopOrderClone.findByIdAndUpdate(
            { _id: id},
            {productStatus: 'Packed'},
            { new: true}
        )
        console.log(productPacked);
        return productPacked;
    }

    // UPDATE ASSIGNED STATUS FOR PRODUCT STATUS

    const updateAssigned = async(id)=>{
        let productAssign = await ShopOrderClone.findById(id);
        if(!productAssign){
            throw new ApiError(httpStatus.NOT_FOUND, 'productAssigned not found')
        }
        productAssign = await ShopOrderClone.findByIdAndUpdate(
            { _id: id},
            {productStatus: 'Assigned'},
            { new: true}
        )
        console.log(productAssign);
        return productAssign;
    }


       // UPDATE BILLED STATUS FOR PRODUCT STATUS


       const updateBilled= async(id)=>{
        let productOrderBilled = await ShopOrderClone.findById(id);
        if(!productOrderBilled){
            throw new ApiError(httpStatus.NOT_FOUND, 'productOrderBilled not found')
        }
        productOrderBilled = await ShopOrderClone.findByIdAndUpdate(
            { _id: id},
            {productStatus: 'Billed'},
            { new: true}
        )
        console.log(productOrderBilled);
        return productOrderBilled;
    }



module.exports = {
    getdetails,
    getproductdetails,
    updateProduct,
    updateAcknowledge,
    updateApproved,
    updateModified,
    updateRejected,

    //WARD LOADING EXECUTIVE
    wardloadExecutive,
    updatePacked,
    updateAssigned,
    updateBilled,
}
