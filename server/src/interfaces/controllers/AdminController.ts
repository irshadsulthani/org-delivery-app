import { GetUsers } from "../../application/use-cases/user/GetUsers";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository";
import { Request, Response } from "express";
import { StatusCode } from "../../utils/statusCode";


const userRepo = new UserRepository();
export class AdminController{
    static getUsers = async (req: Request, res: Response) => {
        try {
            const useCase = new GetUsers(userRepo);
            const users = await useCase.execute();
            res.status(StatusCode.OK).json(users);
        } catch (err: any) {
            res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
        }
    }
    static getAllCustomers = async (req: Request, res: Response) => {
        try {
          const useCase = new GetUsers(userRepo);
          const customers = await useCase.executeCustomers();
          
          res.status(StatusCode.OK).json(customers);
        } catch (err: any) {
          res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
        }
    }
    static getAllDeliveryBoys = async (req: Request, res: Response) =>{
        try {
            const useCase = new GetUsers(userRepo);
            const deliveryBoys = await useCase.excuteDeliveryBoys();
            res.status(StatusCode.OK).json(deliveryBoys);
        } catch (err: any) {
            res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
        }
    }
    static getAllReatilers = async (req: Request, res: Response ) => {
        try {
            const useCase = new GetUsers(userRepo);
            const reatilers = await useCase.excuteReatilers();
            res.status(StatusCode.OK).json(reatilers)
        } catch (err :any) {
            res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
        }
    }
}
