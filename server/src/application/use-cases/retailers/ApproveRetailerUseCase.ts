import { IRetailersRepository } from "../../../domain/interface/repositories/IRetailersRepository";


export class ApproveRetailerUseCase {
    static execute() {
      throw new Error('Method not implemented.');
    }
    constructor (private _retailerRepo: IRetailersRepository) {}

    async execute(id: string): Promise <void> {
        await this._retailerRepo.updateVerificationStatus(id, true)
    }
}