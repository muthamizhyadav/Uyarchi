const OTP = require('../models/saveOtp.model');

const saveOtp = async (number, otp, user) => {
  return await OTP.create({
    OTP: otp,
    mobileNumber: number,
    userId: user._id,
  });
};

module.exports = { saveOtp };
