"use client";
import { Model } from "@/lib/models";

interface SelectInputProps {
  options: Model[];
  value?: string;
  setValue: (value: string) => void;
}

export const SelectModel = (props: SelectInputProps) => {
  const handleChange = (event: any) => {
    console.log(event.target.value);
    props.setValue(event.target.value);
  };

  return (
    <select
      className="select select-bordered w-full max-w-xs"
      onChange={handleChange}
      value={props.value}
    >
      <option disabled>Choose a model</option>

      {props.options.map((model: Model) => (
        <option key={model.handler} value={model.handler}>
          {model.name}
        </option>
      ))}
    </select>
  );
};
