"use client";
import React, { createContext, ReactNode, useState } from "react";

export interface IToastContext {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  message: string;
  styles: string;
  showSuccessAlert: (message: string) => void;
  showErrorAlert: (error: string) => void;
  showInfoAlert: (message: string) => void;
  showWarningAlert: (message: string) => void;
}

const defaultState = {
  open: false,
  setOpen: (open: boolean) => {},
  title: "",
  message: "",
  styles: "",
  showSuccessAlert: (message: string) => alert(message),
  showErrorAlert: (error: string) => alert(error),
  showInfoAlert: (message: string) => alert(message),
  showWarningAlert: (message: string) => alert(message),
};

const AlertMessageContext = createContext<IToastContext>(defaultState);

const AlertMessageProvider = (props: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [styles, setStyles] = useState("");

  const showSuccessAlert = (message: string) => {
    if (!message) return;
    setTitle("Well done!");
    setMessage(message);
    setStyles("bg-success text-white");
    setOpen(true);
  };

  const showInfoAlert = (message: string) => {
    if (!message) return;
    setTitle("Heads Up!");
    setMessage(message);
    setStyles("bg-info text-white");
    setOpen(true);
  };

  const showWarningAlert = (message: string) => {
    if (!message) return;
    setTitle("Caution!");
    setMessage(message);
    setStyles("bg-warning text-white");
    setOpen(true);
  };

  const showErrorAlert = (message: string) => {
    if (!message) return;
    setTitle("Error!");
    setMessage(message);
    setStyles("bg-danger text-white");
    setOpen(true);
  };

  return (
    <AlertMessageContext.Provider
      value={{
        open,
        setOpen,
        title,
        message,
        styles,
        showSuccessAlert,
        showErrorAlert,
        showInfoAlert,
        showWarningAlert,
      }}
    >
      {props.children}
    </AlertMessageContext.Provider>
  );
};

const useAlertMessage = () => {
  const context = React.useContext(AlertMessageContext);
  if (context === undefined) {
    throw new Error(
      "useAlertMessage must be used within a AlertMessageProvider"
    );
  }
  return context;
};

export { AlertMessageProvider, useAlertMessage };
