import { inject, injectable } from "inversify";
import { createContext } from "preact";
import { signalState } from "@/lib/signal-state";
import { Signal, computed } from "@preact/signals";
import { BookmarkDto } from "@/dtos/response/interfaces";
import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { last } from "@/renderer/utils";
import { TYPES } from "@/renderer/di";
import { BookmarkStore } from "@/renderer/stores";

export const BookmarksContext = createContext(null);

export interface BookmarksProps {
  class?: string;
}

export interface BookmarksControllerState {
  openFolderPath: string[];
}

@injectable()
export class BookmarksController extends ComponentController<BookmarksProps> {
  public state = signalState<BookmarksControllerState>({
    openFolderPath: []
  });

  public activeList: Signal<BookmarkDto[]>;

  public openFolders: Signal<BookmarkDto[]>;

  constructor(
    @inject(TYPES.LocalStorage) protected readonly storage: Storage,
    @inject(BookmarkStore) protected readonly bookmarkStore: BookmarkStore,
  ) {
    super();

    this.state._configure({
      storage: this.storage,
      key: "BookmarksController"
    });

    this.activeList = computed(() => {
      const bookmarks = this.bookmarkStore.state.bookmarks.value;
      const openFolderId = last(this.state.openFolderPath.value);
      return openFolderId
        ? bookmarks.filter((x) => x.parent === openFolderId)
        : bookmarks.filter((x) => !x.parent);
    });

    this.openFolders = computed(() => {
      return this.state.openFolderPath.value.map((id) =>
        this.bookmarkStore.state.bookmarks.value.find((x) => x._id === id)
      );
    });
  }

  closeOpenFolder = () => {
    this.state._set({ openFolderPath: [] });
  };

  openFolder = (evt: Event) => {
    if (!(evt.target instanceof HTMLElement)) {
      return;
    }

    const { id } = evt.target.dataset;
    const openFolderPath = this.state.openFolderPath.peek();
    const openIndex = openFolderPath.indexOf(id);
    if (openIndex > -1) {
      this.state._set({ openFolderPath: openFolderPath.slice(0, openIndex + 1) });
    } else {
      this.state._set({ openFolderPath: [...openFolderPath, id] });
    }
  };
}
