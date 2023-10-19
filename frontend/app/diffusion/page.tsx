"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Typography, TypographyVariant } from "@/components/atoms/Typography";
import CircleLoader from "@/components/atoms/CircleLoader";
import { Button, ButtonVariant } from "@/components/atoms/Button";
import { generateImageWithText2Img } from "@/api/generation-api";
import { useAlertMessage } from "@/components/organisms/AlertMessage/AlertMessageContext";

export default function DiffusionPage() {
  const { showErrorAlert } = useAlertMessage();
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState([]);
  const [formValid, setFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prompt.length > 0) {
      setFormValid(true);
    }
  }, [prompt]);

  const handleGenerate = async () => {
    setLoading(true);
    const response = await generateImageWithText2Img(prompt);
    if (!response.success) {
      showErrorAlert(response.message);
    }
    setResults(response.data);
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col p-24">
      <Typography variant={TypographyVariant.Title}>
        Image generation
      </Typography>

      <Typography variant={TypographyVariant.Paragraph}>
        Write your ideas and generate pictures from them.
      </Typography>

      <div className="mt-10 flex w-full flex-col">
        <textarea
          className="textarea textarea-primary"
          placeholder="Bio"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        ></textarea>

        {loading ? (
          <CircleLoader isLoading={loading} />
        ) : (
          <Button
            text={"Generate"}
            btnClass={"mt-2"}
            variant={ButtonVariant.Primary}
            disabled={loading || !formValid}
            className="btn btn-primary bt-5"
            onClick={handleGenerate}
          />
        )}
      </div>

      <div className="flex flex-row flex-wrap">
        {results.map((result) => (
          <div className="flex w-1/3 flex-col p-2" key={result}>
            <Image
              src={result}
              width={200}
              height={200}
              className="object-contain"
              alt="result image"
            />
          </div>
        ))}
      </div>
    </main>
  );
}
