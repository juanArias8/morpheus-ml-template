"use client";
import { Typography, TypographyVariant } from "@/components/atoms/Typography";
import { useEffect, useState } from "react";
import CircleLoader from "@/components/atoms/CircleLoader";
import { Button, ButtonVariant } from "@/components/atoms/Button";
import { useAlertMessage } from "@/components/organisms/AlertMessage/AlertMessageContext";

export default function ChatBotPage() {
  const { showErrorAlert } = useAlertMessage();
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [formValid, setFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prompt.length > 0) {
      setFormValid(true);
    }
  }, [prompt]);

  const handleGenerate = async () => {
    setLoading(true);
    // const response = await generateImageWithText2Img(prompt);
    // if (!response.success) {
    //   showErrorAlert(response.message);
    // }
    const fakeResult =
      "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor " +
      "incididunt ut labore et dolore magna aliqua.";
    const tempResults = [...results, fakeResult];
    setResults(tempResults);
    setLoading(false);
  };

  return (
    <main className="relative flex min-h-screen flex-col p-24">
      <Typography variant={TypographyVariant.Title}>
        Text generation - ChatBot
      </Typography>

      <Typography variant={TypographyVariant.Paragraph}>
        Chat with an artificial intelligence.
      </Typography>

      <div className="mt-10 flex w-auto flex-col">
        <textarea
          className="textarea textarea-primary"
          placeholder="Who are you?"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

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

      <div className="mt-10 flex flex-col flex-wrap">
        {results.map((result) => (
          <div className="flex w-full flex-row p-2 align-middle" key={result}>
            <div className="avatar placeholder">
              <div className="bg-neutral-focus text-neutral-content w-12 rounded-full">
                <span>MX</span>
              </div>
            </div>
            <div className="ml-5 flex flex-row align-middle">
              <Typography variant={TypographyVariant.Paragraph}>
                {result}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
