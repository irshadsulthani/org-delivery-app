import { MongoUserRepository } from "../../infrastructure/database/repositories/MongoUserRepository";

import { Request, Response } from "express";

const userRepo = new MongoUserRepository();
export class UserController {  
    static getGoogleLoginUser = async (req: Request, res: Response) => {
        try {
            const { email } = req.params;
            const user = await userRepo.findByEmail(email);
            res.status(200).json(user);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }
}