import mongoose, { Schema, Document, model } from "mongoose";
import { Payment } from "../../../domain/entities/Payment";



const PaymentSchema: Schema<Payment> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: { type: String, required: true },
    paymentIntentId: { type: String },
  },
  {
    timestamps: true, // Auto-manage createdAt and updatedAt
  }
);

export const PaymentModel = model<Payment>("Payment", PaymentSchema);
