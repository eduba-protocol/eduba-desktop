import { h } from "preact";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { useProvider } from "@/renderer/hooks/use-provider.hook";
import { useController } from "@/renderer/hooks/use-controller.hook";
import { AuthStore } from "@/renderer/stores";
import { BookmarksContext, BookmarksController, BookmarksProps } from "./bookmarks.ctrl";
import BookmarkRow from "./bookmark-row";
import BookmarkBreadcrumbs from "./bookmark-breadcrumbs";
import { Link } from "preact-router";

export default function Bookmarks(props: BookmarksProps) {
  const ctrl = useController<BookmarksProps, BookmarksController>(
    BookmarksController,
    props
  );

  const authStore = useProvider<AuthStore>(AuthStore);

  return (
    <BookmarksContext.Provider value={ctrl}>
      <div class={props.class}>
        <div class="flex justify-between items-center h-12">
          <BookmarkBreadcrumbs />
          {authStore.state.sessionActive.value && (
            <Link
              href="/bookmarks"
              class="ml-3 mr-1"
            >
              <PencilSquareIcon class="w-6 h-6 text-inherit" />
            </Link>
          )}
        </div>
        <ul class="w-full">
          {ctrl.activeList.value.map((bookmark) => (
            <BookmarkRow key={bookmark._id} bookmark={bookmark} />
          ))}
        </ul>
      </div>
    </BookmarksContext.Provider>
  );
}
