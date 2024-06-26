"use client";

import { CSSProperties, Fragment, ReactNode } from "react";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import CircleLoader from "@/components/atoms/CircleLoader";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export enum ButtonSize {
  Xs = "btn-xs",
  Sm = "btn-sm",
  Md = "btn-md",
  Lg = "btn-lg",
}

export enum ButtonFill {
  Full = "",
  Outline = "btn-outline",
}

export enum ButtonVariant {
  Default = "",
  Primary = "btn-primary",
  Secondary = "btn-secondary",
  Accent = "btn-accent",
  Info = "btn-info",
  Success = "btn-success",
  Warning = "btn-warning",
  Error = "btn-error",
}

export interface ButtonProps {
  text: string;
  variant?: ButtonVariant;
  fill?: ButtonFill;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  btnClass?: string;
  type?: "button" | "submit" | "reset" | undefined;
  icon?: ReactNode;
  loading?: boolean;
  style?: CSSProperties;
}

export const Button = (props: ButtonProps) => {
  return (
    <button
      className={cn(
        props.btnClass || "btn",
        props.variant,
        props.fill,
        props.size,
        props.className,
      )}
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type || undefined}
      style={props.style}
    >
      {props.loading ? (
        <CircleLoader isLoading={true} displayText={false} />
      ) : (
        <Fragment>
          {props.text}
          {props.icon && <span className="ml-2">{props.icon}</span>}
        </Fragment>
      )}
    </button>
  );
};
