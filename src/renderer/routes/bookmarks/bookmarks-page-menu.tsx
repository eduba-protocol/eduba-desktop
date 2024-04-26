import { h } from "preact";
import { useContext } from "preact/hooks";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { BookmarksPageContext, BookmarksPageController } from "./bookmarks-page.ctrl";

export default function BookmarksPageMenu() {
  const ctrl = useContext<BookmarksPageController>(BookmarksPageContext);

  return (
    <div class="dropdown dropdown-bottom dropdown-end">
      <label tabIndex={0} class="btn m-1">
        <EllipsisVerticalIcon class="w-6 h-6 text-inherit" />
      </label>
      <ul
        tabIndex={0}
        class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li>
          <a onClick={ctrl.addBookmark}>Add New Bookmark</a>
        </li>
        <li>
          <a onClick={ctrl.addFolder}>Add New Folder</a>
        </li>
        {!!ctrl.state.clippedBookmark.value && (
          <li>
            <a onClick={ctrl.pasteBookmark}>Paste</a>
          </li>
        )}
      </ul>
    </div>
  );
}
