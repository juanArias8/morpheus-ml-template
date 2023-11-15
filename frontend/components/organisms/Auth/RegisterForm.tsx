import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/components/organisms/Auth/AuthContext";
import { TextInput } from "@/components/atoms/Input";
import { Button, ButtonVariant } from "@/components/atoms/Button";
import { Separator } from "@/components/atoms/Separator";
import { SignUpWithGoogle } from "@/components/organisms/Auth/SignUpWithGoogle";
import AuthSwitch from "@/components/organisms/Auth/AuthSwitch";

export interface LoginFormModel {
  name: string;
  email: string;
  password: string;
}

const defaultValues = {
  name: "",
  email: "",
  password: "",
};

export const RegisterForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormModel>({ defaultValues });
  const { setAuthOption, registerWithEmailAndPassword } = useAuth();

  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    registerWithEmailAndPassword(data)
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div className={"w-full"}>
      <AuthSwitch />

      <SignUpWithGoogle text="Sign Up" />
      <Separator />

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-2">
        <TextInput
          name={"name"}
          label={"Name"}
          placeholder={"Name"}
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
