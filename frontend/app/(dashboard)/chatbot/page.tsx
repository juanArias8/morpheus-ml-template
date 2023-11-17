"use client";
import { Typography, TypographyVariant } from "@/components/atoms/Typography";
import { useEffect, useState } from "react";
import GenerateButton from "@/components/molecules/GenerateButton";
import ResultText from "@/components/molecules/ResultText";
import UserPrompt from "@/components/molecules/UserPrompt";
import GeneratingModal from "@/components/molecules/GeneratingModal";
import useTextGeneration, {
  defaultConfig,
} from "@/app/(dashboard)/chatbot/useTextGeneration";
import useLocalStorage from "@/hooks/useLocalStorage";

interface ChatBotItem {
  prompt: string;
  text: string;
}

export default function ChatBotPage() {
  const { generateText, loading, results } = useTextGeneration();
  const [prompt, setPrompt] = useState(defaultConfig.prompt);
  const [formValid, setFormValid] = useState(false);
  const [allResults, setAllResults] = useLocalStorage("chatBot", []);

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

  return (
    <section className="main-section">
      <Typography variant={TypographyVariant.Title}>
        Text generation - ChatBot
      </Typography>

      <Typography variant={TypographyVariant.Paragraph}>
        Chat with an artificial intelligence.
      </Typography>

      <GenerateButton
        onClick={() => generateText(prompt)}
        promptValue={prompt}
        setPromptValue={setPrompt}
        disabled={!formValid}
        loading={loading}
      />

      <div className="mt-10 flex flex-col flex-wrap">
        {allResults.map((item: ChatBotItem, index: number) => (
          <div key={index} className="mt-10">
            <UserPrompt prompt={item.prompt} />

            <ResultText key={index} text={item.text} />
          </div>
        ))}
      </div>

      <GeneratingModal open={loading} />
    </section>
  );
}
