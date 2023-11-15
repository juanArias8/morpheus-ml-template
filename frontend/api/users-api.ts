import axiosClient from "@/lib/axiosClient";
import { signOutFirebase } from "@/api/auth-api";
import {
  APIResponse,
  ErrorResponse,
  SuccessResponse,
  User,
} from "@/lib/models";

export const logout = () => {
  return signOutFirebase()
    .then(() => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("results");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    })
    .catch((error: any) => {
      alert(error);
    });
};

export const getUserInfo = async (email: string): Promise<APIResponse> => {
  try {
    const response = await axiosClient.get(`users/email/${email}`);
    return SuccessResponse(response.data);
  } catch (error: any) {
    return ErrorResponse(
      error?.response?.data?.detail ||
        "Something went wrong while getting user",
    );
  }
};

export const loadOrCreateUserInfo = async (
  user: User,
): Promise<APIResponse> => {
  try {
    const response = await axiosClient.post(`users`, user);
    return SuccessResponse(response.data);
  } catch (error: any) {
    return ErrorResponse(
      error?.response?.data?.detail ||
        "Something went wrong while creating user",
    );
  }
};

export const updateUserInfo = async (user: User): Promise<APIResponse> => {
  try {
    const response = await axiosClient.put(`users`, user);
    return SuccessResponse(response.data);
  } catch (error: any) {
    return ErrorResponse(
      error?.response?.data?.detail ||
        "Something went wrong while updating user",
    );
  }
};

export const removeUserInfo = async (email: string): Promise<APIResponse> => {
  try {
    const response = await axiosClient.delete(`users/${email}`);
    return SuccessResponse(response.data);
  } catch (error: any) {
    return ErrorResponse(
      error?.response?.data?.detail ||
        "Something went wrong while removing user",
    );
  }
};
