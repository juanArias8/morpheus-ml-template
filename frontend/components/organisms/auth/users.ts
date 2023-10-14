import axiosClient from "@/lib/axiosClient";
import { signOutFirebase } from "@/components/organisms/auth/auth-api";
import { ErrorResponse, SuccessResponse, User } from "@/lib/models";

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

export const getUserInfo = async (email: string) => {
  try {
    // const response = await axiosClient.get(`users/email/${email}`);
    // if (response.status === 200 && response.data.email) {
    //   return SuccessResponse(response.data);
    // }
    // return ErrorResponse("User not found");
    return SuccessResponse({
      email: "juasda96@gmail.com",
      name: "Juan David Arias",
    });
  } catch (error: any) {
    return ErrorResponse(String(error));
  }
};

export const loadOrCreateUserInfo = async (user: User) => {
  try {
    const response = await axiosClient.post(`users`, user);
    if (response.status === 200 && response.data.email) {
      return SuccessResponse(response.data);
    }
    return ErrorResponse("Error loading user");
  } catch (error: any) {
    return ErrorResponse(String(error));
  }
};

export const updateUserInfo = async (user: User) => {
  try {
    const response = await axiosClient.put(`users`, user);
    if (response.status === 200 && response.data.email) {
      return SuccessResponse(response.data);
    }
    return ErrorResponse("Error updating user");
  } catch (error: any) {
    return ErrorResponse(String(error));
  }
};

export const removeUserInfo = async (email: string) => {
  try {
    const response = await axiosClient.delete(`users/${email}`);
    if (response.status === 200 && response.data.email) {
      return SuccessResponse(response.data);
    }
    return ErrorResponse("Error removing user");
  } catch (error: any) {
    return ErrorResponse(String(error));
  }
};
