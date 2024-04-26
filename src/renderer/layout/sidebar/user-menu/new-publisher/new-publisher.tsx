import { h } from "preact";
import { useController } from "@/renderer/hooks";
import { NewPublisherController, NewPublisherProps } from "./new-publisher.ctrl";
import SubmitCancel from "@/renderer/components/submit-cancel";

export default function NewPublisher(props: NewPublisherProps) {
    const ctrl = useController<NewPublisherProps, NewPublisherController>(
        NewPublisherController,
        props
    );

    return (
        <dialog id={ctrl.modalId} class="modal">
            <form {...ctrl.form.elementProps} id="new-publisher-form" class="modal-box">
                <div class="flex items-center">
                    <div class="form-control w-full">
                        <label class="label">
                            <span class="label-text">New Publisher</span>
                        </label>
                        <div class="flex items-center">
                            <input
                                class="input input-bordered w-full invalid:input-error mr-2"
                                value={ctrl.form.state.title.value}
                                onInput={ctrl.form.handleInput}
                                name="title"
                                required
                            />
                        </div>
                    </div>
                </div>

                <SubmitCancel
                    class="modal-action"
                    onCancel={ctrl.cancel}
                    cancelLabel="Cancel"
                    submitLabel="Create Publisher"
                />
            </form>
        </dialog>
    );
}