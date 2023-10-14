"use client";
import { Typography, TypographyVariant } from "@/components/atoms/Typography";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Typography variant={TypographyVariant.Title}>
        Welcome to Morpheus
      </Typography>
    </main>
  );
}
