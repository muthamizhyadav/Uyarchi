const httpStatus = require('http-status');
const b2bBillStatus = require('../models/b2bbillStatus.model');
const ApiError = require('../utils/ApiError');
const CallStatus = require('../models/callStatus');
const moment = require('moment');
let currentDate = moment().format('DD-MM-YYYY');

const createB2bBillStatus = async (body) => {
  let billcount = await b2bBillStatus.find({ date: currentDate }).count();
  let center = '';
  if (billcount < 9) {
    center = '000000';
  }
  if (billcount < 99 && billcount >= 9) {
    center = '00000';
  }
  if (billcount < 999 && billcount >= 99) {
    center = '0000';
  }
  if (billcount < 9999 && billcount >= 999) {
    center = '000';
  }
  if (billcount < 99999 && billcount >= 9999) {
    center = '00';
  }
  if (billcount < 999999 && billcount >= 99999) {
    center = '0';
  }
  let total = billcount + 1;
  let billid = center + total;
  let value = { ...body, ...{ BillId: billid } };
  const { callStatusId, supplierid, date } = body;
  let callstatus = await CallStatus.findOne({ supplierid: supplierid, date: date });
  if (!callstatus) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CallStatus Id Required');
  }
  callstatus = await CallStatus.findByIdAndUpdate({ _id: callStatusId }, { stockStatus: 'Billed' }, { new: true });
  let creations = await b2bBillStatus.create(value);
  callstatus = await CallStatus.findByIdAndUpdate({ _id: callStatusId }, { B2bBillId: creations.id }, { new: true });
  return creations;
};

module.exports = { createB2bBillStatus };
