import { h } from "preact";
import { Router, Route, CustomHistory } from "preact-router";
import { createHashHistory } from "history";
import PublisherArticlesPage from "./routes/publisher-articles/publisher-articles-page";
import NotFoundPage from "./routes/not-found/not-found-page";
import NewTabPage from "./routes/new-tab/new-tab-page";
import ArticlePage from "./routes/article/article-page";
import ArticleEditPage from "./routes/article-edit/article-edit-page";
import BookmarksPage from "./routes/bookmarks/bookmarks-page";
import { useProvider } from "./hooks";
import { PageStore } from "./stores";

const history = createHashHistory() as unknown as CustomHistory;

export default function AppRouter() {
  const pageStore = useProvider<PageStore>(PageStore)

  return (
    <Router history={history} onChange={pageStore.handleRoute}>
      <Route path="/newtab" component={NewTabPage} default/>
      <Route path="/bookmarks" component={BookmarksPage} />
      <Route path="/:pageId/:dbId/articles/:articleId" component={ArticlePage} />
      <Route path="/:pageId/edit/articles/:dbId?/:articleId?" component={ArticleEditPage} />
      <Route path="/:pageId/:dbId/articles" component={PublisherArticlesPage} />
      <Route default component={NotFoundPage} />
    </Router>
  );
}
