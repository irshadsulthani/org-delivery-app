// src/domain/interface/use-case/IVerifyOtpAndRegisterUser.ts

import { User } from "../../entities/User";


export interface IVerifyOtpAndRegisterUser {
  execute(user: User, enteredOtp: number, role?: User['role']): Promise<User>;
}
