import express from 'express'
import multer from 'multer'
import { DeliveryBoyController } from '../controllers/DeliveryBoyController';


const router = express.Router()
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 
    }
});

router.post(
    '/register',
    upload.fields([
      { name: 'profileImage', maxCount: 1 },
      { name: 'verificationImage', maxCount: 1 },
    ]),
    DeliveryBoyController.register
);

export default router;
  