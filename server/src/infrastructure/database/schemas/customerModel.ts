//src/infrastructure/database/schemas/customerModel.ts
import mongoose, { Schema, Document, Types } from 'mongoose';
import { Customer } from '../../../domain/entities/Customer';

interface AddressDoc {
  _id: Types.ObjectId;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomerDoc extends Omit<Customer, '_id' | 'addresses'>, Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  addresses: AddressDoc[];
  walletBalance: number
}

const addressSchema = new Schema<AddressDoc>(
  {
    _id: { type: Schema.Types.ObjectId, default: () => new Types.ObjectId() },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false,
    timestamps: true
  }
);

const customerSchema = new Schema<CustomerDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    phone: { type: String, required: true },
    addresses: { type: [addressSchema], default: [] },
    profileImageUrl: { type: String, required: true },
    totalOrders: { type: Number, default: 0 },
    walletBalance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const CustomerModel = mongoose.model<CustomerDoc>('Customer', customerSchema);