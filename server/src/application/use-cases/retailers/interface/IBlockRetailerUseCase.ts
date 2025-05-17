
export interface IBlockRetailerUseCase{
    execute(id: string): Promise<void>;
}