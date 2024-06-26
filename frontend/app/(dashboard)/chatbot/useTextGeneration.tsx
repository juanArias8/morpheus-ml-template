import { useState } from "react";
import {
  generateTextWithChatBot,
  getGenerationResult,
} from "@/api/generation-api";
import { useAlert } from "@/components/organisms/AlertMessage/AlertMessageContext";

export interface ChatBotRequest {
  prompt: string;
  context?: string;
  handler: string;
}

export const defaultConfig: ChatBotRequest = {
  prompt: "hey, are you there?",
  handler: "text-conversational-chat-glm",
};

const useTextGeneration = () => {
  const { showErrorAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<string>>([]);

  const generateText = async (
    prompt: string,
    handler: string = defaultConfig.handler,
  ): Promise<void> => {
    setLoading(true);
    const data: ChatBotRequest = {
      ...defaultConfig,
      prompt: prompt,
      handler: handler || defaultConfig.handler,
    };

    try {
      const responseRequest = await generateTextWithChatBot(data);
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

  return { generateText, loading, results };
};

export default useTextGeneration;
