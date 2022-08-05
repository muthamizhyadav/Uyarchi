const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const { Shop } = require('../models/b2b.ShopClone.model');
const { ProductorderClone } = require('../models/shopOrder.model');
const wardAdminGroup = require('../models/b2b.wardAdminGroup.model');



const createGroup = async (body , userid)=>{

    const group = await wardAdminGroup.find();
    let center = '';

    if(group.length < 9){
      center = '0000';
    }
    if(group.length < 99 && group.length >= 9){
      center = '000';
    }
    if(group.length < 999 && group.length >= 99){
      center = '00';
    }
    if(group.length < 9999 && group.length >= 999){
      center = '0';
    }

    let userId = '';
    let totalcount = group.length + 1;
    userId = "GD" + center + totalcount ;

    let values = { ...body, ...{ Uid: userid, groupId: userId}};
    let creation = await ProductorderClone.create(values);
console.log(creation);

    let { OrderId, street, type  } = body;
    OrderId.forEach(async (e) =>{
        wardAdminGroup.create({
          orderId : creation.orderId,
          assignDate : e.assignDate,
          assignDate : e.assignTime,
          totalOrder : e.totalOrder,
        })
    })

    return creation;
}


// const createGroupId = async (body)=>{
//     return wardAdminGroup.create(body);
//   };

module.exports = {
    createGroup,
    // createGroupId,
}
