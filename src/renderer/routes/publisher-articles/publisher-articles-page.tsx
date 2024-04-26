import { h } from "preact";
import TabLink from "@/renderer/components/tab-link";
import { useController } from "@/renderer/hooks/use-controller.hook";
import { PublisherArticlesPageController, PublisherArticlesPageProps } from "./publisher-articles-page.ctrl";

export default function PublisherArticlesPage(props: PublisherArticlesPageProps) {
  const ctrl = useController<PublisherArticlesPageProps, PublisherArticlesPageController>(
    PublisherArticlesPageController,
    props,
    [props.pageId]
  );

  return (
    <main class="page" key={props.pageId}>
      <ul>
        {ctrl.state.articles.value.map((article) => (
          <li class="my-1 mx-4 py-1 px-4 hover:bg-base-200 rounded">
            <TabLink
              href={`${article._db}/articles/${article._id}`}
              pageTitle={article.title}
              class="block w-full"
            >
              {article.title}
            </TabLink>
          </li>
        ))}
      </ul>
    </main>
  );
}
