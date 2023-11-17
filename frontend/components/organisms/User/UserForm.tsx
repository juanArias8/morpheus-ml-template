import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "@/components/atoms/Input";
import { Button, ButtonVariant } from "@/components/atoms/Button";
import { updateUserInfo } from "@/api/users-api";
import { APIResponse } from "@/lib/models";
import { useAlert } from "@/components/organisms/AlertMessage/AlertMessageContext";
import { useAuth } from "@/components/organisms/Auth/AuthContext";
import { Auth } from "@/components/organisms/Auth/Auth";

export interface UserFormModel {
  email: string;
  name: string;
  bio?: string;
}

export const UserForm = () => {
  const { user } = useAuth();
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    email: user?.email || "",
    name: user?.name || "",
    bio: user?.bio || "",
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserFormModel>({ defaultValues });

  if (!user) return <Auth />;

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response: APIResponse = await updateUserInfo(data);
      setLoading(false);
      if (response.success) {
        showSuccessAlert("User info updated successfully");
      } else {
        showErrorAlert(
          response.message ||
            "An error occurred while updating your info, please try again later.",
        );
      }
    } catch (error) {
      setLoading(false);
      showErrorAlert(String(error));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-2 max-w-[450px]"
    >
      <TextInput
        name={"email"}
        label={"Email"}
        placeholder={"Email"}
        register={register}
        disabled={true}
        validationSchema={{
          required: true,
          minLength: 2,
          maxLength: 64,
        }}
        errors={errors.email}
        setValue={setValue}
      />

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
        errors={errors.name}
        setValue={setValue}
      />

      <TextInput
        name={"bio"}
        label={"Bio"}
        placeholder={"Bio"}
        register={register}
        disabled={true}
        validationSchema={{
          required: true,
          minLength: 2,
          maxLength: 512,
        }}
        errors={errors.email}
        setValue={setValue}
      />

      <Button
        text={"Update"}
        variant={ButtonVariant.Primary}
        className={"w-full !mt-5"}
        loading={loading}
        type={"submit"}
      />
    </form>
  );
};
