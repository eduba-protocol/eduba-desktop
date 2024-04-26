import { h } from "preact";
import ArticleViewer from "../../components/article-viewer/article-viewer";
import { useController } from "../../hooks/use-controller.hook";
import {
  ArticlePageController,
  ArticlePageContext,
  ArticlePageProps,
} from "./article-page.ctrl";
import Loading from "@/renderer/components/loading";

export default function ArticlePage(props: ArticlePageProps) {
  const ctrl = useController<ArticlePageProps, ArticlePageController>(ArticlePageController, props, [props.pageId]);

  if (!(ctrl.state.publisher.value && ctrl.state.article.value)) return;

  return (
    <ArticlePageContext.Provider value={ctrl}>
      <main class="page p-4" key={props.pageId}>
        <Loading loading={ctrl.loading.value} text="Loading">
          <ArticleViewer markdown={ctrl.displayMarkdown} class="my-8" />
        </Loading>
      </main>
    </ArticlePageContext.Provider>
  );
}
