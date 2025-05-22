import { VegetableProduct } from "../../../../domain/entities/Product";

export interface IGetAllProductsUseCase{
    execute(): Promise<VegetableProduct[]>;
}