import { UpdateProductDto } from "../../../../domain/dtos/UpdateProductDto";
import { VegetableProduct } from "../../../../domain/entities/Product";

export interface IUpdateProductUseCase {
  execute(dto: UpdateProductDto): Promise<VegetableProduct>;
}
