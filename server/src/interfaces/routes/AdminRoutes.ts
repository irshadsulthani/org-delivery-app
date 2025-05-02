import express from 'express';
import { verifyToken } from '../../infrastructure/middlewares/verifyToken';
import { AdminController } from '../controllers/AdminController';


const router = express.Router();

router.get('/getallusers', verifyToken, AdminController.getUsers)
router.get('/getallcustomers', verifyToken, AdminController.getAllCustomers)

export default router;