import { User } from "../../entities/User";

export interface IAuthService {
    generateAccessToken(user: User): string;
    generateRefreshToken(user: User): string;
    verifyRefreshToken(token: string): any;
}