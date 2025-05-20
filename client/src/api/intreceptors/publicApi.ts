// src/infrastructure/api/publicApi.ts
import axios from "axios";
import { config } from "../../config";

const BASE_URL = config.BACK_URL;

// Create a separate instance for file uploads
const fileInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data", // Changed from application/json
  },
});

// Original instance remains for JSON data
const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const publicApi = async (
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: any,
  config?: any
) => {
  const res = await instance.request({
    method,
    url,
    data,
    ...config,
  });
  return res.data;
};

export const fileUploadApi = async (
  url: string,
  formData: FormData,
  config?: any
) => {
  const method = config?.method || 'POST'; 
  const res = await fileInstance.request({
    method,
    url,
    data: formData,
    ...config,
  });
  return res.data;
};
