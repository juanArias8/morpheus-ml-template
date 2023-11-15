import { Typography, TypographyVariant } from "@/components/atoms/Typography";

export interface CircleLoaderProps {
  isLoading: boolean;
  displayText?: boolean;
}

const CircleLoader = (props: CircleLoaderProps) => {
  return props.isLoading ? (
    <div className="flex items-center">
      <span className="loading loading-ring loading-md mr-5"></span>
      {props.displayText && (
        <Typography variant={TypographyVariant.Span}>Loading...</Typography>
      )}
    </div>
  ) : null;
};

export default CircleLoader;
