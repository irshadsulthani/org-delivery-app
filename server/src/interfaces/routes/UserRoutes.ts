import express, { NextFunction, Request, Response } from 'express';
import { UserController } from '../controllers/UserController';
import { ProductController } from '../controllers/ProductController';
import { verifyToken } from '../../infrastructure/middlewares/verifyToken';
<<<<<<< HEAD
import multer from 'multer';
import { createPaymentIntentHandler } from '../controllers/PaymentContoller';
=======
>>>>>>> d387b79 (feat:- now doing the customer address adding)

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});



router.get('/google-login-user/:email', UserController.getGoogleLoginUser)
router.get(
  "/shop",
  (req: Request, res: Response, next: NextFunction) => ProductController.getAllProducts(req, res, next)
);

router.get(
  '/dashboard',verifyToken, UserController.getDashboardData
)

<<<<<<< HEAD
router.get('/profile', verifyToken, UserController.getProfile);


router.patch(
  '/profile', 
  verifyToken, 
  upload.single('profileImage'), 
  UserController.updateProfile
);

router.post(
  '/addresses',
  verifyToken,
  UserController.addCustomerAddress
);

router.patch('/addresses/:addressId', verifyToken, UserController.updateAddress);
router.delete('/addresses/:addressId', verifyToken, UserController.deleteAddress);
router.post(
  '/addresses/:addressId/set-default',
  verifyToken,
  UserController.setDefaultAddress
);

router.post('/payment/create-intent', createPaymentIntentHandler)

=======
>>>>>>> d387b79 (feat:- now doing the customer address adding)
export default router;
