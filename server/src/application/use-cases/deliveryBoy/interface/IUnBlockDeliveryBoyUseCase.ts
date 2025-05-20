
export interface IUnBlockDeliveryBoyUseCase{
    execute(deliveryboyId: string): Promise<void>;
}