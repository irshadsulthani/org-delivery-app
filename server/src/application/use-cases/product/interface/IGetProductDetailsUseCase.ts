import { VegetableProduct } from "../../../../domain/entities/Product";

export interface IGetProductDetailsUseCase {
  execute(productId: string): Promise<VegetableProduct | null>;
}
