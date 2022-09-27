const OTP = require('../models/saveOtp.model');
const moment = require('moment');

const saveOtp = async (number, otp, user) => {
  return await OTP.create({
    OTP: otp,
    mobileNumber: number,
    userId: user._id,
    create: moment(),
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HHmms'),
  });
};
module.exports = { saveOtp };
