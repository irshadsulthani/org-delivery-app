
export interface IUnBlockRetailerUseCase{
    execute(retailerId: string): Promise<void>;
}