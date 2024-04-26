import { useContext } from "preact/hooks";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { BookmarksPageContext, BookmarksPageController } from "./bookmarks-page.ctrl";
import { BookmarkDto } from "@/dtos/response/interfaces";
import { BookmarkType } from "@/enums";

export interface BookmarkRowMenuProps {
    isFolder: boolean;
    bookmark: BookmarkDto;
}

export function BookmarkRowMenu({ isFolder, bookmark }: BookmarkRowMenuProps) {
  const ctrl = useContext<BookmarksPageController>(BookmarksPageContext);

  const editText = isFolder ? "Rename" : "Edit";

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
          <a data-id={bookmark._id} onClick={ctrl.editBookmark}>
            {editText}
          </a>
        </li>
        <li>
          <a data-id={bookmark._id} onClick={ctrl.deleteBookmark}>
            Delete
          </a>
        </li>
        <li>
          <a data-id={bookmark._id} onClick={ctrl.cutBookmark}>
            Cut
          </a>
        </li>
        {bookmark.type === BookmarkType.Bookmark &&
        <li>
          <a data-id={bookmark._id} onClick={ctrl.copyBookmark}>
            Copy
          </a>
        </li>
        }
      </ul>
    </div>
  );
}
