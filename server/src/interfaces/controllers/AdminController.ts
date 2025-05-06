import { GetUsers } from "../../application/use-cases/user/GetUsers";
import { MongoUserRepository } from "../../infrastructure/database/repositories/MongoUserRepository";
import { Request, Response } from "express";


const userRepo = new MongoUserRepository();
export class AdminController{
    static getUsers = async (req: Request, res: Response) => {
        try {
            const useCase = new GetUsers(userRepo);
            const users = await useCase.execute();
            res.status(200).json(users);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }
    static getAllCustomers = async (req: Request, res: Response) => {
        try {
          const useCase = new GetUsers(userRepo);
          const customers = await useCase.executeCustomers();
          
          res.status(200).json(customers);
        } catch (err: any) {
          res.status(400).json({ message: err.message });
        }
    }
    static getAllDeliveryBoys = async (req: Request, res: Response) =>{
        try {
            const useCase = new GetUsers(userRepo);
            const deliveryBoys = await useCase.excuteDeliveryBoys();
            res.status(200).json(deliveryBoys);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }
    static getAllReatilers = async (req: Request, res: Response ) => {
        try {
            console.log('its here getting in reatilers');
            const useCase = new GetUsers(userRepo);
            const reatilers = await useCase.excuteReatilers();
            res.status(200).json(reatilers)
        } catch (err :any) {
            res.status(400).json({ message: err.message });
        }
    }
}
