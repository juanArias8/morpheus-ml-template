import React from "react";
import { LoginForm } from "./LoginForm";
import { ResetForm } from "./ResetForm";
import Brand from "@/components/atoms/Brand";
import { AuthOption, useAuth } from "@/components/organisms/Auth/AuthContext";
import {
  Typography,
  TypographyColor,
  TypographyVariant,
} from "@/components/atoms/Typography";
import { RegisterForm } from "@/components/organisms/Auth/RegisterForm";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button, ButtonVariant } from "@/components/atoms/Button";

export const Auth = () => {
  const { authOption } = useAuth();
  const router = useRouter();

  return (
    <div
      className="h-auto w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/landing2.webp')" }}
    >
      <div className="relative flex h-[92vh] min-h-[650px] items-center justify-center md:flex-col">
        <div
          className={cn(
            "bg-gradient-base-200 w-[700px] rounded-md p-1 hidden " +
              "lg:left-10 lg:absolute lg:flex flex-col lg:top-10",
          )}
        >
          <div className="card-container mx-auto p-4">
            <div className="bg-gradient-dark p-5 rounded-lg shadow-lg">
              <Typography
                variant={TypographyVariant.Title}
                color={TypographyColor.White}
                className={"drop-shadow-lg"}
              >
                Welcome to <br /> Morpheus ML Template
              </Typography>

              <Typography
                variant={TypographyVariant.Paragraph}
                className={"drop-shadow-lg mt-5"}
              >
                A template project to run generative AI models. You can run it
                on your local computer using Docker, or deploy it in the cloud
                on a K8s cluster.
              </Typography>
            </div>

            <Button
              text={"Check the docs"}
              variant={ButtonVariant.Primary}
              onClick={() => router.push("/docs")}
              className={"mt-5 w-[250px]"}
            />
          </div>
        </div>

        <div
          className={cn(
            "bg-gradient-dark rounded-md p-5 hidden " +
              "lg:bottom-10 lg:left-10 lg:right-10 lg:absolute lg:inline-flex",
          )}
        >
          <Typography
            variant={TypographyVariant.Span}
            color={TypographyColor.White}
          >
            Render of a 3D digital city with floating platforms representing
            different functionalities of Morpheus. Each platform is connected by
            light bridges, guiding users on their journey. The skyline features
            the prominent 'Morpheus' logo, with the tagline 'Unleash the Power
            of Generative AI' glowing beneath.
          </Typography>
        </div>

        <div
          className={cn(
            "bg-neutral w-[450px] rounded-lg p-8 shadow-lg " +
              "lg:absolute lg:right-10 lg:top-10",
          )}
        >
          <Brand styles={{ textAlign: "center" }} />

          {authOption === AuthOption.Login && <LoginForm />}
          {authOption === AuthOption.Register && <RegisterForm />}
          {authOption === AuthOption.Reset && <ResetForm />}
        </div>
      </div>
    </div>
  );
};
