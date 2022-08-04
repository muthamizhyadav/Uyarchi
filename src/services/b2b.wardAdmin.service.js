const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { ShopOrderClone } = require('../models/shopOrder.model');
const { ProductorderClone } = require('../models/shopOrder.model');
const { Shop } = require('../models/b2b.ShopClone.model');

// GET DETAILS

const getdetails = async (page) => {
  console.log(page);
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
      $unwind: '$userData',
    },
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'orderId',
        as: 'orderData',
      },
    },

<<<<<<< HEAD
        {
            $project: {
                shopId: 1,
                shopType: '$userData.type',
                shopName: '$userData.SName',
                // orderId: '$orderData.orderId',
                totalItems: { "$size": "$orderData" }

            }
        },
        { $skip: 10 * page },
        { $limit: 10 },
    ]);


    return values;
}
=======
    {
      $project: {
        shopId: 1,
        shopType: '$userData.type',
        shopName: '$userData.SName',
        orderId: '$orderData.orderId',
        totalItems: { $size: '$orderData' },
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
>>>>>>> 1e9f5d4571eb66a05a345ff2233782e84a52b17c

  return values;
};

// GET PRODUCT DETAILS

const getproductdetails = async (orderId) => {
  let getproduct = await ShopOrderClone.findById(orderId);
  return getproduct;
};

// UPDATE PRODUCT DETAILS

const updateProduct = async (id, updateBody) => {
  let product = await ProductorderClone.findById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'product not found');
  }
  product = await ProductorderClone.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return product;
};

// UPDATE STATUS ACKNOWLEDGE

// const updateAcknowledge = async (id) => {
//     let acknowledge = await ShopOrderClone.findById(id);
//     console.log(acknowledge);
//     if (!acknowledge) {
//         throw new ApiError(httpStatus.NOT_FOUND, 'acknowledge not found')
//     }
//     acknowledge = await ShopOrderClone.findByIdAndUpdate(
//         { _id: id },
//         { status: 'Acknowledge' },
//         { new: true }
//     )
//     console.log(acknowledge)
//     return acknowledge;
// };

// UPDATE STATUS APPROVED

// const updateApproved = async (id) => {
//     let approved = await ShopOrderClone.findById(id);
//     console.log(approved);
//     if (!approved) {
//         throw new ApiError(httpStatus.NOT_FOUND, 'approved not found')
//     }
//     approved = await ShopOrderClone.findByIdAndUpdate(
//         { _id: id },
//         { status: 'Approved' },
//         { new: true }
//     )
//     console.log(approved);
//     return approved;
// }

//  UPDATE STATUS MODIFIED

// const updateModified = async (id) => {
//     let modified = await ShopOrderClone.findById(id);
//     console.log(modified);
//     if (!modified) {
//         throw new ApiError(httpStatus.NOT_FOUND, 'modified not found')
//     }
//     modified = await ShopOrderClone.findByIdAndUpdate(
//         { _id: id },
//         { status: 'Modified' },
//         { new: true }
//     )
//     console.log(modified)
//     return modified;
// }

//  UPDATE STATUS REJECTION

const updateRejected = async (id, status) => {
  let rejected = await ShopOrderClone.findById(id);
  console.log(rejected);
  if (!rejected) {
    throw new ApiError(httpStatus.NOT_FOUND, ' not found');
  }
  rejected = await ShopOrderClone.findByIdAndUpdate({ _id: id }, { status: status }, { new: true });
  console.log(rejected);
  return rejected;
};

//WARD LOADING EXECUTIVE

const wardloadExecutive = async (page) => {
<<<<<<< HEAD

    let data = await ShopOrderClone.aggregate([

        {
            $match: {
                'status': {
                    $in: ['Approved', 'Modified']
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
        // {
        //     $lookup: {
        //         from: 'productorderclones',
        //         localField: '_id',
        //         foreignField: 'orderId',
        //         as: 'orderData',
        //     }
        // },

        {
            $project: {
                shopId: 1,
                status: 1,
                shopType: '$userData.type',
                shopName: '$userData.SName',
                // orderId: '$orderData.orderId',
            }
        },
        { $skip: 10 * page },
        { $limit: 10 },

    ])
    return data;
}

=======
  let data = await ShopOrderClone.aggregate([
    {
      $match: {
        status: {
          $in: ['Approved', 'Modified'],
        },
      },
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
      $unwind: '$userData',
    },
    // {
    //   $lookup: {
    //     from: 'productorderclones',
    //     localField: '_id',
    //     foreignField: 'orderId',
    //     as: 'orderData',
    //   },
    // },

    // {
    //   $project: {
    //     shopId: 1,
    //     status: 1,
    //     shopType: '$userData.type',
    //     shopName: '$userData.SName',
    //     orderId: '$orderData.orderId',
    //   },
    // },
    // { $skip: 10 * page },
    // { $limit: 10 },
  ]);
  return data;
};
>>>>>>> 1e9f5d4571eb66a05a345ff2233782e84a52b17c

// TRACK STATUS FOR PRODUCT STATUS
const updateBilled = async (id, productStatus) => {
  let productOrderBilled = await ShopOrderClone.findById(id);
  if (!productOrderBilled) {
    throw new ApiError(httpStatus.NOT_FOUND, 'productOrderBilled not found');
  }
  productOrderBilled = await ShopOrderClone.findByIdAndUpdate({ _id: id }, { productStatus: productStatus }, { new: true });
  console.log(productOrderBilled);
  return productOrderBilled;
};

// AFTER PACKED BY WARD LOADING EXECUTE

const wardloadExecutivePacked = async (page) => {
  let data = await ShopOrderClone.aggregate([
    {
      $match: {
        productStatus: {
          $in: ['Packed'],
        },
<<<<<<< HEAD
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
                date:1,
                time:1,
                productStatus:1,
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
    ])

    return data;
}
=======
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shopData',
      },
    },
    { $unwind: '$shopData' },
    {
      $lookup: {
        from: 'streets',
        localField: 'shopData.Strid',
        foreignField: '_id',
        as: 'streetsData',
      },
    },
    { $unwind: '$streetsData' },
>>>>>>> 1e9f5d4571eb66a05a345ff2233782e84a52b17c

    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [{ $group: { _id: null, Qty: { $sum: '$quantity' } } }],
        as: 'orderData',
      },
    },
    { $unwind: '$orderData' },
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'orderId',
        as: 'orderDatafortotal',
      },
    },

    {
      $project: {
        type: '$shopData.type',
        street: '$streetsData.street',
        orderId: '$orderDatafortotal.orderId',
        orderDate: '$orderDatafortotal.date',
        orderTime: '$orderDatafortotal.time',
        totalItems: { $size: '$orderDatafortotal' },
        Qty: '$orderData.Qty',
        // totalcount: '$orderData.totalItems'
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  return data;
};

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
};
