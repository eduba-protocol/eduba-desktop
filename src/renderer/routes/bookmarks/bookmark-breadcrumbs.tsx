import { h } from "preact";
import { useContext } from "preact/hooks";
import { HomeIcon } from "@heroicons/react/24/solid";
import { BookmarksPageContext, BookmarksPageController } from "./bookmarks-page.ctrl";

export default function BookmarkBreadcrumbs() {
  const ctrl = useContext<BookmarksPageController>(BookmarksPageContext);

  const openFolders = ctrl.openFolders.value;

  return (
    <div class="text-sm breadcrumbs">
      <ul>
        {!!openFolders.length && (
          <li>
            <a onClick={ctrl.closeOpenFolder}>
              <HomeIcon class="w-4 h-4 text-inherit" />
            </a>
          </li>
        )}
        {openFolders.map((folder) => (
          <li key={folder._id}>
            <a data-id={folder._id} onClick={ctrl.openFolder}>
              {folder.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
