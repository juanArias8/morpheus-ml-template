"use client";
import { Typography, TypographyVariant } from "@/components/atoms/Typography";
import { Button, ButtonVariant } from "@/components/atoms/Button";
import { Fragment, useEffect, useState } from "react";
import GenerateButton from "@/components/molecules/GenerateButton";
import ResultText from "@/components/molecules/ResultText";
import ImageResults from "@/components/molecules/ImageResults";
import useTextGeneration from "@/app/(dashboard)/chatbot/useTextGeneration";
import useImageGeneration from "@/app/(dashboard)/diffusion/useImageGeneration";
import GeneratingModal from "@/components/molecules/GeneratingModal";
import useLocalStorage from "@/hooks/useLocalStorage";

interface StoryBookItem {
  prompt: string;
  text: string;
  images?: string[];
}

const basePrompt: string =
  "Write a story's first paragraph about a lost explorer discovering an ancient, hidden city.";

export default function StorytellingPage() {
  const {
    generateText,
    results: textResults,
    loading: textLoading,
  } = useTextGeneration();
  const {
    generateImage,
    results: imageResults,
    loading: imageLoading,
  } = useImageGeneration();
  const [prompt, setPrompt] = useState(basePrompt);
  const [storyBook, setStoryBook] = useLocalStorage("storyBook", []);
  const [formValid, setFormValid] = useState(false);
  const [indexForImageGeneration, setIndexForImageGeneration] = useState(0);

  // Validates the prompt input
  useEffect(() => {
    if (prompt.length > 0) {
      setFormValid(true);
    }
  }, [prompt]);

  // Adds the text result to the story book
  useEffect(() => {
    if (textResults.length > 0) {
      const storyBookItem: StoryBookItem = {
        prompt: prompt,
        text: textResults[0],
      };
      setStoryBook([...storyBook, storyBookItem]);
    }
  }, [textResults]);

  // Adds the image result to the story book page
  useEffect(() => {
    if (imageResults.length > 0) {
      const storyBookCopy = [...storyBook];
      storyBookCopy[indexForImageGeneration].images = imageResults;
      setStoryBook(storyBookCopy);
    }
  }, [imageResults]);

  const handleGenerateImage = async (pageIndex: number) => {
    setIndexForImageGeneration(pageIndex);
    const page = storyBook[pageIndex];
    await generateImage(page.text);
  };

  return (
    <section className="main-section">
      <Typography variant={TypographyVariant.Title}>Story Telling</Typography>

      <Typography variant={TypographyVariant.Paragraph}>
        Build a story with an artificial intelligence.
      </Typography>

      <GenerateButton
        onClick={() => generateText(prompt)}
        promptValue={prompt}
        setPromptValue={setPrompt}
        disabled={!formValid}
        loading={textLoading}
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
                disabled={imageLoading || !formValid}
                className="btn btn-primary bt-5"
                loading={imageLoading}
                onClick={() => handleGenerateImage(index)}
              />
            ) : (
              <ImageResults images={page.images} />
            )}
          </Fragment>
        ))}
      </div>

      <GeneratingModal open={textLoading || imageLoading} />
    </section>
  );
}
