// src/infrastructure/database/repositories/interface/ICustomerRepository.ts

import { Customer } from "../../../../domain/entities/Customer";

export interface ICustomerRepository{
    findByUserId(userId: string): Promise<Customer | null>;
}