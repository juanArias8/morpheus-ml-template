import axiosClient from "@/lib/axiosClient";
import { APIResponse, ErrorResponse, SuccessResponse } from "@/lib/models";
import { NewsletterForm } from "@/components/organisms/Newsletter/NewsletterForm";

export const registerNewUserToNewsletter = async (
  data: NewsletterForm,
): Promise<APIResponse> => {
  try {
    const response = await axiosClient.post(`newsletter`, data);
    return SuccessResponse(response.data);
  } catch (error: any) {
    return ErrorResponse(
      error?.response?.data?.detail ||
        "Something went wrong while registering user to newsletter",
    );
  }
};

export const removeUserFromNewsletter = async (
  email: string,
): Promise<APIResponse> => {
  try {
    const response = await axiosClient.delete(`newsletter/${email}`);
    return SuccessResponse(response.data);
  } catch (error: any) {
    return ErrorResponse(
      error?.response?.data?.detail ||
        "Something went wrong while removing user from newsletter",
    );
  }
};
