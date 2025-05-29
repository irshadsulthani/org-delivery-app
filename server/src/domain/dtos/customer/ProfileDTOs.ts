// src/domain/dtos/customer/ProfileDTOs.ts
import { Address } from "../../entities/Customer";

export interface ProfileResponseDTO {
  name: string;
  email: string;
  phone?: string;
  profileImageUrl?: string;
  addresses: Address[];
}

export interface UpdateProfileDTO {
  name?: string;
  phone?: string;
}

export interface AddressDTO {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UpdateAddressDTO extends Partial<AddressDTO> {
  isDefault?: boolean;
}