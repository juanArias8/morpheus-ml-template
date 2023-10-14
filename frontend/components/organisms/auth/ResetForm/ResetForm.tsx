import React, { useState } from "react";

import { useForm } from "react-hook-form";
import { AuthOption, useAuth } from "@/components/organisms/auth/AuthContext";
import { ArrowBackIcon } from "@/components/atoms/icons/arrowBack";
import { TextInput } from "@/components/atoms/Input";
import { Button, ButtonVariant } from "@/components/atoms/Button";
import { useAlertMessage } from "@/components/organisms/AlertMessage/AlertMessageContext";
import { Typography, TypographyVariant } from "@/components/atoms/Typography";

interface ResetFormModel {
  email: string;
}

const defaultValues = {
  email: "",
};

export const ResetForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetFormModel>({ defaultValues });

  const { setAuthOption, resetPassword } = useAuth();
  const { showSuccessAlert, showErrorAlert } = useAlertMessage();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (data: any) => {
    setLoading(true);

    resetPassword(data)
      .then(async () => {
        showSuccessAlert(
          `A recover link has been sent to the email ${data.email}`
        );
        setAuthOption(AuthOption.Login);
        setLoading(false);
      })
      .catch(() => {
        showErrorAlert(
          "An error occurred while resetting your password, please try again later."
        );
        setLoading(false);
      });
  };

  return (
    <div className={"w-full"}>
      <div className={"w-full"}>
        <span onClick={() => setAuthOption(AuthOption.Login)}>
          <ArrowBackIcon />
        </span>
        <Typography variant={TypographyVariant.Subtitle}>
          Reset your Password
        </Typography>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-2">
        <TextInput
          name={"email"}
          label={"Email"}
          placeholder={"Email"}
          register={register}
          validationSchema={{
            required: true,
            minLength: 2,
            maxLength: 64,
          }}
          errors={errors.email}
          setValue={setValue}
        />

        <Button
          text={"Submit"}
          variant={ButtonVariant.Primary}
          className={"w-full"}
          loading={loading}
        />
      </form>
    </div>
  );
};
