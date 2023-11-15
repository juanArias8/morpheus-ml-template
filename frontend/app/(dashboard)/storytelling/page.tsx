"use client";
import { Typography, TypographyVariant } from "@/components/atoms/Typography";
import { Button, ButtonVariant } from "@/components/atoms/Button";
import { useAlertMessage } from "@/components/organisms/AlertMessage/AlertMessageContext";
import { Fragment, useEffect, useState } from "react";
import {
  generateImageWithText2Img,
  generateTextWithChatBot,
} from "@/api/generation-api";
import GenerateButton from "@/components/molecules/GenerateButton";
import ResultText from "@/components/molecules/ResultText";
import ImageResults from "@/components/molecules/ImageResults";

interface StoryBookItem {
  prompt: string;
  text: string;
  images?: string[];
}

export default function StorytellingPage() {
  const { showErrorAlert } = useAlertMessage();
  const [prompt, setPrompt] = useState("");
  const [storyBook, setStoryBook] = useState<Array<StoryBookItem>>([]);
  const [formValid, setFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prompt.length > 0) {
      setFormValid(true);
    }
  }, [prompt]);

  useEffect(() => {}, [storyBook]);

  const handleGenerateText = async () => {
    setLoading(true);
    try {
      const response = await generateTextWithChatBot(prompt);
      if (!response.success) {
        showErrorAlert(response.message);
      }
      setLoading(false);
      const storyBookItem: StoryBookItem = {
        prompt: prompt,
        text: response.data.text,
      };
      setStoryBook([...storyBook, storyBookItem]);
    } catch (err) {
      showErrorAlert(String(err));
      setLoading(false);
    }
  };

  const handleGenerateImage = async (index: number) => {
    setLoading(true);
    try {
      const response = await generateImageWithText2Img(prompt);
      if (!response.success) {
        showErrorAlert(response.message);
      }
      setLoading(false);
      const storyBookCopy = [...storyBook];
      storyBookCopy[index].images = response.data.images;
      setStoryBook(storyBookCopy);
    } catch (err) {
      showErrorAlert(String(err));
      setLoading(false);
    }
  };

  return (
    <section className="main-section">
      <Typography variant={TypographyVariant.Title}>Story Telling</Typography>

      <Typography variant={TypographyVariant.Paragraph}>
        Build a story with an artificial intelligence.
      </Typography>

      <GenerateButton
        onClick={handleGenerateText}
        promptValue={prompt}
        setPromptValue={setPrompt}
        disabled={!formValid}
        loading={loading}
      />

      <div className="relative flex flex-col flex-wrap">
        {storyBook.map((page: StoryBookItem, index: number) => (
          <Fragment key={index}>
            <ResultText text={page.text} className={"mb-0"} />

            {!page.images ? (
              <Button
                text={"Generate Image"}
                btnClass={"mt-2 max-w-[180px]"}
                variant={ButtonVariant.Primary}
                disabled={loading || !formValid}
                className="btn btn-primary bt-5"
                onClick={() => handleGenerateImage(storyBook.indexOf(page))}
              />
            ) : (
              <ImageResults images={page.images} />
            )}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
