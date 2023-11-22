"use client";
import { Typography, TypographyVariant } from "@/components/atoms/Typography";
import { RefObject, useEffect, useRef, useState } from "react";
import GenerateButton from "@/components/molecules/GenerateButton";
import ResultText from "@/components/molecules/ResultText";
import UserPrompt from "@/components/molecules/UserPrompt";
import GeneratingCard from "@/components/molecules/GeneratingCard";
import useTextGeneration, {
  defaultConfig,
} from "@/app/(dashboard)/chatbot/useTextGeneration";
import useLocalStorage from "@/hooks/useLocalStorage";
import { SelectModel } from "@/components/atoms/Select";
import { useModels } from "@/app/(dashboard)/ModelsContext";
import { Model } from "@/lib/models";

interface ChatBotItem {
  prompt: string;
  text: string;
}

export default function ChatBotPage() {
  const scrollRef: RefObject<any> = useRef(null);
  const { findValidModelsForCategory } = useModels();
  const { generateText, loading, results } = useTextGeneration();

  const [prompt, setPrompt] = useState(defaultConfig.prompt);
  const [formValid, setFormValid] = useState(false);
  const [allResults, setAllResults] = useLocalStorage("chatBot", []);
  const [selectedModel, setSelectedModel] = useState("");
  const imageModels: Model[] = findValidModelsForCategory(
    "text-conversational",
  );

  useEffect(() => {
    if (prompt.length > 0) {
      setFormValid(true);
    }
  }, [prompt]);

  useEffect(() => {
    if (results.length > 0) {
      const chatBotItem: ChatBotItem = {
        prompt: prompt,
        text: results[0],
      };
      setAllResults([...allResults, chatBotItem]);
    }
  }, [results]);

  const handleGenerateImage = async () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    await generateText(prompt, selectedModel);
  };

  return (
    <section className="main-section">
      <div className="flex flex-row justify-between items-end">
        <div>
          <Typography variant={TypographyVariant.Title}>
            Text generation - ChatBot
          </Typography>

          <Typography variant={TypographyVariant.Paragraph}>
            Chat with an artificial intelligence.
          </Typography>
        </div>
        <SelectModel
          options={imageModels}
          value={selectedModel}
          setValue={setSelectedModel}
        />
      </div>

      <div className="mt-10 flex flex-col flex-wrap">
        {allResults.map((item: ChatBotItem, index: number) => (
          <div key={index} className="mt-10">
            <UserPrompt prompt={item.prompt} />

            <ResultText key={index} text={item.text} />
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
