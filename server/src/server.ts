import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './infrastructure/database/connection';
import  AuthRoutes  from './interfaces/routes/AuthRoutes';
import AdminRoutes from './interfaces/routes/AdminRoutes';
import UserRoutes from './interfaces/routes/UserRoutes';
import DeliveryBoyRoute from './interfaces/routes/DeliveryBoyRoute'
import RetailerRoute from './interfaces/routes/RetailerRoute'
import { config } from './config';
import cookieParser from 'cookie-parser'
import passport from 'passport';
dotenv.config();
import './infrastructure/google/passport';
const PORT = config.port;
const app = express();
const FRONT_END_URL = config.frontendUrl;

app.use(express.urlencoded({ extended: true }))

app.use(passport.initialize());
app.use(cookieParser());
app.use(cors({
  origin: FRONT_END_URL, 
  credentials: true,
  allowedHeaders:['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/api/auth', AuthRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/delivery-boy', DeliveryBoyRoute);
app.use('/api/retailer', RetailerRoute)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});


