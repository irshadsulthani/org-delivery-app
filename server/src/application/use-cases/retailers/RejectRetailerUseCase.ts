import { IRetailersRepository } from "../../../domain/interface/repositories/IRetailersRepository";


export class RejectRetailerUseCase {
    constructor(private _retailerRepo: IRetailersRepository) {}

    async execute(id: string): Promise<void> {
        await this._retailerRepo.updateVerificationStatus(id, false)
    }
}