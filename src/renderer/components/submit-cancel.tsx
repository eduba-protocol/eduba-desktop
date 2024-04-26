import { h } from "preact";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

export interface SubmitCancelProps {
  onCancel: () => void;
  onSave?: () => void;
  form?: string;
  submitLabel?: string;
  cancelLabel?: string;
  class?: string;
}

export default function SubmitCancel({
  onCancel,
  onSave,
  form,
  submitLabel = "",
  cancelLabel = "",
  class: className,
}: SubmitCancelProps) {
  return (
    <div class={className}>
      <button
        type="button"
        class="btn btn-ghost rounded-full"
        onClick={onCancel}
      >
        {cancelLabel}
        <XCircleIcon class="w-6 h-6 text-secondary" />
      </button>
      <button
        type="submit"
        form={form}
        class="btn btn-ghost rounded-full"
        onClick={onSave}
      >
        {submitLabel}
        <CheckCircleIcon class="w-6 h-6 text-primary" />
      </button>
    </div>
  );
}
