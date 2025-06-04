// src/domain/entities/Wallet.ts
import { Types } from "mongoose";


export interface Wallet {
  id: string;
  userId: Types.ObjectId | string;
  balance: number;
  currency: string;
  transactions: Transaction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'pending' | 'completed' | 'failed';
  reference: string;
  description: string;
  createdAt: Date;
}
