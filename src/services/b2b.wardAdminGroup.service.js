const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const { Shop } = require('../models/b2b.ShopClone.model');
const { ProductorderClone } = require('../models/shopOrder.model');
const wardAdminGroup = require('../models/b2b.wardAdminGroup.model');



const createGroup = async (body , userid)=>{
    let values = { ...body, ...{ Uid: userid}};
    let creation = await ProductorderClone.create(values);
console.log(creation);

    let { OrderId, street, type,  } = body;
    OrderId.forEach(async (e) =>{
        wardAdminGroup.create({
          orderId : e.orderId,
          assignDate : e.assignDate,
          assignDate : e.assignTime,
          totalOrder : e.totalOrder,
        })
    })

    return creation;
}

module.exports = {
    createGroup,
}
