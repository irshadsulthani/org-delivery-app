// src/domain/repositories/interface/IWalletRepository.ts

import { Transaction, Wallet } from "../../../../domain/entities/Wallet";



export interface WalletRepository {
  createWallet(userId: string): Promise<Wallet>;
  getWallet(userId: string): Promise<Wallet | null>;
  updateWalletBalance(userId: string, amount: number): Promise<Wallet>;
  addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction>;
  getTransactions(userId: string): Promise<Transaction[]>;
}