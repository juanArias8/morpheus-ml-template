import { useState } from "react";
import { generateRandomNumber } from "@/lib/utils";
import { useAlert } from "@/components/organisms/AlertMessage/AlertMessageContext";
import {
  generateImageWithText2Img,
  getGenerationResult,
} from "@/api/generation-api";

export interface DiffusionParams {
  prompt: string;
  width: number;
  height: number;
  num_inference_steps: number;
  guidance_scale: number;
  num_images_per_prompt: number;
  negative_prompt: string;
  generator: number;
  handler: string;
}

export const defaultConfig: DiffusionParams = {
  prompt: "a beautiful picture of a cat",
  width: 768,
  height: 768,
  num_inference_steps: 50,
  guidance_scale: 10,
  num_images_per_prompt: 3,
  negative_prompt: "bad, ugly",
  generator: generateRandomNumber(20),
  handler: "text2img-sdxl",
};

const useImageGeneration = () => {
  const { showErrorAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<string>>([]);

  const generateImage = async (
    prompt: string,
    handler: string = defaultConfig.handler,
  ): Promise<void> => {
    setLoading(true);
    const randomGenerator = generateRandomNumber(20);
    const request: DiffusionParams = {
      ...defaultConfig,
      generator: randomGenerator,
      prompt: prompt,
      handler: handler || defaultConfig.handler,
    };

    try {
      const responseRequest = await generateImageWithText2Img(request);
      if (!responseRequest.success) {
        showErrorAlert(responseRequest.message);
        return;
      }

      const responseResults = await getGenerationResult(
        responseRequest.data.task_id,
      );
      if (!responseResults.success) {
        showErrorAlert(responseResults.message);
        return;
      }

      setResults(responseResults.data.results);
    } catch (error: any) {
      showErrorAlert(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { generateImage, loading, results };
};

export default useImageGeneration;
