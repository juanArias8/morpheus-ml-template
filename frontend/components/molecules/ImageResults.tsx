import Image from "next/image";
import { Typography, TypographyVariant } from "@/components/atoms/Typography";

interface ImageResultsProps {
  images: string[];
}

const ImageResults = (props: ImageResultsProps) => {
  if (!props.images) {
    return (
      <Typography variant={TypographyVariant.Paragraph}>
        No Images Found
      </Typography>
    );
  }

  return (
    <div className="flex flex-row flex-wrap gap-x-10 gap-y-5">
      {props.images.map((image: string, index: number) => (
        <Image
          key={index}
          src={image}
          width={400}
          height={400}
          className="object-contain mt-5 rounded-md"
          alt="result image"
        />
      ))}
    </div>
  );
};
export default ImageResults;
