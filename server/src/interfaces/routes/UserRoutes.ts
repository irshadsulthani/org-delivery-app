import express, { NextFunction, Request, Response } from 'express';
import { UserController } from '../controllers/UserController';
import { ProductController } from '../controllers/ProductController';

const router = express.Router();

router.get('/google-login-user/:email', UserController.getGoogleLoginUser)
router.get(
  "/shop",
  (req: Request, res: Response, next: NextFunction) => ProductController.getAllProducts(req, res, next)
);

export default router;
