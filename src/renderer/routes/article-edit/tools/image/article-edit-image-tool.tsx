import { useController } from "@/renderer/hooks";
import { ArticleEditImageToolController, ArticleEditImageToolProps } from "./article-edit-image-tool.ctrl";
import SubmitCancel from "@/renderer/components/submit-cancel";

export default function ArticleEditImageTool(props: ArticleEditImageToolProps) {
    const ctrl = useController<ArticleEditImageToolProps, ArticleEditImageToolController>(
        ArticleEditImageToolController,
        props
    );

    return (
      <form {...ctrl.form.elementProps} class="modal-box">
      <h3 class="font-bold text-lg">Upload Image</h3>
      <div class="form-control w-full max-w-xs">
        <input
          type="text"
          placeholder="Alternate Text"
          name="alt"
          class="input input-bordered w-full max-w-xs mt-2"
          value={ctrl.form.state.alt.value}
          onInput={ctrl.form.handleInput}
          required
        />
        <label class="label">
          <span class="label-text-alt">
            Short phrase that describes the image
          </span>
        </label>
      </div>

      <div class="form-control w-full max-w-xs">
        <input
          type="text"
          placeholder="Caption"
          name="caption"
          class="input input-bordered w-full max-w-xs mt-2"
          value={ctrl.form.state.caption.value}
          onInput={ctrl.form.handleInput}
        />
        <label class="label">
          <span class="label-text-alt">Caption shown under image</span>
        </label>
      </div>

      <SubmitCancel class="modal-action" onCancel={ctrl.cancel} />
    </form>
    );
}