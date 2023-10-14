"use client";
import { ComponentPropsWithoutRef } from "react";

export interface ToggleInputProps extends ComponentPropsWithoutRef<"input"> {
  name: string;
  label: string;
  register: any;
}

export const ToggleInput = (props: ToggleInputProps) => {
  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <span className="label-text">{props.label}</span>
        <input
          type="checkbox"
          className="toggle"
          {...props.register(props.name)}
        />
      </label>
    </div>
  );
};
