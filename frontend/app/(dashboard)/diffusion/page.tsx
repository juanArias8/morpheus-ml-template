"use client";
import { useEffect, useState } from "react";
import { Typography, TypographyVariant } from "@/components/atoms/Typography";
import GenerateButton from "@/components/molecules/GenerateButton";
import UserPrompt from "@/components/molecules/UserPrompt";
import ImageResults from "@/components/molecules/ImageResults";
import GeneratingModal from "@/components/molecules/GeneratingModal";
import useImageGeneration, {
  defaultConfig,
} from "@/app/(dashboard)/diffusion/useImageGeneration";
import useLocalStorage from "@/hooks/useLocalStorage";

interface GenerationItem {
  prompt: string;
  images: string[];
}

export default function DiffusionPage() {
  const { generateImage, loading, results } = useImageGeneration();
  const [prompt, setPrompt] = useState(defaultConfig.prompt);
  const [formValid, setFormValid] = useState(false);
  const [allResults, setAllResults] = useLocalStorage("diffusion", []);

  useEffect(() => {
    if (prompt.length > 0) {
      setFormValid(true);
    }
  }, [prompt]);

  useEffect(() => {
    if (results.length > 0) {
      const generationItem: GenerationItem = {
        prompt: prompt,
        images: results,
      };
      setAllResults([...allResults, generationItem]);
    }
  }, [results]);

  return (
    <section className="main-section">
      <Typography variant={TypographyVariant.Title}>
        Image generation
      </Typography>

      <Typography variant={TypographyVariant.Paragraph}>
        Write your ideas and generate pictures from them.
      </Typography>

      <GenerateButton
        onClick={() => generateImage(prompt)}
        promptValue={prompt}
        setPromptValue={setPrompt}
        disabled={!formValid}
        loading={loading}
      />

      <div className="flex flex-col">
        {allResults.map((result: GenerationItem, index: number) => (
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
