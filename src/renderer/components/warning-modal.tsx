import { h } from "preact";
import Modal from "./modal";
import { Signal } from "@preact/signals";

export interface WarningModalProps {
  warning: Signal
}

export default function WarningModal({ warning }: WarningModalProps) {
  function handleAction(evt: Event) {
    if (evt.target instanceof HTMLElement) {
      const { action } = evt.target.dataset;
      warning.peek()[action].handler();
    }
  }

  return (
    <Modal openSignal={warning}>
      <div class="modal-box">
        {!!warning.value && (
          <>
            <h3 class="font-bold text-lg">{warning.value.title}</h3>
            <p class="mt-2">{warning.value.message}</p>
            <div class="modal-action">
              <button
                class="btn btn-secondary"
                data-action="ignore"
                onClick={handleAction}
              >
                {warning.value.ignore.label}
              </button>
              <button
                class="btn btn-primary"
                data-action="heed"
                onClick={handleAction}
              >
                {warning.value.heed.label}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
