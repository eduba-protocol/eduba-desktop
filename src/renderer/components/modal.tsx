import { ComponentChildren, h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { Signal, useSignalEffect } from "@preact/signals";

export interface ModalProps {
  open?: boolean;
  openSignal?: Signal;
  children: ComponentChildren;
  id?: string;
}

export default function Modal({ open, openSignal, children, id }: ModalProps) {
  const modalRef = useRef<HTMLDialogElement>();

  useEffect(() => {
    if (open == null) return;
    const modal = modalRef.current;

    if (open) {
      modal.showModal();
    } else {
      modal.close();
    }
  }, [open]);

  useSignalEffect(() => {
    if (!openSignal) return;

    const modal = modalRef.current;

    if (openSignal.value) {
      modal.showModal();
    } else {
      modal.close();
    }
  });

  return (
    <dialog ref={modalRef} class="modal" id={id}>
      {children}
    </dialog>
  );
}
