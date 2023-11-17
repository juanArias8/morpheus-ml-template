import { useState } from "react";
import { generateRandomNumber } from "@/lib/utils";
import {
  generateImageWithText2Img,
  getGenerationResult,
} from "@/api/generation-api";
import { useAlert } from "@/components/organisms/AlertMessage/AlertMessageContext";

export interface DiffusionParams {
  prompt: string;
  width: number;
  height: number;
  num_inference_steps: number;
  guidance_scale: number;
  num_images_per_prompt: number;
  negative_prompt: string;
  generator: number;
  model_name: string;
  sampler: string;
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
  model_name: "Stable Diffusion XL Text2Img",
  sampler: "DDPMScheduler",
};

const useImageGeneration = () => {
  const { showErrorAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<string>>([]);

  const generateImage = async (prompt: string) => {
    setLoading(true);
    const randomGenerator = generateRandomNumber(20);
    const request = {
      ...defaultConfig,
      generator: randomGenerator,
      prompt: prompt,
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
      window.scrollTo(0, document.body.scrollHeight);
    }
  };

  return { generateImage, loading, results };
};

export default useImageGeneration;
