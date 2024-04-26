import { useController } from "@/renderer/hooks";
import { ArticleEditLinkToolController, ArticleEditLinkToolProps } from "./article-edit-link-tool.ctrl";
import SubmitCancel from "@/renderer/components/submit-cancel";

export default function ArticleEditLinkTool(props: ArticleEditLinkToolProps) {
    const ctrl = useController<ArticleEditLinkToolProps, ArticleEditLinkToolController>(
        ArticleEditLinkToolController,
        props
    );

    return (
        <form {...ctrl.form.elementProps} class="modal-box">
          <h3 class="font-bold text-lg">Insert Article Link</h3>
          <div class="form-control w-full max-w-xs">
            <input
              type="text"
              placeholder="Article Share Link"
              name="href"
              class="input input-bordered w-full max-w-xs mt-2"
              value={ctrl.form.state.href.value}
              onInput={ctrl.form.handleInput}
              required
            />
            <label class="label">
              <span class="label-text-alt">
                Text copied to clipboard after clicking an article's share icon
              </span>
            </label>
          </div>

          <div class="form-control w-full max-w-xs">
            <input
              type="text"
              placeholder="Label"
              name="label"
              class="input input-bordered w-full max-w-xs mt-2"
              value={ctrl.form.state.label.value}
              onInput={ctrl.form.handleInput}
            />
            <label class="label">
              <span class="label-text-alt">
                Text displayed for link. If not provided, article title will be
                used.
              </span>
            </label>
          </div>

          <SubmitCancel class="modal-action" onCancel={ctrl.cancel} />
        </form>
    );
}