const { OTPModel } = require('../models/supplierRegisterOtp.model');

const saveOtp = async (number, otp) => {
  return await OTPModel.create({
    OTP: otp,
    mobileNumber: number,
    // userId: user._id,
  });
};

module.exports = { saveOtp };