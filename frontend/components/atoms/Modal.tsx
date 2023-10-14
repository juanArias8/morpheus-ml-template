"use client";
import React, { ReactNode, useRef } from "react";
import cn from "classnames";
import { useOnClickOutside } from "usehooks-ts";

type ModalProps = {
  open: boolean;
  onClose(): void;
  styles?: string;
  children: ReactNode;
  disableClickOutside?: boolean;
};

const Modal = (props: ModalProps) => {
  const ref = useRef(null);
  useOnClickOutside(ref, () => {
    if (!props.disableClickOutside) {
      props.onClose();
    }
  });

  const modalClass = cn({
    "modal modal-bottom sm:modal-middle": true,
    "modal-open": props.open,
  });

  return (
    <div className={`${modalClass} ${props.styles}`}>
      <div className="modal-box" ref={ref}>
        {props.children}
      </div>
    </div>
  );
};

export default Modal;
