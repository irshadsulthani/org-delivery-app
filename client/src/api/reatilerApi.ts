import { fileUploadApi, publicApi } from "./intreceptors/publicApi";



export const sendSignupOtp = async (email: string) => {
    const response = await publicApi('post', '/auth/send-otp', {
        email,
        action: 'signup'
    });
    return response;
}

export const verifySignupOtp = (otp: string, formData: any) => {
    return publicApi('post', '/auth/verify-otp', {
      ...formData,
      otp,
      role: 'retailer',
    });
};

export const loginReatiler = async (loginData:{email: string; password:string}) => {
    const response = await publicApi('post', '/auth/retailer-login', loginData)
    return response
}

export const logoutReatiler = async () => {
    const response = await publicApi('post', '/auth/reatiler-logout')
    return response
}

export const registerRetailer = async (formData: FormData)=> {
    const response = await fileUploadApi('/retailer/register-retailer',formData)
    return response
}