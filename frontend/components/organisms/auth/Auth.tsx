import React from "react";
import { LoginForm } from "./LoginForm/LoginForm";
import { ResetForm } from "./ResetForm/ResetForm";
import Brand from "@/components/atoms/Brand/Brand";
import { AuthOption, useAuth } from "@/components/organisms/auth/AuthContext";
import { Typography, TypographyVariant } from "@/components/atoms/Typography";

export const Auth = () => {
  const { authOption } = useAuth();

  return (
    <div
      className="ah-auto w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/1.png')" }}
    >
      <div className="relative flex min-h-screen items-center justify-center">
        <div className="bg-neutral absolute left-10  top-10 w-[400px] rounded-md p-5 ">
          <Typography variant={TypographyVariant.Subtitle}>
            Surrealist painting of a floating island with giant clock gears,
            populated with mythical creatures.
          </Typography>
        </div>

        <div className="bg-neutral absolute right-10 ml-10 rounded-lg p-8 shadow-lg ">
          <Brand styles={{ textAlign: "center" }} />

          {authOption === AuthOption.Login && <LoginForm />}
          {authOption === AuthOption.Reset && <ResetForm />}
        </div>
      </div>
    </div>
  );
};
