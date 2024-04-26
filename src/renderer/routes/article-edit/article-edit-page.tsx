import { h } from "preact";
import TextField from "@/renderer/components/text-field";
import SubmitCancel from "@/renderer/components/submit-cancel";
import WarningModal from "@/renderer/components/warning-modal";
import ArticleViewer from "@/renderer/components/article-viewer/article-viewer";
import { useController } from "@/renderer/hooks/use-controller.hook";
import {
  ArticleEditPageContext,
  ArticleEditPageController,
  ArticleEditPageProps,
} from "./article-edit-page.ctrl";
import { useSignalEffect } from "@preact/signals";
import ArticleEditToolbar from "./article-edit-toolbar";

export default function ArticleEditPage(props: ArticleEditPageProps) {
  const ctrl = useController<ArticleEditPageProps, ArticleEditPageController>(
    ArticleEditPageController,
    props,
    [props.pageId]
  );

  useSignalEffect(() => {
    ctrl.setTextarea(ctrl.form.state.markdown.value);
  });

  return (
    <ArticleEditPageContext.Provider value={ctrl}>
      <main class="page" key={props.pageId}>
        <form
          id="article-form"
          {...ctrl.form.elementProps}
          class="h-full flex flex-col"
        >
          <div class="flex justify-end items-center">
            <SubmitCancel
              onCancel={ctrl.cancelEdit}
              submitLabel="Publish"
              cancelLabel="Cancel"
            />
          </div>
          <div class="flex flex-wrap flex-1 p-1">
            <div class="flex flex-col bg-base-200 basis-96 grow shrink-0 p-4 m-1">
              <div class="mb-1">
                <TextField
                  class="w-full"
                  label="Title"
                  value={ctrl.form.state.title.value}
                  onInput={ctrl.form.handleInput}
                  name="title"
                  required
                />
              </div>
              <div class="flex-1 flex flex-col">
                <ArticleEditToolbar onInsert={ctrl.insertText} dbId={props.dbId} />
                <textarea
                  ref={ctrl.textareaRef}
                  name="markdown"
                  class="textarea w-full h-full"
                  onChange={ctrl.form.handleInput}
                  rows={20}
                  tabIndex={0}
                ></textarea>
              </div>
            </div>
            <div class="bg-base-300 basis-96 grow shrink-0 p-4 m-1">
              <ArticleViewer markdown={ctrl.displayMarkdown} />
            </div>
          </div>
        </form>
        <WarningModal warning={ctrl.state.warning} />
      </main>
    </ArticleEditPageContext.Provider>
  );
}
