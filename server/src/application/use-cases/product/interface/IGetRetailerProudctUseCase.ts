import { VegetableProduct } from "../../../../domain/entities/Product";


export interface IGetRetailerProudctUseCase {
      execute(retailerId: string): Promise<VegetableProduct[]>;

}