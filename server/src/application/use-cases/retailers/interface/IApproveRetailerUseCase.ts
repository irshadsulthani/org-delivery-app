

export interface IApproveRetailerUseCase{
    execute(id: string): Promise<void>;
}