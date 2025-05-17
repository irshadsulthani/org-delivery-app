import { User } from "../../../../domain/entities/User";


export interface IGoogleLoginUser{
    execute(profile :any) : Promise<User>
}