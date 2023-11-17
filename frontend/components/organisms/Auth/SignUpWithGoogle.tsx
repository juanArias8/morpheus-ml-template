import React, { useState } from "react";
import { Button, ButtonFill, ButtonVariant } from "@/components/atoms/Button";
import { useAuth } from "@/components/organisms/Auth/AuthContext";
import { GoogleIcon } from "@/components/atoms/icons/google";
import { useAlert } from "@/components/organisms/AlertMessage/AlertMessageContext";

export const SignUpWithGoogle = () => {
  const { loginWithGoogle } = useAuth();
  const { showErrorAlert } = useAlert();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    loginWithGoogle()
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        showErrorAlert(error.message);
      });
  };

  return (
    <Button
      fill={ButtonFill.Outline}
      variant={ButtonVariant.Default}
      text={"Sign Up with Google"}
      onClick={handleGoogleLogin}
      icon={<GoogleIcon />}
      loading={loading}
      className={"w-full"}
    />
  );
};
