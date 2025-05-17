import { RetailerShop } from "../../../../domain/entities/RetailerShop";

export interface IGetPendingRetailerUseCase {
    execute(): Promise<RetailerShop[]>;
}