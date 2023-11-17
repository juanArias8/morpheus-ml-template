import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { APIResponse } from "@/lib/models";
import { useAlert } from "@/components/organisms/AlertMessage/AlertMessageContext";
import { Button, ButtonVariant } from "@/components/atoms/Button";
import { TextInput } from "@/components/atoms/Input";
import { registerNewUserToNewsletter } from "@/api/newsletter-api";

export interface NewsletterForm {
  email: string;
}

const defaultValues = {
  email: "",
};

export const NewsletterForm = () => {
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NewsletterForm>({ defaultValues });

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response: APIResponse = await registerNewUserToNewsletter(data);
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
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <header className="footer-title">Newsletter</header>
      <fieldset className="form-control w-80">
        <label className="label">
          <span className="label-text">Enter your email address</span>
        </label>
        <div className="relative">
          <TextInput
            name={"email"}
            type={"email"}
            placeholder={"username@site.com"}
            register={register}
            validationSchema={{
              required: true,
              minLength: 2,
              maxLength: 64,
            }}
            errors={errors.email}
            setValue={setValue}
            className={"input input-bordered w-full pr-16"}
          />
          <Button
            type={"submit"}
            text={"Subscribe"}
            variant={ButtonVariant.Primary}
            className={"absolute right-0 top-0 rounded-l-none w-[120px]"}
            loading={loading}
          />
        </div>
      </fieldset>
    </form>
  );
};
