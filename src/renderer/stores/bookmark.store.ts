import { effect } from "@preact/signals";
import { SignalState, signalState } from "@/lib/signal-state";
import { inject, injectable } from "inversify";
import { AppStore } from "./app.store";
import { TYPES } from "../di/types";
import { IpcApi, IpcEvents } from "@/api/ipc/types";
import { CreateBookmarkRequest, UpdateBookmarkRequest } from "@/dtos/request/interfaces";
import { BookmarkDto } from "@/dtos/response/interfaces";
import { AuthStore } from "./auth.store";

export interface BookmarkStoreState {
  bookmarks: BookmarkDto[];
}

@injectable()
export class BookmarkStore {
  public state: SignalState<BookmarkStoreState>;

  constructor(
    @inject(AppStore) private readonly appStore: AppStore,
    @inject(AuthStore) private readonly authStore: AuthStore,
    @inject(TYPES.IpcSdk) private readonly ipcSdk: IpcApi,
    @inject(TYPES.IpcEvents) private readonly ipcEvents: IpcEvents
  ) {
    this.state = signalState({ bookmarks: [] });

    this.ipcEvents.on.BookmarkChangeEvent(this.refreshBookmarks);

    effect(() => {
      this.handleSessionStatusChange(this.authStore.state.sessionActive.value);
    });
  }

  async handleSessionStatusChange(sessionActive: boolean) {
    if (!sessionActive) {
      this.state._set({ bookmarks: [] });
      return;
    }

    this.refreshBookmarks();
  }

  createBookmark(req: CreateBookmarkRequest) {
    return this.ipcSdk.bookmark.create(req);
  }

  refreshBookmarks = async () => {
    try {
      this.state._set({ bookmarks: await this.ipcSdk.bookmark.find() });
    } catch (err) {
      this.appStore.reportError(err);
    }
  };

  updateBookmark(req: UpdateBookmarkRequest) {
    return this.ipcSdk.bookmark.update(req);
  }
}
