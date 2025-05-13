import express from 'express'
import multer from 'multer'
import { RetailerController } from '../controllers/RetailerController';


const router = express.Router()
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 
    }
});

router.post(
    '/register-retailer',
    upload.fields([
      { name: 'shopImage', maxCount: 1 },
      { name: 'shopLicense', maxCount: 1 },
    ]),
    RetailerController.register
);

export default router;
  