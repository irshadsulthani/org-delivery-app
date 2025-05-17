import { RetailerShop } from "../../../../domain/entities/RetailerShop";


export interface IGetRetailerByIdUseCase{
    execute(id: string): Promise<RetailerShop>;
}