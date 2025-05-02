import axios from "axios";
import { config } from "../../config";

const BASE_URL = config.BACK_URL;

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

export default publicApi;
