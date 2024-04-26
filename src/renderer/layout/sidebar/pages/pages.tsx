import { h } from "preact";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Link } from "preact-router/match";
import { useController, useProvider } from "@/renderer/hooks";
import { PageStore } from "@/renderer/stores";
import { styles } from "@/renderer/utils";
import { PagesContext, PagesController } from "./pages.ctrl";
import PageMenu from "./page-menu";
import BookmarkEdit from "@/renderer/components/bookmark-edit/bookmark-edit";

export default function Pages() {
    const ctrl = useController<never, PagesController>(PagesController);
    const pageStore = useProvider<PageStore>(PageStore);
    const url = pageStore.state.url.value;

    return (
      <PagesContext.Provider value={ctrl}>
        <div>
          <div class="flex items-center">
            <h2 class="font-bold mr-4 ml-6">Pages</h2>
            <Link href="/newtab" class="btn btn-circle btn-ghost" >
                <PlusIcon class="w-6 h-6 text-inherit" />
            </Link>
          </div>
          <ul class="menu w-full rounded-box">
            {pageStore.state.pages.value.map((page) => {
              const isActive = PageStore.isActivePage(url, page.id);

              const title = page.article?.title || page.title || "Loading"; 

              return (
                <li class="flex-row group min-w-0 max-w-full">
                  <Link
                    href={`/${page.id}/${page.href}`}
                    class={styles({
                      "flex-1 truncate block": true,
                      "active": isActive
                    })}
                  >
                    {title}
                  </Link>
                  {isActive &&
                    <PageMenu page={page} />
                  }
                  <button
                    class={styles({
                      "group-hover:visible px-2": true,
                      "visible": isActive,
                      "invisible": !isActive,
                    })}
                    onClick={ctrl.closePage}
                    data-page={page.id}
                  >
                    <XMarkIcon class="w-6 h-6 text-inherit" />
                  </button>
                </li>
              )
          })}
          </ul>
          <BookmarkEdit
            bookmarkSignal={ctrl.state.bookmarkInEdit}
            disableHrefEdit={true}
            onDone={ctrl.handleBookmarkEditDone}
          />
        </div>
        </PagesContext.Provider>
    );
}