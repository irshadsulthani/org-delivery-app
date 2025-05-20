// src/interfaces/routes/RetailerRoute.ts
import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { RetailerController } from '../controllers/RetailerController';
import { verifyToken } from '../../infrastructure/middlewares/verifyToken';
import { checkUserStatus } from '../../infrastructure/middlewares/checkUserStatus';
import { ProductController } from '../controllers/ProductController';
import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 
    }
});

// Initialize middleware with repository
const userStatusCheck = checkUserStatus(new UserRepository());

// Retailer registration routes (public)
router.post(
    '/register-retailer',
    upload.fields([
      { name: 'shopImage', maxCount: 1 },
      { name: 'shopLicense', maxCount: 1 },
    ]),
    RetailerController.register
);

router.get('/register-status/:email', RetailerController.getRegisterStatus);

router.post(
  "/add-product",
  upload.fields([{ name: "images", maxCount: 3 }]),
  verifyToken,
  userStatusCheck,
  (req: Request, res: Response, next: NextFunction) => ProductController.addProduct(req, res, next)
);

router.get(
  "/products",
  verifyToken,
  userStatusCheck,
  (req: Request, res: Response, next: NextFunction) => ProductController.getRetailerProducts(req, res, next)
);

router.get(
  "/products/:productId",
  verifyToken,
  userStatusCheck,
  (req: Request, res: Response, next: NextFunction) => ProductController.getProductDetails(req, res, next)
);

router.put(
  '/edit-product/:productId',
  verifyToken,
  upload.array('newImages', 3), //
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(ProductController.updateProduct(req, res, next)).catch(next);
  }
);


export default router;