"use client";
import Modal from "@/components/atoms/Modal";
import { Typography, TypographyVariant } from "@/components/atoms/Typography";
import { useAlert } from "@/components/organisms/AlertMessage/AlertMessageContext";

const AlertMessage = () => {
  const { open, setOpen, title, message } = useAlert();

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Typography variant={TypographyVariant.Title} className="text-center">
        {title}
      </Typography>
      <Typography variant={TypographyVariant.Paragraph} className="text-center">
        {message}
      </Typography>
    </Modal>
  );
};

export default AlertMessage;
