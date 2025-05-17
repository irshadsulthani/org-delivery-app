import { RegisterRetailerInput } from "../../../../domain/dtos/RegisterRetailerInput";
import { RetailerShop } from "../../../../domain/entities/RetailerShop";

export interface IRegisterRetailerUseCase{
    execute(input: RegisterRetailerInput): Promise<RetailerShop>;
}