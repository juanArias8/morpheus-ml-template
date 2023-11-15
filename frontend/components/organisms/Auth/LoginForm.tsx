import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  AuthOption,
  LoginFormModel,
  useAuth,
} from "@/components/organisms/Auth/AuthContext";
import { TextInput } from "@/components/atoms/Input";
import { Button, ButtonVariant } from "@/components/atoms/Button";
import { SignUpWithGoogle } from "@/components/organisms/Auth/SignUpWithGoogle";
import { Separator } from "@/components/atoms/Separator";
import AuthSwitch from "@/components/organisms/Auth/AuthSwitch";

const defaultValues = {
  email: "",
  password: "",
};

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormModel>({ defaultValues });
  const { setAuthOption, loginWithEmailAndPassword } = useAuth();

  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    loginWithEmailAndPassword(data)
      .then(async (response) => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div className={"w-full"}>
      <AuthSwitch />
      <SignUpWithGoogle />
      <Separator />

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

        <TextInput
          name={"password"}
          label={"Password"}
          placeholder={"*********"}
          type={"password"}
          register={register}
          validationSchema={{
            required: true,
            minLength: 2,
            maxLength: 64,
          }}
          errors={errors.email}
          setValue={setValue}
        />

        <a
          className="block cursor-pointer text-sm mt-2 hover:underline"
          onClick={() => setAuthOption(AuthOption.Reset)}
        >
          Forgot password?
        </a>

        <Button
          text={"Submit"}
          variant={ButtonVariant.Primary}
          className={"w-full !mt-5"}
          loading={loading}
        />
      </form>
    </div>
  );
};
