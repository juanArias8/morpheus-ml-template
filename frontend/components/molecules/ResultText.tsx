import Image from "next/image";
import { Typography, TypographyVariant } from "@/components/atoms/Typography";

interface ResultTextProps {
  text: string;
  className?: string;
}

const ResultText = (props: ResultTextProps) => {
  return (
    <div className={`bg-base-200 mt-5 rounded-lg px-5 py-5 ${props.className}`}>
      <div className="flex w-full flex-row p-2">
        <div className="avatar">
          <div className="h-10 w-10 rounded-full p-1 bg-primary-content">
            <Image
              src={"/images/morpheus.png"}
              alt={"Morpheus logo"}
              width={40}
              height={40}
              className={"object-contain"}
            />
          </div>
        </div>

        <div className="ml-5 flex flex-row align-middle">
          <Typography variant={TypographyVariant.Paragraph}>
            {props.text}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ResultText;
