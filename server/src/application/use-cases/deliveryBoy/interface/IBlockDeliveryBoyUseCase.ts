
export interface IBlockDeliveryBoyUseCase{
    execute(id: string): Promise<void>;
}