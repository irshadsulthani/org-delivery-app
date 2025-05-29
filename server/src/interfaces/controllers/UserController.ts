import { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository";
import { StatusCode } from "../../utils/statusCode";
import { GetCustomerDashboardUseCase } from "../../application/use-cases/customer/GetCustomerDashboardUseCase";
import { CustomerRepository } from "../../infrastructure/database/repositories/CustomerRepository";
import { GetProfileUseCase } from "../../application/use-cases/customer/GetProfileUseCase";

const userRepo = new UserRepository();
const customerRepo = new CustomerRepository();
const getDashboardUseCase = new GetCustomerDashboardUseCase(customerRepo);
const getProfileUseCase = new GetProfileUseCase(customerRepo, userRepo);
export class UserController {
  private static getUserId(req: Request): string {
    return (req.user as any).id;
  }
  static getGoogleLoginUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { email } = req.params;
      const user = await userRepo.findByEmail(email);
      res.status(StatusCode.OK).json(user);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      res.status(StatusCode.BAD_REQUEST).json({ message });
    }
  };
  static getDashboardData = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      console.log("Fetching dashboard data for userId:", userId);
      const customerData = await getDashboardUseCase.execute(userId);
      res.status(StatusCode.OK).json(customerData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      const statusCode = message.includes("not found")
        ? StatusCode.NOT_FOUND
        : StatusCode.BAD_REQUEST;
      res.status(statusCode).json({ message });
    }
  };



  
  static  getProfile = async(req: Request, res: Response): Promise<void>=> {
    try {
      console.log("its getting here in getProfile");
      const userId = this.getUserId(req);
      console.log("Fetching profile for userId:", userId);
      const useCase = await getProfileUseCase.execute(userId);
      res.status(StatusCode.OK).json(useCase);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unexpected error";
      res.status(StatusCode.BAD_REQUEST).json({ message });
    }
  }
}
