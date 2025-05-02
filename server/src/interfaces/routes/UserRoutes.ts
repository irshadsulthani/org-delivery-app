import express from 'express';
import { UserController } from '../controllers/UserController';

const router = express.Router();

router.get('/google-login-user/:email', UserController.getGoogleLoginUser)

export default router;
