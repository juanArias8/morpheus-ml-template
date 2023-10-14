import axios, { AxiosResponse } from "axios";
import { getOrRefreshFirebaseToken } from "@/lib/firebaseClient";
import { logout } from "@/components/organisms/auth/auth-api";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: any) => {
    if (error.response.status === 401) {
      logout();
    }

    if (error.response.status === 403) {
      alert("you don't have permission to access this resource");
    }

    if (error.response.status === 404) {
      alert("resource not found");
    }

    return Promise.reject(error);
  }
);

axiosClient.interceptors.request.use(
  async (request: any) => {
    const token = await getOrRefreshFirebaseToken();

    if (token) {
      request?.headers &&
        (request.headers["Authorization"] = `Bearer ${token.replaceAll(
          '"',
          ""
        )}`);
    }
    return request;
  },
  (error: any) => {
    Promise.reject(error);
  }
);

export default axiosClient;
