import express from 'express';

import passport from 'passport';
import { handleOtpRequest, otpEmailForForgetPass, verifyOtp, verifyOtpController } from '../controllers/otpController';
import { AuthController } from '../controllers/AuthController';
const router = express.Router();

router.post('/send-otp', handleOtpRequest)
router.post('/verify-otp', verifyOtpController )
router.post('/login', AuthController.login);
router.post('/adminlogin', AuthController.adminLogin);
router.post('/adminLogout', AuthController.adminLogout);
router.post('/send-otp-forgetpass', otpEmailForForgetPass);
router.post('/verify-otp-forgetpass', verifyOtp);
router.post('/reset-password', AuthController.resetPassword);
// ? google authentication
router.get(
    '/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false,
    })
  );
  
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  AuthController.googleCallback
);


router.post('/customer-logout', AuthController.userLogout);
router.post('/deliveryBoy-login', AuthController.deliveryBoyLogin)
router.post('/deliveryBoy-logout', AuthController.deliveryBoyLogout);
router.post('/refresh-token', AuthController.refreshAccessToken);

router.post('/retailer-login', AuthController.retailerLogin)
router.post('/reatiler-logout', AuthController.retailerLogout)

export default router;
