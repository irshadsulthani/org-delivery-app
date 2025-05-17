import { User } from "../../../../domain/entities/User";

export interface IRegisterUser {
  execute(user: User): Promise<User>;
}
