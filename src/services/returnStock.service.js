const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const ReturnStock = require('../models/returnStocks.model');
const { wardAdminGroup } = require('../models/b2b.wardAdminGroup.model');
const { ShopOrderClone } = require('../models/shopOrder.model');

const create_ReturnStock = async (body, userid) => {
  let { groupId } = body;
  let values = {
    ...body,
    ...{ created: moment(), date: moment().format('YYYY-MM-DD'), time: moment().format('HHmmss'), status: 'received' },
  };
  if (!groupId) {
    throw new ApiError('Gruop Id Required');
  }
  await wardAdminGroup.findByIdAndUpdate(
    { _id: groupId },
    { returnStockstatus: 'returned', returnstockdate: moment() },
    { new: true }
  );
  let findGroup = await wardAdminGroup.findOne({ _id: groupId });
  await findGroup.Orderdatas.forEach(async (e) => {
    let shoporder = await ShopOrderClone.findOne({ _id: e._id });
    shoporder.statusActionArray.push({ userid: userid, date: moment().toString(), status: 'returned' });
    shoporder.save();
  });

  let create = await ReturnStock.create(values);
  return create;
};

module.exports = {
  create_ReturnStock,
};
