export interface APIResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export interface ModelCategory {
  key: string;
  name: string;
  description?: string;
}

export interface Model {
  id?: string;
  name: string;
  handler: string;
  description?: string;
  url_docs?: string;
  category: ModelCategory;
  extra_params?: any;
  is_active?: boolean;
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  is_active?: boolean;
}

export const ErrorResponse = (
  message: string = "An unexpected error occurred during the operation",
) => {
  return { success: false, message: message, data: null };
};

export const SuccessResponse = (
  data: any,
  message: string = "Operation completed successfully",
) => {
  return { success: true, data: data, message: message };
};
