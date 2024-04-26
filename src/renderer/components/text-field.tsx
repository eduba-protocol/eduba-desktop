import { h } from "preact";
import { styles } from "../utils";

export interface TextFieldProps {
  label: string;
  bottomLabel?: string;
  class?: string;
  type?: string;
  value: string | number;
  onInput: (evt: InputEvent) => void;
  name: string;
  required?: boolean;
  disabled?: boolean;
}

export default function TextField({
  label,
  bottomLabel,
  class: className = "",
  type = "text",
  ...inputProps
}: TextFieldProps) {
  return (
    <div
      class={styles({
        [className]: !!className,
        "form-control w-full": true,
      })}
    >
      <label class="label">
        <span class="label-text">{label}</span>
      </label>
      <input
        {...inputProps}
        type={type}
        class="input input-bordered w-full invalid:input-error"
      />
      {!!bottomLabel && (
        <label className="label">
          <span className="label-text-alt">{bottomLabel}</span>
        </label>
      )}
    </div>
  );
}
