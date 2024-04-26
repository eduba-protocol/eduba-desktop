import { h } from "preact";
import BookmarkEdit from "@/renderer/components/bookmark-edit/bookmark-edit";
import { useController } from "@/renderer/hooks/use-controller.hook";
import { BookmarksPageContext, BookmarksPageController } from "./bookmarks-page.ctrl";
import BookmarkRow from "./bookmark-row";
import BookmarkBreadcrumbs from "./bookmark-breadcrumbs";
import BookmarksPageMenu from "./bookmarks-page-menu";

export default function BookmarkManager() {
  const ctrl = useController<never, BookmarksPageController>(
    BookmarksPageController
  );

  return (
    <BookmarksPageContext.Provider value={ctrl}>
      <main class="page p-4">
        <h2 class="font-bold text-2xl mt-4">Bookmarks Manager</h2>
        <div class="flex justify-between items-center">
          <BookmarkBreadcrumbs />
          <BookmarksPageMenu />
        </div>
        <ul class="w-full">
          {ctrl.activeList.value.map((bookmark) => (
            <BookmarkRow
              key={bookmark._id}
              bookmark={bookmark}
              class="bg-base-200"
              showMenu={true}
            />
          ))}
        </ul>
        <BookmarkEdit
          bookmarkSignal={ctrl.state.bookmarkInEdit}
          onDone={ctrl.handleBookmarkEditDone}
        />
      </main>
    </BookmarksPageContext.Provider>
  );
}
