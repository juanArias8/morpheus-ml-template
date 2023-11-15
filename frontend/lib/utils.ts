import clsx, {ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

/** Merge classes with tailwind-merge with clsx full feature */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const generateRandomNumber = (maxAmountDigits: number) => {
  const maxValue = Math.pow(10, maxAmountDigits);
  const randomNumber = Math.floor(Math.random() * maxValue);
  const randomAmount = Math.random() * (maxAmountDigits - 1) + 1;
  return Number(String(randomNumber).slice(0, randomAmount));
};
