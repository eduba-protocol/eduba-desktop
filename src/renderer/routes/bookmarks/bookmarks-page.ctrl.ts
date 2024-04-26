import { inject, injectable } from "inversify";
import { createContext } from "preact";
import { last } from "@/renderer/utils";
import { AlertType, BookmarkType } from "@/enums";
import { AlertEvent } from "@/events/renderer";
import { CreateBookmarkRequest } from "@/dtos/request/interfaces";
import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { signalState } from "@/lib/signal-state";
import { BookmarkDto } from "@/dtos/response/interfaces";
import { Signal, computed } from "@preact/signals";
import { Emitter } from "@/lib/emitter";
import { AppStore, BookmarkStore } from "@/renderer/stores";
import { IpcApi } from "@/api/ipc/types";
import { TYPES } from "@/renderer/di";

export const BookmarksPageContext = createContext(null);

export enum ClipType {
  Copy = "copy",
  Cut = "cut",
}

export interface Clipped {
  type: ClipType;
  id: string;
}

export interface BookmarksControllerState {
  openFolderPath: string[];
  bookmarkInEdit: CreateBookmarkRequest;
  clippedBookmark: Clipped;
}

@injectable()
export class BookmarksPageController extends ComponentController<never> {
  public state = signalState<BookmarksControllerState>(
    {
      openFolderPath: [],
      bookmarkInEdit: null,
      clippedBookmark: null
    }
  );

  public activeList: Signal<BookmarkDto[]>;

  public openFolders: Signal<BookmarkDto[]>;

  constructor(
    @inject(TYPES.Events) protected readonly events: Emitter,
    @inject(TYPES.LocalStorage) protected readonly storage: Storage,
    @inject(BookmarkStore) protected readonly bookmarkStore: BookmarkStore,
    @inject(AppStore) protected readonly appStore: AppStore,
    @inject(TYPES.IpcSdk) protected readonly ipcSdk: IpcApi
  ) {
    super();

    this.activeList = computed(() => {
      const bookmarks = this.bookmarkStore.state.bookmarks.value;
      const clipped = this.state.clippedBookmark.value;
      const openFolderId = last(this.state.openFolderPath.value);
      const activeBookmarks = openFolderId
        ? bookmarks.filter((x) => x.parent === openFolderId)
        : bookmarks.filter((x) => !x.parent);
      return clipped && clipped.type === ClipType.Cut
        ? activeBookmarks.filter((x) => x._id !== clipped.id)
        : activeBookmarks;
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

  addBookmarkInternal(type: BookmarkType) {
    const openFolderId = last(this.state.openFolderPath.peek());
    const bookmark: CreateBookmarkRequest = { type, href: "", title: "" };
    if (openFolderId) {
      bookmark.parent = openFolderId;
    }
    this.state._set({ bookmarkInEdit: bookmark });
  }

  addBookmark = () => {
    this.addBookmarkInternal(BookmarkType.Bookmark);
  };

  addFolder = () => {
    this.addBookmarkInternal(BookmarkType.Folder);
  };

  copyBookmark = (evt: Event) => {
    if (!(evt.target instanceof HTMLElement)) {
      return;
    }

    const { id } = evt.target.dataset;
    this.state._set({ clippedBookmark: { id, type: ClipType.Copy } });
    this.events.dispatch(new AlertEvent({
      type: AlertType.Info,
      message: "Bookmark copied",
      timeout: 3000,
    }));
  };

  cutBookmark = (evt: Event) => {
    if (!(evt.target instanceof HTMLElement)) {
      return;
    }

    const { id } = evt.target.dataset;
    
    this.state._set({ clippedBookmark: { id, type: ClipType.Cut } });

    this.events.dispatch(new AlertEvent({
      type: AlertType.Info,
      message: "Bookmark cut",
      timeout: 3000,
    }));
  };

  deleteBookmark = async (evt: Event) => {
    if (!(evt.target instanceof HTMLElement)) {
      return;
    }

    try {
      const { id } = evt.target.dataset;
      await this.ipcSdk.bookmark.delete(id);
    } catch (err) {
      this.appStore.reportError(err);
    }
  };

  editBookmark = (evt: Event) => {
    if (!(evt.target instanceof HTMLElement)) {
      return;
    }

    const { id } = evt.target.dataset;
    const bookmark = this.bookmarkStore.state.bookmarks
      .peek()
      .find((x) => x._id === id);
    this.state._set({ bookmarkInEdit: bookmark });
  };

  handleBookmarkEditDone = () => {
    this.state._set({ bookmarkInEdit: null });
  };

  pasteBookmark = async () => {
    try {
      const clipped = this.state.clippedBookmark.peek();
      if (!clipped) return;

      const bookmark = this.bookmarkStore.state.bookmarks
        .peek()
        .find((x) => x._id === clipped.id);

      if (!bookmark) return;

      const parent = last(this.state.openFolderPath.peek());
      bookmark.parent = parent;

      switch (clipped.type) {
        case ClipType.Copy:
          await this.bookmarkStore.createBookmark({
            type: bookmark.type,
            title: bookmark.title,
            href: bookmark.href,
            parent: bookmark.parent
          });
          break;
        case ClipType.Cut:
          await this.bookmarkStore.updateBookmark({
            _id: bookmark._id,
            parent: bookmark.parent
          });
          break;
      }

      this.state._set({ clippedBookmark: null });
    } catch (err) {
      this.appStore.reportError(err);
    }
  };
}
