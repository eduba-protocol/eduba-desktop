import { h } from "preact";
import { useContext } from "preact/hooks";
import { BookmarksContext, BookmarksController } from "./bookmarks.ctrl";

export default function BookmarkBreadcrumbs() {
  const ctrl = useContext<BookmarksController>(BookmarksContext);

  const openFolders = ctrl.openFolders.value;

  return (
    <div class="text-sm breadcrumbs">
      <ul>
        <li>
          <a onClick={ctrl.closeOpenFolder}>
            Bookmarks
          </a>
        </li>
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
