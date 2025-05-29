//src/infrastructure/database/schemas/customerModel.ts
import mongoose, { Schema, Document, Types } from 'mongoose';
import { Customer } from '../../../domain/entities/Customer';

interface AddressDoc {
<<<<<<< HEAD
  _id: Types.ObjectId;
=======
>>>>>>> d387b79 (feat:- now doing the customer address adding)
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
<<<<<<< HEAD
  createdAt?: Date;
  updatedAt?: Date;
=======
>>>>>>> d387b79 (feat:- now doing the customer address adding)
}

export interface CustomerDoc extends Omit<Customer, '_id' | 'addresses'>, Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  addresses: AddressDoc[];
  walletBalance: number
}

const addressSchema = new Schema<AddressDoc>(
  {
<<<<<<< HEAD
    _id: { type: Schema.Types.ObjectId, default: () => new Types.ObjectId() },
=======
>>>>>>> d387b79 (feat:- now doing the customer address adding)
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
<<<<<<< HEAD
  { _id: false,
    timestamps: true
  }
=======
  { _id: false }
>>>>>>> d387b79 (feat:- now doing the customer address adding)
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
