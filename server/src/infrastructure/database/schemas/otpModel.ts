// src/infrastructure/database/schemas/otpModel.ts

import mongoose, { Document, Model, Schema } from 'mongoose';
import { Otp } from '../../../domain/entities/Otp';


interface OtpDocument extends Otp, Document {}

const otpSchema: Schema<OtpDocument> = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: Number, required: true },
  expiresAt: { type: Date, required: true }
});

const OtpModel: Model<OtpDocument> = mongoose.model<OtpDocument>('Otp', otpSchema);

export default OtpModel;
