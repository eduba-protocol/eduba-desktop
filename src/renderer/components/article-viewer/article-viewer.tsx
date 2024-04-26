import { h } from "preact";
import Markdown from "preact-markdown";
import { useController } from "../../hooks/use-controller.hook";
import { ArticleController, ArticleViewerProps } from "./article-viewer.ctrl";

export default function ArticleViewer(props: ArticleViewerProps) {
  const ctrl = useController<ArticleViewerProps, ArticleController>(
    ArticleController,
    props
  );

  return (
    <article ref={ctrl.articleRef} class={props.class}>
      {/* Must pass props this way to avoid type error */}
      <Markdown {...{markdown: props.markdown.value || ""}} />
    </article>
  );
}
