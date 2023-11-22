"use client";
import { RefObject, useEffect, useRef, useState } from "react";
import { Typography, TypographyVariant } from "@/components/atoms/Typography";
import GenerateButton from "@/components/molecules/GenerateButton";
import UserPrompt from "@/components/molecules/UserPrompt";
import ImageResults from "@/components/molecules/ImageResults";
import GeneratingCard from "@/components/molecules/GeneratingCard";
import useImageGeneration, {
  defaultConfig,
} from "@/app/(dashboard)/diffusion/useImageGeneration";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useModels } from "@/app/(dashboard)/ModelsContext";
import { SelectModel } from "@/components/atoms/Select";
import { Model } from "@/lib/models";

interface GenerationItem {
  prompt: string;
  images: string[];
}

export default function DiffusionPage() {
  const scrollRef: RefObject<any> = useRef(null);
  const { findValidModelsForCategory } = useModels();
  const { generateImage, loading, results } = useImageGeneration();

  const [prompt, setPrompt] = useState(defaultConfig.prompt);
  const [formValid, setFormValid] = useState(false);
  const [allResults, setAllResults] = useLocalStorage("diffusion", []);
  const [selectedModel, setSelectedModel] = useState("");
  const imageModels: Model[] = findValidModelsForCategory("text2img");

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

  const handleGenerateImage = async () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    await generateImage(prompt, selectedModel);
  };

  return (
    <section className="main-section">
      <div className="flex flex-row justify-between items-end">
        <div>
          <Typography variant={TypographyVariant.Title}>
            Image generation
          </Typography>

          <Typography variant={TypographyVariant.Paragraph}>
            Write your ideas and generate pictures from them.
          </Typography>
        </div>
        <SelectModel
          options={imageModels}
          value={selectedModel}
          setValue={setSelectedModel}
        />
      </div>

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
      <GeneratingCard open={loading} />

      <GenerateButton
        onClick={handleGenerateImage}
        promptValue={prompt}
        setPromptValue={setPrompt}
        disabled={!formValid}
        loading={loading}
      />

      <span className="mt-[500px] mb-[100px]" ref={scrollRef} />
    </section>
  );
}
