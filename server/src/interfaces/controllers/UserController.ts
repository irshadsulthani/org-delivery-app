import { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository";
import { StatusCode } from "../../utils/statusCode";
import { GetCustomerDashboardUseCase } from "../../application/use-cases/customer/GetCustomerDashboardUseCase";
import { CustomerRepository } from "../../infrastructure/database/repositories/CustomerRepository";

const userRepo = new UserRepository();
const customerRepo = new CustomerRepository()
const getDashboardUseCase = new GetCustomerDashboardUseCase(customerRepo)

export class UserController {
  static getGoogleLoginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.params;
      const user = await userRepo.findByEmail(email);
      res.status(StatusCode.OK).json(user);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      res.status(StatusCode.BAD_REQUEST).json({ message });
    }
  };
 // src/infrastructure/controllers/UserController.ts
static getDashboardData = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req.user as any).id;
        const customerData = await getDashboardUseCase.execute(userId);
        res.status(StatusCode.OK).json(customerData);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unexpected error';
        const statusCode = message.includes('not found') 
            ? StatusCode.NOT_FOUND 
            : StatusCode.BAD_REQUEST;
        res.status(statusCode).json({ message });
    }
};
}
