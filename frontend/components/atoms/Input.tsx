"use client";
import { ChangeEvent, ComponentPropsWithoutRef } from "react";

interface TextInputProps extends ComponentPropsWithoutRef<"input"> {
  label?: string;
  register?: any;
  validationSchema?: any;
  errors?: any;
  value?: string;
  setValue?: any;
  onChange?: any;
}

export const TextInput = (props: TextInputProps) => {
  const getInputError = () => {
    if (!props.errors) return null;
    if (props.errors.type === "required") return "This field is required";
    if (props.errors.type === "minLength") return "Min length is 5";
    if (props.errors.type === "maxLength") return "Max length is 20";
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.setValue(props.name, event.target.value);
  };

  return (
    <div className="form-control w-full">
      {props.label && (
        <label className="label">
          <span className="label-text">
            {props.label}{" "}
            {props.label && props.validationSchema?.required && "*"}
          </span>
        </label>
      )}

      <input
        name={props.name}
        value={props.value}
        type={props.type || "text"}
        placeholder={props.placeholder}
        className="input input-bordered w-full"
        onChange={props.onChange || handleInputChange}
        {...(props.register
          ? props.register(props.name, props.validationSchema)
          : {})}
      />

      {props.errors && (
        <label className="label">
          <span className="error text-error text-sm">{getInputError()}</span>
        </label>
      )}
    </div>
  );
};
