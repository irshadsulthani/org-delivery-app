// src/infrastructure/database/repositories/interface/ICustomerRepository.ts

<<<<<<< HEAD
import { Address, Customer } from "../../../../domain/entities/Customer";

export interface ICustomerRepository {
  findByUserId(userId: string): Promise<Customer | null>;
  updateProfile(userId: string, profileData: Partial<Customer>): Promise<Customer>;
  addAddress(userId: string, address: Address): Promise<Customer>;
  updateAddress(userId: string, addressId: string, address: Partial<Address>): Promise<Customer>;
  deleteAddress(userId: string, addressId: string): Promise<Customer>;
  setDefaultAddress(userId: string, addressId: string): Promise<Customer>;
=======
import { Customer } from "../../../../domain/entities/Customer";

export interface ICustomerRepository{
    findByUserId(userId: string): Promise<Customer | null>;
>>>>>>> d387b79 (feat:- now doing the customer address adding)
}