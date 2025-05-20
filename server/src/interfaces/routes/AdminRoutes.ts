import express from 'express';

import { AdminController } from '../controllers/AdminController';
import { verifyToken } from '../../infrastructure/middlewares/verifyToken';


const router = express.Router();

router.get('/getallusers', verifyToken, AdminController.getUsers)
router.get('/getallcustomers', verifyToken, AdminController.getAllCustomers)
router.get('/getalldeliveryboys', verifyToken, AdminController.getAllDeliveryBoys)
router.get('/get-allReatilers', verifyToken, AdminController.getAllRetailers)
router.get('/deliveryboy/pending', verifyToken, AdminController.getPendingDeliveryBoys);
router.put('/deliveryboy/:id/approve', verifyToken, AdminController.approveDeliveryBoy);
router.put('/deliveryboy/:id/reject', verifyToken, AdminController.rejectDeliveryBoy);
router.get('/deliveryboy/:id', verifyToken, AdminController.getDeliveryBoyById)
router.get("/retailer/pending", AdminController.getPendingRetailers);
router.put("/retailer/approve/:id", AdminController.approveRetailer);
router.put("/retailer/reject/:id", AdminController.rejectRetailer);
router.get('/retailer/:id',  AdminController.getRetailerById)
router.patch('/retailer/:id/block', AdminController.blockRetailer)
router.patch('/retailer/:id/unblock', AdminController.unblockRetailer)
router.patch('/deliveryboy/:deliveryBoyId/block', AdminController.blockDelveryBoy)
router.patch('/deliveryboy/:deliveryBoyId/unblock', AdminController.UnblockDelveryBoy)

export default router;