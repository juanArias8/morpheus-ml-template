"use client";
import { Typography, TypographyVariant } from "@/components/atoms/Typography";
import { Fragment, useEffect, useState } from "react";
import { useAlertMessage } from "@/components/organisms/AlertMessage/AlertMessageContext";
import GenerateButton from "@/components/molecules/GenerateButton";
import {
  generateTextWithChatBot,
  getGenerationResult,
} from "@/api/generation-api";
import ResultText from "@/components/molecules/ResultText";
import UserPrompt from "@/components/molecules/UserPrompt";
import GeneratingModal from "@/components/molecules/GeneratingModal";

interface ChatBotItem {
  prompt: string;
  text: string;
}

interface ChatBotRequest {
  prompt: string;
  model_name: string;
}

const defaultConfig: ChatBotRequest = {
  prompt: "hey, are you there?",
  model_name: "ChatGLM-6B",
};

export default function ChatBotPage() {
  const { showErrorAlert } = useAlertMessage();
  const [prompt, setPrompt] = useState(defaultConfig.prompt);
  const [results, setResults] = useState<ChatBotItem[]>([]);
  const [formValid, setFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prompt.length > 0) {
      setFormValid(true);
    }
  }, [prompt]);

  const handleGenerate = async () => {
    setLoading(true);
    const data: ChatBotRequest = {
      ...defaultConfig,
      prompt: prompt,
    };
    const response = await generateTextWithChatBot(data);
    if (!response.success) {
      showErrorAlert(response.message);
    }
    const responseResults = await getGenerationResult(response.data.task_id);
    const chatBotItem: ChatBotItem = {
      prompt: prompt,
      text: responseResults.data.results[0],
    };
    const tempResults = [...results, chatBotItem];
    setResults(tempResults);
    setLoading(false);
  };

  return (
    <section className="main-section">
      <Typography variant={TypographyVariant.Title}>
        Text generation - ChatBot
      </Typography>

      <Typography variant={TypographyVariant.Paragraph}>
        Chat with an artificial intelligence.
      </Typography>

      <GenerateButton
        onClick={handleGenerate}
        promptValue={prompt}
        setPromptValue={setPrompt}
        disabled={!formValid}
        loading={loading}
      />

      <div className="mt-10 flex flex-col flex-wrap">
        {results.map((item: ChatBotItem, index: number) => (
          <Fragment key={index}>
            <UserPrompt prompt={item.prompt} />

            <ResultText key={index} text={item.text} />
          </Fragment>
        ))}
      </div>

      <GeneratingModal open={loading} />
    </section>
  );
}
