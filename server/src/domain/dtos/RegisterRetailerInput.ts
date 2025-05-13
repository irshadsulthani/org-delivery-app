export interface AddressDetails {
    street:string,
    area:string,
    city:string,
    state:string,
    zipCode:string,
    country:string
}

export interface FileInputs{
    shopImage: Express.Multer.File
    shopLicense: Express.Multer.File
}

export interface RegisterRetailerInput extends AddressDetails, FileInputs {
    userId: string;
    shopName: string
    description?: string
    phone:string
}