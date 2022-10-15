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


const getShopHistory = async (AssignedUserId,date) => {

  let match;
  if(AssignedUserId != 'null' && date != 'null'){
      match = [{ AssignedUserId: { $eq: AssignedUserId }}, { date: { $eq: date }}, { active: { $eq: true }}];
  }else if (AssignedUserId != 'null') {
  match = [{ AssignedUserId: { $eq: AssignedUserId } }, { active: { $eq: true } }];
 
} else if (date != 'null') {
  match = [{ date: { $eq: date } }, { active: { $eq: true } }];
} else {
  match = [{ AssignedUserId: { $ne: null } }, { active: { $eq: true } }];
}


  let values = await creditBill.aggregate([

    {
      $match: {
        $and: match,
      },
    },
    {
      $lookup: {
        from : 'shoporderclones',
        localField: 'orderId',
        foreignField: '_id',
        as: 'shoporderclonedata'
      }
    },
    { $unwind: "$shoporderclonedata"},
 

  
        {
        $lookup: {
            from: 'orderpayments',
            localField: 'orderId',
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
          localField: 'orderId',
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
            customerBillId: "$shoporderclonedata.customerBillId",
            OrderId: "$shoporderclonedata.OrderId",
            date:"$shoporderclonedata.date",
            statusOfBill:"$shoporderclonedata.creditBillAssignedStatus" ,
            executeName: "$dataa.AssignedUserId",
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
 
    ]);
    return values;
    
    //   let total = await creditBill.aggregate([
    //     {
    //       $lookup: {
    //         from:'creditbillgroups',
    //         localField: 'creditbillId',
    //         foreignField: '_id',
    //         pipeline: [
              
    
    //             {
    //                 $match: {
    //                         $or: [{ AssignedUserId: { $eq: id } }, {salesmanId: { $eq:id}}],
    //                       },
    //               },
    
              
    //         ],
    //         as: 'dataa'
    //       }
    //     },
    //     { $unwind: "$dataa"},
    
      
    //         {
    //         $lookup: {
    //             from: 'orderpayments',
    //             localField: 'orderId',
    //             foreignField: 'orderId',
    //             pipeline: [{
    //                 $group: { _id: null, price: { $sum: '$paidAmt' } } ,
    //            }],
    //             as: 'paymentData'
    //         }
    //     },{ $unwind:"$paymentData"},
        
    //     {
    //       $lookup: {
    //         from: 'b2bshopclones',
    //         localField: 'shopId',
    //         foreignField: '_id',
    //         as: 'shopDtaa'
    //       }
    //     },{ $unwind: "$shopDtaa"},
    //     {
    //         $lookup: {
    //           from:'productorderclones',
    //           localField: 'orderId',
    //           foreignField: 'orderId',
    //           pipeline: [
    //             {
    //               $project: {
    //                 Amount: { $multiply: ['$finalQuantity', '$finalPricePerKg'] },
    //                 GST_Number: 1,
    //               },
    //             },
    //             {
    //               $project: {
    //                 sum: '$sum',
    //                 percentage: {
    //                   $divide: [
    //                     {
    //                       $multiply: ['$GST_Number', '$Amount'],
    //                     },
    //                     100,
    //                   ],
    //                 },
    //                 value: '$Amount',
    //               },
    //             },
    //             {
    //               $project: {
    //                 price: { $sum: ['$value', '$percentage'] },
    //                 value: '$value',
    //                 GST: '$percentage',
    //               },
    //             },
    //             { $group: { _id: null, price: { $sum: '$price' } } },
             
    //                 ],
    //           as: 'productData',
    //         }
    //       },
        
    //       { $unwind: "$productData"},
       
    // ])
    // return {values: values, total: total.length };
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
        AssignedUserId: body.AssignedUserId,
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

    // updateProduct = await creditBill.findByIdAndUpdate({ _id: id }, updateBody, { new: true });


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
        actionStatus: updateBody.actionStatus,
        reasonScheduleOrDate: updateBody.reasonScheduleOrDate,

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



const getHistoryByPassOrderId = async (id)=>{
  let values = await orderPayment.aggregate([
      {
            $match: {
              $and: [{ orderId: { $eq: id } }],
            },
          },
          // {
          //   $lookup: {
          //     from: 'orderpayments',
          //     localField: '_id',
          //     foreignField: 'orderId',
          //     as: 'paymentsData'
          //   }
          // },{ $unwind: "$paymentData"},
  ]);
  return values;
}


const getDElExecutiveName = async ()=>{
  let values = await creditBillGroup.aggregate([
    

    {
          $lookup: {
          from: 'b2busers',
          localField: 'AssignedUserId',
          foreignField: '_id',
       
          as: 'WDEName'
      }
    },{ $unwind: "$WDEName"},
    {
      $lookup: {
      from: 'roles',
      localField: 'WDEName.userRole',
      foreignField: '_id',
    //   pipeline: [
    //     {
    //       $match: {
    //         $and: [{ roleName: { $eq: 'Ward delivery execute(WDE)' } }],
    //       },

    //   }
    // ],
      as: 'data'
  }
},{ $unwind: "$data"},
 
  {
      $project: {
          DeviveryExecutiveName:"$WDEName.name",
          nameId: "$WDEName._id",
          roleName: "$data.roleName"
      }
  }
  ]);
  return values;
}


const getsalesName = async() =>{
  let values = await creditBillGroup.aggregate([
    

    {
          $lookup: {
          from: 'b2busers',
          localField: 'salesmanId',
          foreignField: '_id',
       
          as: 'WDEName'
      }
    },{ $unwind: "$WDEName"},
    {
      $lookup: {
      from: 'roles',
      localField: 'WDEName.userRole',
      foreignField: '_id',
      pipeline: [
        {
          $match: {
            $and: [{ roleName: { $eq: 'Ward Field Sales Executive(WFSE)' } }],
          },

      }
    ],
      as: 'data'
  }
},{ $unwind: "$data"},
 
  {
      $project: {
          DeviveryExecutiveName:"$WDEName.name",
          nameId: "$WDEName._id",
          roleName: "$data.roleName"
      }
  }

]);
return values;
}


const getNotAssignData = async (page) =>{
  let values =  await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [{ creditBillAssignedStatus: { $ne: "Assigned" } }],
      },
    },

   

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
        // {
        //   $lookup:{
        //     from: 'creditbills',
        //     localField: '_id',
        //     foreignField: 'orderId',
        //     pipeline: [{
              
        //         $lookup: {
        //           from: 'creditbillpaymenthistories',
        //           localField: '_id',
        //           foreignField: 'creditBillId',
        //           pipeline: [
        //             {
        //               $project: {
        //                 HistoryAmount:{"$sum": "$amountPayingWithDEorSM"}
                     
        //               },
        //             },],
        //           as: 'historyDtaa'
        //         }
              
        //     },{$unwind:"$historyDtaa"}],
        //     as: 'creditData'
        //   }
        // },
        // {
        //   $unwind: {
        //     path: '$creditData',
        //     preserveNullAndEmptyArrays: true,
        //   },
        // },

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
          { $skip: 10 * page },
          { $limit: 10 },
      {
        $project: {
            customerBillId:1,
            OrderId:1,
            date:1,
            statusOfBill:1 ,
            executeName: "$dataa.AssignedUserId",
            shopNmae: "$shopDtaa.SName",
            shopId: "$shopDtaa._id",
            creditBillAssignedStatus:1,
            BillAmount:{$round:["$productData.price",0]},
            "totalHistory": {
                     "$sum": "$creditData.historyDtaa.amountPayingWithDEorSM"
                    },
            
            paidAmount: "$paymentData.price",
            
            pendingAmount: {$round:{ $subtract: [ "$productData.price", "$paymentData.price" ] } },

            condition1: {
                      $cond: {if: {$ne: [{ $subtract: [ {$round:["$productData.price",0]}, "$paymentData.price" ] }, 0]}, then: true, else: false}
                  },
                

        }
      }
    
       
    ]);


   let total = await ShopOrderClone.aggregate([

    {
      $match: {
        $and: [{ creditBillAssignedStatus: { $ne: "Assigned" } }],
      },
    },
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


const getShopPendingByPassingShopId = async (id) => {
  let values  = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [{ shopId: { $eq: id } }],
      },
    },
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
          statusOfBill:1 ,
          executeName: "$dataa.AssignedUserId",
          shopNmae: "$shopDtaa.SName",
          shopId: "$shopDtaa._id",
          creditBillAssignedStatus:1,
          BillAmount:{$round:["$productData.price",0]},
          paidAmount: "$paymentData.price",
          
          pendingAmount: {$round:{ $subtract: [ "$productData.price", "$paymentData.price" ] } },

          condition1: {
                    $cond: {if: {$ne: [{ $subtract: [ {$round:["$productData.price",0]}, "$paymentData.price" ] }, 0]}, then: true, else: false}
                },
              

      }
    }

  ]);
  return values;
}


const getDeliDetails = async (AssignedUserId) =>{
  let match;
 if (AssignedUserId != 'null') {
  match = [{ AssignedUserId: { $eq: AssignedUserId } }, { active: { $eq: true } }];
 }

 else {
  match = [{ AssignedUserId: { $ne: null } }, { active: { $eq: true } }];
}

  let values = await creditBill.aggregate([
    {
      $match: {
        $and: match,
      },
    },
    {
      $lookup:{
        from: 'b2busers',
        localField: 'AssignedUserId',
        foreignField: '_id',
        as: 'nameData'
      }
    },{ $unwind: "$nameData"},

    {
      $lookup: {
          from: 'orderpayments',
          localField: 'orderId',
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
        localField: 'orderId',
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
      $lookup:{
        from:'shoporderclones',
        localField: 'orderId',
        foreignField: '_id',
        as:'shopData'

      }
    },{ $unwind:"$shopData"},


    {
      $project: {
        date:1,
        AssignedUserId:1,
        orderId:1,
        bill:1,
        shopId:1,
        name: "$nameData.name",
        creditBillStatus: '$shopData.creditBillAssignedStatus'

      }
    }

  ]);

  let totalNoShops = await creditBill.aggregate([

    {
      $match: {
        $and: match,
      },
    },

    {
      "$group": {
        "_id": "$totalNoShops.shopId",
        "Count": {
          "$sum": 1
        },
        
      }
    },


  ]);

  let totalBills = await creditBill.aggregate([

    {
      $match: {
        $and: match,
      },
    },
     {
      "$group": {
        "_id": "$totalBills.bill",
        "Count": {
          "$sum": 1
        },
        
      }
    },
    

  ]);

  let totalAmount = await creditBill.aggregate([
    {
      $match: {
        $and: match,
      },
    },

  
    {
      $lookup: {
          from: 'orderpayments',
          localField: 'orderId',
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
        localField: 'orderId',
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
        BillAmount:{$round:["$productData.price",0]},
      }
    },
    { $group: { _id: null, price: { $sum: '$BillAmount' } } },
  ])
  return {values: values, totalNoShops: totalNoShops,totalAmount:totalAmount,totalBills:totalBills };
}



const getFineAccount = async (id)=>{
  let values  = await creditBill.aggregate([
    {
      $match: {
        $and: [{ AssignedUserId: { $eq: id } }],
      },
    },
    {
      $lookup: {
          from: 'orderpayments',
          localField: 'orderId',
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
        localField: 'orderId',
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
      $lookup: {
        from:'shoporderclones',
        localField: 'orderId',
        foreignField: '_id',
        as:'shopOrderCloneData'
      }
    },{ $unwind: "$shopOrderCloneData"},
    {
      $lookup: {
        from:'creditbillpaymenthistories',
        localField: '_id',
        foreignField: 'creditBillId',
        as: 'creditBillData'
      }
    },{ $unwind: "$creditBillData"},
      // {
      //     $unwind: {
      //       path: '$creditBillData',
      //       preserveNullAndEmptyArrays: true,
      //     },
      //   },

    {
      $project: {
        date:1,
        PaymentType:"$creditBillData.pay_By",
        paymentCapacity: "$creditBillData.pay_type",
        paymentStatus: "$creditBillData.upiStatus",
        paymentMode: "$creditBillData.paymentMode",
        AmountPayiong: "$creditBillData.amountPayingWithDEorSM",
          customerBillIds:"$shopOrderCloneData.customerBillId",
          OrderIds:"$shopOrderCloneData.OrderId",
          dates:"$shopOrderCloneData.date",
          statusOfBill:1 ,
          executeName: "$dataa.AssignedUserId",
          shopNmae: "$shopDtaa.SName",
          shopId: "$shopDtaa._id",
          creditBillAssignedStatus:1,
          BillAmount:{$round:["$productData.price",0]},
          paidAmount: "$paymentData.price",
          
          pendingAmount: {$round:{ $subtract: [ "$productData.price", "$paymentData.price" ] } },

          condition1: {
                    $cond: {if: {$ne: [{ $subtract: [ {$round:["$productData.price",0]}, "$paymentData.price" ] }, 0]}, then: true, else: false}
                },
              

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
  getHistoryByPassOrderId,
  getDElExecutiveName,
  getsalesName,
  getNotAssignData,
  getShopPendingByPassingShopId,
  getDeliDetails,
  getFineAccount,
};
