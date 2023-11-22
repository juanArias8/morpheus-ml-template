import { Typography, TypographyVariant } from "@/components/atoms/Typography";
import { cn } from "@/lib/utils";

interface GeneratingModalProps {
  open: boolean;
  className?: string;
}

const GeneratingCard = (props: GeneratingModalProps) => {
  return props.open ? (
    <div
      className={cn(
        "bg-gradient-dark max-w-md flex flex-row p-5 mt-10 rounded-md",
        props.className,
      )}
    >
      <span className="loading loading-spinner loading-lg" />

      <div className="ml-5">
        <Typography variant={TypographyVariant.Title}>Generating...</Typography>
        <Typography variant={TypographyVariant.Paragraph}>
          Please wait a few seconds.
        </Typography>
      </div>
    </div>
  ) : null;
};

export default GeneratingCard;
