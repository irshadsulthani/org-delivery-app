import { StripeService } from "../../../infrastructure/services/StripeService";
import {
  CreatePaymentIntentDTO,
  PaymentIntentResponse,
} from "../../../domain/dtos/payment/PaymentDTO";
import { IPaymentRepository } from "../../../infrastructure/database/repositories/interface/IPaymentRepository";
import { Types } from "mongoose";

export class CreatePaymentIntentUseCase {
  constructor(
    private _stripeService: StripeService,
    private _paymentRepo: IPaymentRepository
  ) {}

  async execute(data: CreatePaymentIntentDTO): Promise<PaymentIntentResponse> {
    const intent = await this._stripeService.createPaymentIntent(data);

    await this._paymentRepo.createPayment({
      userId: new Types.ObjectId(data.userId),
      amount: data.amount,
      currency: data.currency,
      status: "pending",
      paymentMethod: "card",
      paymentIntentId: intent.clientSecret,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return intent;
  }
}
