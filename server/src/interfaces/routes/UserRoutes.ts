import express, { NextFunction, Request, Response } from 'express';
import { UserController } from '../controllers/UserController';
import { ProductController } from '../controllers/ProductController';
import { verifyToken } from '../../infrastructure/middlewares/verifyToken';
import multer from 'multer';

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

export default router;
