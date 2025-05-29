export interface AddressResponseDto {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface CustomerResponseDto {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    isBlocked: boolean;
  };
  phone: string;
  addresses: AddressResponseDto[];
  dateOfBirth: Date;
  profileImageUrl: string;
  createdAt: Date;
}
