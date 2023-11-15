"use client";

import { Button, ButtonVariant } from "@/components/atoms/Button";
import {
  Typography,
  TypographyColor,
  TypographyVariant,
} from "@/components/atoms/Typography";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div
      className="flex flex-col justify-end items-center h-[92vh] p-2 pb-24 bg-white bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/not-found.png')" }}
    >
      <div className="text-center bg-neutral p-2 pb-10 rounded-md max-w-[700px]">
        <div className="card-container max-w-sm mx-auto p-4">
          <div className="bg-gradient-dark p-5 rounded-lg shadow-lg">
            <Typography
              variant={TypographyVariant.Title}
              color={TypographyColor.White}
            >
              Error 404
            </Typography>

            <Typography
              variant={TypographyVariant.Subtitle}
              color={TypographyColor.White}
              className="my-5"
            >
              The page you are looking for does not exist. <br />
              But don't worry, you can always go back to the home page.
            </Typography>
          </div>
        </div>

        <Button
          text={"Go to Home"}
          className={"mt-5"}
          variant={ButtonVariant.Primary}
          onClick={() => router.push("/")}
        />
      </div>
    </div>
  );
}
