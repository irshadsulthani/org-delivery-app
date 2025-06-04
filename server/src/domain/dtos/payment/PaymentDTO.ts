// src/domain/dtos/payment/PaymentDTOs.ts
export interface CreatePaymentIntentDTO {
  amount: number;
  currency: string;
  customerId?: string; // Stripe customer ID
  metadata?: Record<string, string>;
  userId: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface AddWalletFundsDTO {
  userId: string;
  amount: number;
  paymentMethodId: string;
}

export interface WalletDTO {
  balance: number;
  currency: string;
  transactions: WalletTransactionDTO[];
}

export interface WalletTransactionDTO {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  status: string;
  createdAt: Date;
}