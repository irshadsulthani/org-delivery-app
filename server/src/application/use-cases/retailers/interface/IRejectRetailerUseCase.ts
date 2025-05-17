export interface IRejectRetailerUseCase {
    execute(id: string): Promise<void>;
}