import { h } from "preact";
import { useSignalEffect } from "@preact/signals";
import Modal from "@/renderer/components/modal";
import TextField from "@/renderer/components/text-field";
import { useController } from "@/renderer/hooks/use-controller.hook";
import SubmitCancel from "@/renderer/components/submit-cancel";
import { BookmarkEditController, BookmarkEditProps } from "./bookmark-edit.ctrl";

export default function BookmarkEdit(props: BookmarkEditProps) {
  const ctrl = useController<BookmarkEditProps, BookmarkEditController>(
    BookmarkEditController,
    props
  );
  
  const { bookmarkSignal, disableHrefEdit } = props;

  useSignalEffect(() => {
    ctrl.setFormData(bookmarkSignal.value);
  });

  const isFolder =
    bookmarkSignal.value && bookmarkSignal.value.type === "folder";
  const heading = isFolder ? "Folder" : "Bookmark";

  return (
    <Modal openSignal={bookmarkSignal}>
      <div class="modal-box w-full max-w-3xl">
        <h3 class="font-bold text-lg">{heading}</h3>
        <form
          id="add-bookmark-form"
          {...ctrl.form.elementProps}
          class="h-full flex flex-col"
        >
          <TextField
            class="w-full"
            label="Title"
            value={ctrl.form.state.title.value}
            onInput={ctrl.form.handleInput}
            name="title"
            required
          />
          {!isFolder && (
            <TextField
              class="w-full"
              label="<Publisher ID>/articles/<Article ID>"
              value={ctrl.form.state.href.value}
              onInput={ctrl.form.handleInput}
              name="href"
              required
              disabled={disableHrefEdit === true}
            />
          )}
          <SubmitCancel class="modal-action" onCancel={ctrl.cancel} />
        </form>
      </div>
    </Modal>
  );
}
