// src/controllers/authController.js
const { getUserByPhone } = require('../services/userService');

async function sendOtpHandler(req, res) {
  try {
    const { phone } = req.body;

    if (!phone || phone.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    console.log(`📱 Sending OTP to ${phone} (Demo mode - OTP: 123456)`);

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully (demo OTP: 123456)'
    });

  } catch (error) {
    console.error('Send OTP Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
}

async function verifyOtpHandler(req, res) {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone and OTP are required'
      });
    }

    // Demo mode: Accept only "123456" as valid OTP
    if (otp !== '123456') {
      return res.status(401).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    console.log(`✅ OTP verified for phone: ${phone}`);

    // Check if user exists in database via Lambda
    const existingUser = await getUserByPhone(phone);

    if (existingUser) {
      // Existing user - return their real data from DynamoDB
      console.log(`👤 Existing user found: ${existingUser.userId}`);
      
      const token = `token_${existingUser.userId}_${Date.now()}`;

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        userId: existingUser.userId,  // Real userId from DynamoDB
        token: token,
        isNewUser: false
      });

    } else {
      // New user - needs to register
      console.log(`🆕 New user detected for phone: ${phone}`);
      
      return res.status(200).json({
        success: true,
        message: 'OTP verified - please complete registration',
        userId: null,
        token: null,
        isNewUser: true
      });
    }

  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify OTP'
    });
  }
}

module.exports = { 
  sendOtpHandler, 
  verifyOtpHandler 
};
