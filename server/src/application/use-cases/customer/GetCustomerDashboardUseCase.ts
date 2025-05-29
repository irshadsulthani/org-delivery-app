import { Customer } from "../../../domain/entities/Customer";
import { ICustomerRepository } from "../../../infrastructure/database/repositories/interface/ICustomerRepository";
import { IGetCustomerDashboardUseCase } from "./interface/IGetCustomerDashboardUseCase";

export class GetCustomerDashboardUseCase implements IGetCustomerDashboardUseCase {
    constructor(private customerRepository: ICustomerRepository) {}
    
    async execute(userId: string): Promise<Customer> {
        console.log('Executing GetCustomerDashboardUseCase for userId:', userId);
        const customer = await this.customerRepository.findByUserId(userId);
        console.log('Customer fetched:', customer);
        if (!customer) {
            throw new Error(`Customer with userId ${userId} not found`);
        }
        console.log('customer',customer);
        
        return customer;
    }
}