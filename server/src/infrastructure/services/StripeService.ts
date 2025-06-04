import Stripe from 'stripe';
import { CreatePaymentIntentDTO, PaymentIntentResponse } from '../../domain/dtos/payment/PaymentDTO';
import { config } from '../../config';

const stripe = new Stripe(config.stripeKey as string, {
  apiVersion: '2025-05-28.basil',
});

export class StripeService {
  async createPaymentIntent(data: CreatePaymentIntentDTO): Promise<PaymentIntentResponse> {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency,
      metadata: data.metadata || {},
      customer: data.customerId,
      payment_method_types: ['card'],
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    };
  }
}
