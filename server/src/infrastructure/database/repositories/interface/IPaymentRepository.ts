// src/domain/repositories/interface/IPaymentRepository.ts

import { Payment } from "../../../../domain/entities/Payment";

export interface IPaymentRepository {
  createPayment(payment: Omit<Payment, 'id'>): Promise<Payment>;
  updatePayment(id: string, updates: Partial<Payment>): Promise<Payment>;
  findPaymentByIntentId(paymentIntentId: string): Promise<Payment | null>;
}
