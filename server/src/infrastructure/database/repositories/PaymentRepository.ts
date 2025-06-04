import { Payment } from '../../../domain/entities/Payment';
import { PaymentModel } from '../schemas/PaymentModel';
import { IPaymentRepository } from './interface/IPaymentRepository';

export class PaymentRepository implements IPaymentRepository {
  async createPayment(payment: Omit<Payment, 'id'>): Promise<Payment> {
    const created = await PaymentModel.create(payment);
    return created.toObject();
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment> {
    const updated = await PaymentModel.findByIdAndUpdate(id, updates, { new: true });
    return updated!.toObject();
  }

  async findPaymentByIntentId(paymentIntentId: string): Promise<Payment | null> {
    const payment = await PaymentModel.findOne({ paymentIntentId });
    return payment?.toObject() || null;
  }
}
