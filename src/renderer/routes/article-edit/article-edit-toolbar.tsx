import { useController } from "@/renderer/hooks";
import { ArticleEditTool, ArticleEditToolbarController, ArticleEditToolbarProps } from "./article-edit-toolbar.ctrl";
import { ArrowUpTrayIcon, FilmIcon, LinkIcon, PhotoIcon, SpeakerWaveIcon } from "@heroicons/react/24/solid";
import Modal from "@/renderer/components/modal";
import ArticleEditLinkTool from "./tools/article-link/article-edit-link-tool";
import ArticleEditAudioTool from "./tools/audio/article-edit-audio-tool";
import ArticleEditImageTool from "./tools/image/article-edit-image-tool";
import ArticleEditVideoTool from "./tools/video/article-edit-video-tool";
import ArticleEditUploadTool from "./tools/upload/article-edit-upload-tool";

export default function ArticleEditToolbar(props: ArticleEditToolbarProps) {
    const ctrl = useController<ArticleEditToolbarProps, ArticleEditToolbarController>(
        ArticleEditToolbarController,
        props
    );

    const tool = ctrl.state.tool.value;

    return (
        <div>
            <div class="join">
                <button
                    type="button"
                    class="join-item btn btn-ghost"
                    title="Insert Article Link"
                    data-tool={ArticleEditTool.Link}
                    onClick={ctrl.openTool}
                >
                    <LinkIcon class="w-5 h-5 text-inherit" />
                </button>
                <button
                    type="button"
                    class="join-item btn btn-ghost"
                    title="Upload image"
                    data-tool={ArticleEditTool.Image}
                    onClick={ctrl.openTool}
                >
                    <PhotoIcon class="w-5 h-5 text-inherit" />
                </button>
                <button
                    type="button"
                    class="join-item btn btn-ghost"
                    title="Upload audio"
                    data-tool={ArticleEditTool.Audio}
                    onClick={ctrl.openTool}
                >
                    <SpeakerWaveIcon class="w-5 h-5 text-inherit" />
                </button>
                <button
                    type="button"
                    class="join-item btn btn-ghost"
                    title="Upload video"
                    data-tool={ArticleEditTool.Video}
                    onClick={ctrl.openTool}
                >
                    <FilmIcon class="w-5 h-5 text-inherit" />
                </button>
                <button
                    type="button"
                    class="join-item btn btn-ghost"
                    title="Upload File"
                    data-tool={ArticleEditTool.Upload}
                    onClick={ctrl.openTool}
                >
                    <ArrowUpTrayIcon class="w-5 h-5 text-inherit" />
                </button>
            </div>
            <Modal open={tool != null}>
                {tool === ArticleEditTool.Link && <ArticleEditLinkTool onDone={ctrl.handleToolDone} />}
                {tool === ArticleEditTool.Image && <ArticleEditImageTool onDone={ctrl.handleToolDone} dbId={props.dbId} />}
                {tool === ArticleEditTool.Audio && <ArticleEditAudioTool onDone={ctrl.handleToolDone} dbId={props.dbId} />}
                {tool === ArticleEditTool.Video && <ArticleEditVideoTool onDone={ctrl.handleToolDone} dbId={props.dbId} />}
                {tool === ArticleEditTool.Upload && <ArticleEditUploadTool onDone={ctrl.handleToolDone} dbId={props.dbId} />}
            </Modal>
        </div>
    );
}
