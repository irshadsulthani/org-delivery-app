export interface IUnBlockCustomer {
    execute(customerId: string): Promise<void>;
}