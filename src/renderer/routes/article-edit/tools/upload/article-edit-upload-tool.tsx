import { useController } from "@/renderer/hooks";
import { ArticleEditUploadToolController, ArticleEditUploadToolProps } from "./article-edit-upload-tool.ctrl";
import SubmitCancel from "@/renderer/components/submit-cancel";

export default function ArticleEditUploadTool(props: ArticleEditUploadToolProps) {
    const ctrl = useController<ArticleEditUploadToolProps, ArticleEditUploadToolController>(
        ArticleEditUploadToolController,
        props
    );

    return (
      <form {...ctrl.form.elementProps} class="modal-box">
      <h3 class="font-bold text-lg">Upload File</h3>
      <div class="form-control w-full max-w-xs">
        <input
          type="text"
          placeholder="Suggested File Name"
          name="fileName"
          class="input input-bordered w-full max-w-xs mt-2"
          value={ctrl.form.state.fileName.value}
          onInput={ctrl.form.handleInput}
          required
        />
        <label class="label">
          <span class="label-text-alt">
            The file name suggested when the file is downloaded
          </span>
        </label>
      </div>

      <SubmitCancel class="modal-action" onCancel={ctrl.cancel} />
    </form>
    );
}