import axiosClient from "@/lib/axiosClient";
import {APIResponse, ErrorResponse, SuccessResponse,} from "@/lib/models";

export const getModels = async (): Promise<APIResponse> => {
    try {
        const response = await axiosClient.get(`models`);
        return SuccessResponse(response.data);
    } catch (error: any) {
        return ErrorResponse(
            error?.response?.data?.detail ||
            "Something went wrong while getting user",
        );
    }
};
