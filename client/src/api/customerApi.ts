// src/api/customerApi.ts
import privateApi from "./intreceptors/privateApi";
import { fileUploadApi } from "./intreceptors/publicApi";

export const getDashboardData = async () => {
  const response = await privateApi('get', '/user/dashboard');
  return response;
};

export const getCustomerProfile = async () => {
  const response = await privateApi('get', '/user/profile');
  return response;
};

export const updateCustomerProfile = async (formData: FormData) => {
  const response = await fileUploadApi('/user/profile', formData, { 
    method: 'PATCH',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
};

export const addCustomerAddress = async (address: any) => {
  const response = await privateApi('post', '/user/addresses', address);
  return response.data;
};

export const updateCustomerAddress = async (addressId: string, address: any) => {
  const response = await privateApi('patch', `/user/addresses/${addressId}`, address);
  return response.data;
};

export const deleteCustomerAddress = async (addressId: string) => {
  const response = await privateApi('delete', `/user/addresses/${addressId}`);
  return response.data;
};

export const getCustomerOrders = async () => {
  const response = await privateApi('get', '/user/orders');
  return response.data;
};

export const getWalletDetails = async () => {
  const response = await privateApi('get', '/customer/wallet');
  return response.data;
};

export const getWalletTransactions = async () => {
  const response = await privateApi('get', '/customer/wallet/transactions');
  return response.data;
}