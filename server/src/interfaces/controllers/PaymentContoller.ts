import { Request, Response } from 'express';
import { StripeService } from '../../infrastructure/services/StripeService';
import { PaymentRepository } from '../../infrastructure/database/repositories/PaymentRepository';
import { CreatePaymentIntentUseCase } from '../../application/use-cases/payment/CreatePaymentIntentUseCase';


const stripeService = new StripeService();
const paymentRepo = new PaymentRepository();
const createIntentUseCase = new CreatePaymentIntentUseCase(stripeService, paymentRepo);

export const createPaymentIntentHandler = async (req: Request, res: Response) => {
  try {
    console.log('Received request to create payment intent:', req.body);
    const { amount, currency, userId } = req.body;
    console.log('Creating payment intent with:', { amount, currency, userId });
    const result = await createIntentUseCase.execute({ amount, currency, userId });

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
