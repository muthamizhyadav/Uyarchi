const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
let currentDate = moment().format('DD-MM-YYYY');
const { Shop } = require('../models/b2b.ShopClone.model');
const { ShopOrderClone } = require('../models/shopOrder.model');
const Role = require('../models/roles.model');
const { ProductorderClone } = require('../models/shopOrder.model');
const pettyStockModel = require('../models/b2b.pettyStock.model');
const { wardAdminGroup, wardAdminGroupModel_ORDERS } = require('../models/b2b.wardAdminGroup.model');
const wardAdminGroupDetails = require('../models/b2b.wardAdminGroupDetails.model');
const { Product } = require('../models/product.model');
const orderPayment = require('../models/orderpayment.model');
const creditBillGroup = require('../models/b2b.creditBillGroup.model')
const creditBill = require('../models/b2b.creditBill.model');
const creditBillPaymentModel = require('../models/b2b.creditBillPayments.History.model')

const getShopWithBill = async (page) => {
  let values = await ShopOrderClone.aggregate([
    {
      $lookup: {
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [{
             $group: { _id: null, price: { $sum: '$paidAmt' } } ,
        }],
        as: 'paymentData',
      },
    },
    { $unwind:"$paymentData"},
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shopNameData',
      },
    },
    { $unwind:"$shopNameData"},
    {
        $lookup: {
          from:'productorderclones',
          localField: '_id',
          foreignField: 'orderId',
          pipeline: [
            {
              $project: {
                Amount: { $multiply: ['$finalQuantity', '$finalPricePerKg'] },
                GST_Number: 1,
              },
            },
            {
              $project: {
                sum: '$sum',
                percentage: {
                  $divide: [
                    {
                      $multiply: ['$GST_Number', '$Amount'],
                    },
                    100,
                  ],
                },
                value: '$Amount',
              },
            },
            {
              $project: {
                price: { $sum: ['$value', '$percentage'] },
                value: '$value',
                GST: '$percentage',
              },
            },
            { $group: { _id: null, price: { $sum: '$price' } } },
         
                ],
          as: 'productData',
        }
      },
      { $unwind: "$productData"},
    // {
    //   $project: {
    //     shopName: '$shopNameData.SName',
    //     shopId: '$shopNameData._id',
    //     date: "$shopNameData.customerBilldate",
    //      orderId: "$shopNameData.OrderId",
    //     customerBillId: 1,
    //     overAllTotalBYOrder: {$round:["$productData.price",0]},
    //     paidamount: "$paymentData.price",
    //     pendingAmount: { $subtract: [ {$round:["$productData.price",0]}, "$paymentData.price" ] } ,
    //     condition1: {
    //         $cond: {if: {$ne: [{ $subtract: [ {$round:["$productData.price",0]}, "$paymentData.price" ] }, 0]}, then: true, else: false}
    //     },
    //   },
    // },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  let total = await ShopOrderClone.aggregate([
    {
        $lookup: {
          from: 'orderpayments',
          localField: '_id',
          foreignField: 'orderId',
          pipeline: [{
            $group: { _id: null, price: { $sum: '$paidAmt' } } ,
       }],
          as: 'paymentData',
        },
      },
      { $unwind:"$paymentData"},
      {
        $lookup: {
          from: 'b2bshopclones',
          localField: 'shopId',
          foreignField: '_id',
          as: 'shopNameData',
        },
      },
      {
          $lookup: {
            from:'productorderclones',
            localField: '_id',
            foreignField: 'orderId',
            pipeline: [
              {
                $project: {
                  Amount: { $multiply: ['$finalQuantity', '$finalPricePerKg'] },
                  GST_Number: 1,
                },
              },
              {
                $project: {
                  sum: '$sum',
                  percentage: {
                    $divide: [
                      {
                        $multiply: ['$GST_Number', '$Amount'],
                      },
                      100,
                    ],
                  },
                  value: '$Amount',
                },
              },
              {
                $project: {
                  price: { $sum: ['$value', '$percentage'] },
                  value: '$value',
                  GST: '$percentage',
                },
              },
              { $group: { _id: null, price: { $sum: '$price' } } },
           
                  ],
            as: 'productData',
          }
        },
        { $unwind: "$productData"},
  ])
  return {values: values, total: total.length};
};

const getWardExecutiveName = async () => {
    let values = await Role.aggregate([
        {
                        $match: {
                          $and: [{ roleName: { $eq: 'Ward delivery execute(WDE)' } }],
                        },
                      },
                    {
                        $lookup: {
                            from: 'b2busers',
                            localField: '_id',
                            foreignField: 'userRole',
                            as: 'WDEName'
                        }
                    },{ $unwind: "$WDEName"},
                    {
                        $project: {
                            DeviveryExecutiveName:"$WDEName.name",
                            nameId: "$WDEName._id"
                        }
                    }
    ]);
    return values;
}

const getsalesmanName = async () => {
    let values = await Role.aggregate([
        {
            $match: {
              $and: [{ roleName: { $eq: 'Ward Field Sales Executive(WFSE)' } }],
            },
          },
          {
            $lookup: {
                from: 'b2busers',
                localField: '_id',
                foreignField: 'userRole',
                as: 'SMName'
            }
        },{ $unwind: "$SMName"},
        {
            $project:{
                salesman: "$SMName.name",
                SMnameId: "$SMName._id"
            }
        }
    ]);
    return values;

}


const getShopHistory = async (page) => {
    let values = await ShopOrderClone.aggregate([
        // {
        //     $match: {
        //       $and: [{ shopId: { $eq: id } }],
        //     },
        //   },
        {
        $lookup: {
            from: 'orderpayments',
            localField: '_id',
            foreignField: 'orderId',
            pipeline: [{
                $group: { _id: null, price: { $sum: '$paidAmt' } } ,
           }],
            as: 'paymentData'
        }
    },{ $unwind:"$paymentData"},
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shopDtaa'
      }
    },{ $unwind: "$shopDtaa"},
    {
        $lookup: {
          from:'productorderclones',
          localField: '_id',
          foreignField: 'orderId',
          pipeline: [
            {
              $project: {
                Amount: { $multiply: ['$finalQuantity', '$finalPricePerKg'] },
                GST_Number: 1,
              },
            },
            {
              $project: {
                sum: '$sum',
                percentage: {
                  $divide: [
                    {
                      $multiply: ['$GST_Number', '$Amount'],
                    },
                    100,
                  ],
                },
                value: '$Amount',
              },
            },
            {
              $project: {
                price: { $sum: ['$value', '$percentage'] },
                value: '$value',
                GST: '$percentage',
              },
            },
            { $group: { _id: null, price: { $sum: '$price' } } },
         
                ],
          as: 'productData',
        }
      },
      { $unwind: "$productData"},
    {
        $project: {
            customerBillId:1,
            OrderId:1,
            date:1,
            statusOfBillLast: "$shopDtaa.statusOfBill",
            shopNmae: "$shopDtaa.SName",
            shopId: "$shopDtaa._id",
            creditBillAssignedStatus:1,
            BillAmount:{$round:["$productData.price",0]},
            // BillAmount:"$productData.price",
            paidAmount: "$paymentData.price",
            
            pendingAmount: {$round:{ $subtract: [ "$productData.price", "$paymentData.price" ] } },

            condition1: {
                      $cond: {if: {$ne: [{ $subtract: [ {$round:["$productData.price",0]}, "$paymentData.price" ] }, 0]}, then: true, else: false}
                  },
                

        }
    },
    { $skip: 10 * page },
    { $limit: 10 },
    ]);
    let total = await ShopOrderClone.aggregate([
      {
        $lookup: {
            from: 'orderpayments',
            localField: '_id',
            foreignField: 'orderId',
            pipeline: [{
                $group: { _id: null, price: { $sum: '$paidAmt' } } ,
           }],
            as: 'paymentData'
        }
    },{ $unwind:"$paymentData"},
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shopDtaa'
      }
    },{ $unwind: "$shopDtaa"},
    {
        $lookup: {
          from:'productorderclones',
          localField: '_id',
          foreignField: 'orderId',
          pipeline: [
            {
              $project: {
                Amount: { $multiply: ['$finalQuantity', '$finalPricePerKg'] },
                GST_Number: 1,
              },
            },
            {
              $project: {
                sum: '$sum',
                percentage: {
                  $divide: [
                    {
                      $multiply: ['$GST_Number', '$Amount'],
                    },
                    100,
                  ],
                },
                value: '$Amount',
              },
            },
            {
              $project: {
                price: { $sum: ['$value', '$percentage'] },
                value: '$value',
                GST: '$percentage',
              },
            },
            { $group: { _id: null, price: { $sum: '$price' } } },
         
                ],
          as: 'productData',
        }
      },
      { $unwind: "$productData"},
    ])
    return {values: values, total: total.length };
}


const updateAssignedStatusPerBill = async (id) => {
    let Status = await ShopOrderClone.findById(id);
    if (!Status) {
      throw new ApiError(httpStatus.NOT_FOUND, 'status not found');
    }
    Status = await ShopOrderClone.findByIdAndUpdate(
      { _id: id },
      { creditBillAssignedStatus : 'Assigned' },
      { new: true }
    );
    return Status;
  };


  const updateAssignedStatusByMultiSelect = async (body) => {
    body.arr.forEach(async (e) => {
      await ShopOrderClone.findByIdAndUpdate({ _id: e }, { creditBillAssignedStatus: 'Assigned' }, { new: true });
    });
  
    return 'status updated successfully';
  };




  const createGroup = async (body) => {
    let serverdates = moment().format('YYYY-MM-DD');
    console.log(typeof serverdates);
    let servertime = moment().format('hh:mm a');
   
    const group = await creditBillGroup.find({ assignedDate: serverdates });

    console.log(group);
  
    let center = '';
  
    if (group.length < 9) {
      center = '0000';
    }
    if (group.length < 99 && group.length >= 9) {
      center = '000';
    }
    if (group.length < 999 && group.length >= 99) {
      center = '00';
    }
    if (group.length < 9999 && group.length >= 999) {
      center = '0';
    }
    let userId = '';
    let totalcount = group.length + 1;
    console.log(totalcount);
    userId = 'G' + center + totalcount;
   
  
    let values = {
      ...body,
      ...{
        groupId: userId,
        assignedDate: serverdates,
        assignedTime: servertime,
        created: moment(),
        
      },
    };
    let wardAdminGroupcreate = await creditBillGroup.create(values);
    body.Orderdatas.forEach(async (e) => {
      let productId = e._id;
      let shopId = e.shopId;
      let bill = e.customerBillId;
  
      
      await creditBill.create({
        orderId: productId,
        shopId: shopId,
        creditbillId: wardAdminGroupcreate._id,
        bill: bill,
        date: serverdates,
        time: servertime,
        created: moment(),
       
      });
    });
  
    return wardAdminGroupcreate;
  };




  const payingCAshWithDEorSM = async (id,updateBody) =>{
    let currentDate = moment().format('YYYY-MM-DD');
    let currenttime =  moment().format('HHmm');
  
    let updateProduct = await creditBill.findById(id);
    if (!updateProduct) {
      throw new ApiError(httpStatus.NOT_FOUND, ' Not Found');
    }

    updateProduct = await creditBill.findByIdAndUpdate({ _id: id }, updateBody, { new: true });


    await creditBillPaymentModel.create({
     
        date: currentDate,
        time: currenttime,
        created: moment(),
        creditBillId: updateProduct._id,
        orderId: updateBody.orderId,
        shopId: updateBody.shopId,
        pay_By:updateBody.pay_By,
        pay_type: updateBody.pay_type,
        upiStatus: updateBody.upiStatus,
        amountPayingWithDEorSM: updateBody.amountPayingWithDEorSM,
        actionStatus: updateBody.actionStatus

      });

    console.log(updateProduct)

    return updateProduct;

};


const getManageCreditBillAssigning = async () =>{
  let values = await creditBillGroup.aggregate([
    {
      $lookup:{
        from: 'b2busers',
        localField: 'AssignedUserId',
        foreignField: '_id',
        as: 'deliveryExecutiveNameData'
      }
    },
    { $unwind:"$deliveryExecutiveNameData"},
    {
      $lookup: {
        from: 'creditbills',
        localField: '_id',
        foreignField: 'creditbillId',
        as: 'historyDatass'
      }
    },
    { $unwind:"$historyDatass"}
   
   
    // {
    //   $project: {
    //     assignedDate:1,
    //     assignedTime:1,
    //     groupId:1,
    //     execuName: "$deliveryExecutiveNameData.name",
    //     TotalBills:1,
    //     totalAmount:1,
    //     totalShops: {"$size": "$Orderdatas.shopId"}
    //   }
    // }
  ]);
  return values;

}



const getcreditBillDetailsByPassExecID = async(id) =>{
  let values = await creditBillGroup.aggregate([
    {
      $match: {
        $and: [{ AssignedUserId: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'creditbills',
        localField: '_id',
        foreignField: 'creditbillId',
        as: 'datasss'
      }
    }
  ]);
  return values;
}
  






module.exports = {
  getShopWithBill,
  getWardExecutiveName,
  getsalesmanName,
  getShopHistory,
  updateAssignedStatusPerBill,
  createGroup,
  payingCAshWithDEorSM,
  getManageCreditBillAssigning,
  getcreditBillDetailsByPassExecID,
  updateAssignedStatusByMultiSelect,
};
