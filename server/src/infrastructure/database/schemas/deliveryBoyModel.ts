import mongoose, { Document, Schema, Types } from 'mongoose';
import { DeliveryBoy } from '../../../domain/entities/DeliveryBoy';

interface DeliveryBoyDoc extends Document, Omit<DeliveryBoy, '_id'> {
  _id: Types.ObjectId;
}

const deliveryBoySchema = new Schema<DeliveryBoyDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    dob: { type: Date, required: true },
    profileImageUrl: { type: String, required: true },
    verificationImageUrl: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationStatus: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'], 
      default: 'pending' 
    },
    totalDeliveredOrders: { type: Number, default: 0 },
    currentlyAvailable: { type: Boolean, default: false },
    vehicleType: { 
      type: String, 
      enum: ['bike', 'scooter', 'car', 'van'], 
      required: true 
    },
    vehicleNumber: { type: String },
    dlNumber: { type: String, required: true },
    reviews: [
      {
        customerId: { type: Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const DeliveryBoyModel = mongoose.model<DeliveryBoyDoc>('DeliveryBoy', deliveryBoySchema);
