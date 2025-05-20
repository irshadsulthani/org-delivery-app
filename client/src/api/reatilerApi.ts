import privateApi from "./intreceptors/privateApi";
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

export const getRegistrationStatus = async (email: string) => {
    const response = await privateApi('get', `/retailer/register-status/${email}`)
    return response
}

export const addProduct = async (formData: FormData) =>{
    const response = await fileUploadApi('/retailer/add-product/', formData)
    return response
}

export const getRetailerProducts = async () => {
    const response = await privateApi('get', '/retailer/products')
    return response.data
}

export const deleteProduct = async (productId: string) => {
    const response = privateApi('post', `/retailer/delete-product/${productId}`)
    return response
}

export const getProductById = async (productId: string) => {
    const response = await privateApi('get', `/retailer/products/${productId}`)
    console.log('response',response);
    return response
}

export const updateProduct = async (productId: string, formData: FormData) => {
  // Change from post to put
  const response = await fileUploadApi(`/retailer/edit-product/${productId}`, formData, {
    method: 'PUT' // Explicitly specify PUT method
  });
  return response.data;
};
