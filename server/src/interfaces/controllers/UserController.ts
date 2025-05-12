import { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository";
import { StatusCode } from "../../utils/statusCode";

const userRepo = new UserRepository();

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
}
