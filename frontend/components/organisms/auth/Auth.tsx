import React from "react";
import { LoginForm } from "./LoginForm/LoginForm";
import { ResetForm } from "./ResetForm/ResetForm";
import Brand from "@/components/atoms/Brand/Brand";
import { AuthOption, useAuth } from "@/components/organisms/auth/AuthContext";
import { Typography, TypographyVariant } from "@/components/atoms/Typography";

export const Auth = () => {
  const { authOption } = useAuth();

  return (
    <div className={"flex h-auto w-full flex-col"}>
      <div className={"w-[400px] bg-gray-600"}>
        <Typography variant={TypographyVariant.Subtitle}>
          The god janus protecting the entrance to a digital, futuristic,
          mythical, information system, dramatic lighting, cgsociety, realistic,
          hyper detailed, insane details, intricate, dramatic lighting, hyper
          maximalist, golden r
        </Typography>
      </div>

      <div className={"h-auto w-full"}>
        <Brand styles={{ textAlign: "center" }} />

        {authOption === AuthOption.Login && <LoginForm />}
        {authOption === AuthOption.Reset && <ResetForm />}
      </div>
    </div>
  );
};
