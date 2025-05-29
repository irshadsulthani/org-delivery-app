// src/application/usecase/customer/interface/IGetCustomerDashboardUseCase.ts

import { Customer } from "../../../../domain/entities/Customer";

export interface IGetCustomerDashboardUseCase {
    execute(userId: string): Promise<Customer>;
}