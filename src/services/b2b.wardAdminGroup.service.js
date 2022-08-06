const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Shop } = require('../models/b2b.ShopClone.model');
const {  ShopOrderClone,  } = require('../models/shopOrder.model');
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
    let creation = await wardAdminGroup.create(values);
    console.log(creation);

    let createShopOrderClone;

    let { product, date, time, OrderId } = body;

    product.forEach(async (e) => {
      wardAdminGroup.create({
        OrderId: e._id,
        groupId: e.groupId,
        assignDate: e.assignDate,
        assignTime: e.assignTime,
      });
    });
    return createShopOrderClone;
}

const updateOrderStatus = async (id,updateBody)=>{
  let status = await wardAdminGroup.findById(id);
  if(!status){
    throw new ApiError(httpStatus.NOT_FOUND, 'not found')
  }
  status = await wardAdminGroup.findByIdAndUpdate({_id: id},updateBody, { new: true });
  return status;
}



module.exports = {
    createGroup,
    updateOrderStatus,

}
