import axiosClient from "@/lib/axiosClient";
import { ErrorResponse, SuccessResponse } from "@/lib/models";
import { sleep } from "@/lib/utils";

const MAX_RETRY_COUNT = 32;

export const generateImageWithText2Img = async (request: any) => {
  try {
    const response = await axiosClient.post(
      `/generation/text2img`,
      {},
      {
        params: { ...request },
      }
    );
    return SuccessResponse(response.data);
  } catch (error) {
    return ErrorResponse(String(error));
  }
};

export const generateTextWithChatBot = async (request: any) => {
  try {
    const response = await axiosClient.post(
      `/generation/text`,
      {},
      {
        params: { ...request },
      }
    );
    return SuccessResponse(response.data);
  } catch (error) {
    return ErrorResponse(String(error));
  }
};

export const fetchTaskResult = async (taskId: string) => {
  try {
    const response = await axiosClient.get(`/generation/results/${taskId}`);
    return response.data;
  } catch (error) {
    return ErrorResponse(String(error));
  }
};

export const fetchDataWithRetry = async (
  taskId: string,
  retryCount: number,
  maxCount: number = MAX_RETRY_COUNT
): Promise<any> => {
  await sleep(5000);
  if (retryCount > maxCount) {
    return ErrorResponse(
      "Failed to fetch results from server after maximum retries exceeded"
    );
  }

  try {
    await sleep(mapCounterToSleepTime(retryCount));
    const response = await fetchTaskResult(taskId);
    if (!response.success) return ErrorResponse(response.message);
    if (response.data.status === "FAILED") {
      return ErrorResponse(response.data.message);
    } else if (response.data.status === "COMPLETED") {
      return SuccessResponse(response.data, response.message);
    } else if (response.data.status === "PENDING") {
      return fetchDataWithRetry(taskId, retryCount + 1, maxCount);
    } else {
      return fetchDataWithRetry(taskId, retryCount + 1, maxCount);
    }
  } catch (error) {
    if (retryCount === maxCount) {
      return ErrorResponse("Failed to fetch results from server");
    }
    await sleep(mapCounterToSleepTime(retryCount));
    return fetchDataWithRetry(taskId, retryCount + 1, maxCount);
  }
};

const mapCounterToSleepTime = (counter: number) => {
  if (counter <= 5) return 1000;
  if (counter <= 10) return 2000;
  if (counter <= 20) return 3000;
  return 1000;
};
