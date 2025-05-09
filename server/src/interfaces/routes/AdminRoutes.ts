import express from 'express';
import { verifyToken } from '../../infrastructure/middlewares/verifyToken';
import { AdminController } from '../controllers/AdminController';


const router = express.Router();

router.get('/getallusers', verifyToken, AdminController.getUsers)
router.get('/getallcustomers', verifyToken, AdminController.getAllCustomers)
router.get('/getalldeliveryboys', verifyToken, AdminController.getAllDeliveryBoys)
router.get('/get-allReatilers', verifyToken, AdminController.getAllReatilers)

export default router;