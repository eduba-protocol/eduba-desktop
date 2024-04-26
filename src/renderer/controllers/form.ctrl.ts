import { Ref, createRef } from "preact";
import { SignalState } from "@/lib/signal-state";

export interface FormElementProps {
  onSubmit(evt: Event): void;
  ref: Ref<HTMLFormElement>;
  method: string;
}

export class FormController<T> {
  public elementProps: FormElementProps;

  public element = createRef<HTMLFormElement>();

  constructor(
    private onSubmit: (data: T) => void,
    public state: SignalState<T>
  ) {
    this.elementProps = {
      onSubmit: this.handleSubmit,
      ref: this.element,
      method: "dialog",
    };
  }

  handleInput = (evt: Event) => {
    if (!(
      evt.target instanceof HTMLInputElement ||
      evt.target instanceof HTMLTextAreaElement ||
      evt.target instanceof HTMLSelectElement
    )) {
      return;
    }

    const { name } = evt.target;
    let value: string | number = evt.target.value;

    if (this.state[name as keyof T]) {
      if (evt.target.getAttribute("type") === "number") {
        value = Number(value);
      }
      this.state._set({ [name]: value });
    } else {
      console.error(`Unknown form field: ${name}`);
    }
  };

  handleSubmit = async (evt: Event) => {
    evt.preventDefault();

    if (!this.validate()) return;

    this.onSubmit(this.state.peek());
  };

  ignoreEnterKey = (evt: KeyboardEvent) => {
    if (
      evt.key === '13' &&
      evt.target instanceof HTMLElement &&
      evt.target.tagName !== "TEXTAREA"
    ) {
      evt.preventDefault();
    }
  };

  validate() {
    return this.element.current.reportValidity();
  }
}
