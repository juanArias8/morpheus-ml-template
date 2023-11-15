import { Button, ButtonVariant } from "@/components/atoms/Button";

interface GenerateButtonProps {
  onClick: () => void;
  promptValue: string;
  setPromptValue: (value: string) => void;
  loading: boolean;
  disabled: boolean;
}

const GenerateButton = (props: GenerateButtonProps) => {
  return (
    <div className="bg-base-300 fixed bottom-0 left-0 right-0 z-10 mt-10 flex w-auto flex-col rounded-md p-5 !min-w-[320px]">
      <textarea
        className="textarea textarea-primary"
        placeholder="Write the first paragraph of your story."
        value={props.promptValue}
        onChange={(e) => props.setPromptValue(e.target.value)}
      />

      <Button
        text={"Generate"}
        variant={ButtonVariant.Primary}
        disabled={props.loading || props.disabled}
        onClick={props.onClick}
        className={"mt-5"}
        loading={props.loading}
      />
    </div>
  );
};

export default GenerateButton;
