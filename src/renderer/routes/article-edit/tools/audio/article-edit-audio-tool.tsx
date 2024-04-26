import { useController } from "@/renderer/hooks";
import { ArticleEditAudioToolController, ArticleEditAudioToolProps } from "./article-edit-audio-tool.ctrl";
import SubmitCancel from "@/renderer/components/submit-cancel";

export default function ArticleEditAudioTool(props: ArticleEditAudioToolProps) {
    const ctrl = useController<ArticleEditAudioToolProps, ArticleEditAudioToolController>(
        ArticleEditAudioToolController,
        props
    );

    return (
      <form {...ctrl.form.elementProps} class="modal-box">
      <h3 class="font-bold text-lg">Upload Audio</h3>
      <div class="form-control w-full max-w-xs">
        <input
          type="text"
          placeholder="Title"
          name="title"
          class="input input-bordered w-full max-w-xs mt-2"
          value={ctrl.form.state.title.value}
          onInput={ctrl.form.handleInput}
          required
        />
        <label class="label">
          <span class="label-text-alt">Title of the audio</span>
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
          <span class="label-text-alt">Caption shown under audio</span>
        </label>
      </div>

      <SubmitCancel class="modal-action" onCancel={ctrl.cancel} />
    </form>
    );
}