const OTP = require('../models/chatBot.OTP.model');
const moment = require('moment');

const saveOtp = async (number, otp) => {
  return await OTP.create({
    OTP: otp,
    date: moment().format('YYYY-MM-DD'),
  });
};
module.exports = { saveOtp };
