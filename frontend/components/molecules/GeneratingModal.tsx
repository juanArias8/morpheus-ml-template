import { Typography, TypographyVariant } from "@/components/atoms/Typography";
import Modal from "@/components/atoms/Modal";

interface GeneratingModalProps {
  open: boolean;
}

const GeneratingModal = (props: GeneratingModalProps) => {
  return (
    <Modal open={props.open} className={"bg-gradient-dark"}>
      <div className="flex flex-col items-center">
        <span className="loading loading-spinner loading-lg mb-10" />
        <Typography variant={TypographyVariant.Title} className="text-center">
          Generating...
        </Typography>
        <Typography
          variant={TypographyVariant.Paragraph}
          className="text-center"
        >
          Please wait a few seconds.
        </Typography>
      </div>
    </Modal>
  );
};

export default GeneratingModal;
