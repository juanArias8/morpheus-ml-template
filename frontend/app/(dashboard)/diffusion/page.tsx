"use client";
import { useEffect, useState } from "react";
import { Typography, TypographyVariant } from "@/components/atoms/Typography";
import {
  generateImageWithText2Img,
  getGenerationResult,
} from "@/api/generation-api";
import { useAlertMessage } from "@/components/organisms/AlertMessage/AlertMessageContext";
import GenerateButton from "@/components/molecules/GenerateButton";
import UserPrompt from "@/components/molecules/UserPrompt";
import ImageResults from "@/components/molecules/ImageResults";
import { generateRandomNumber } from "@/lib/utils";
import GeneratingModal from "@/components/molecules/GeneratingModal";

interface ImageItem {
  prompt: string;
  images: string[];
}

interface DiffusionParams {
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

const defaultConfig: DiffusionParams = {
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

export default function DiffusionPage() {
  const { showErrorAlert } = useAlertMessage();
  const [prompt, setPrompt] = useState(defaultConfig.prompt);
  const [results, setResults] = useState<Array<ImageItem>>([]);
  const [formValid, setFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prompt.length > 0) {
      setFormValid(true);
    }
  }, [prompt]);

  const handleGenerate = async () => {
    setLoading(true);
    const randomGenerator = generateRandomNumber(20);
    const request: DiffusionParams = {
      ...defaultConfig,
      generator: randomGenerator,
      prompt: prompt,
    };
    const responseRequest = await generateImageWithText2Img(request);
    if (!responseRequest.success) {
      showErrorAlert(responseRequest.message);
    }
    const responseResults = await getGenerationResult(
      responseRequest.data.task_id,
    );
    console.log(responseResults);
    if (!responseResults.success) {
      showErrorAlert(responseResults.message);
    }
    const imageItem: ImageItem = {
      prompt: prompt,
      images: responseResults.data.results,
    };
    setResults([...results, imageItem]);
    setLoading(false);
    window.scrollTo(0, document.body.scrollHeight);
  };

  return (
    <section className="main-section">
      <Typography variant={TypographyVariant.Title}>
        Image generation
      </Typography>

      <Typography variant={TypographyVariant.Paragraph}>
        Write your ideas and generate pictures from them.
      </Typography>

      <GenerateButton
        onClick={handleGenerate}
        promptValue={prompt}
        setPromptValue={setPrompt}
        disabled={!formValid}
        loading={loading}
      />

      <div className="flex flex-col">
        {results.map((result: ImageItem, index: number) => (
          <div
            className="flex flex-col mt-10 bg-base-200 rounded-lg px-5 py-5"
            key={index}
          >
            <UserPrompt prompt={result.prompt} className={"!px-0"} />
            <ImageResults images={result.images} />
          </div>
        ))}
      </div>

      <GeneratingModal open={loading} />
    </section>
  );
}
