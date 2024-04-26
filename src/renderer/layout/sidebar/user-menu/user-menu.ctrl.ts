import { IpcApi, IpcEvents } from "@/api/ipc/types";
import { PopulatedPublisherDto } from "@/dtos/response/interfaces";
import { ArticleChangeEvent } from "@/events/common/main";
import { signalState } from "@/lib/signal-state";
import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { TYPES } from "@/renderer/di";
import { AppStore, AuthStore } from "@/renderer/stores";
import { effect } from "@preact/signals";
import { inject, injectable } from "inversify";
import { createContext } from "preact";

export const UserMenuContext = createContext(null);

export interface UserMenuControllerState {
  userPublishers: PopulatedPublisherDto[];
}

@injectable()
export class UserMenuController extends ComponentController<never>{
  public state = signalState<UserMenuControllerState>({
    userPublishers: []
  });

  public backupModalId = "backup-modal";
  public newPublisherModalId = "new-publisher-modal";

  constructor(
    @inject(TYPES.Document) private readonly document: Document,
    @inject(TYPES.IpcSdk) private readonly ipcSdk: IpcApi,
    @inject(TYPES.IpcEvents) private readonly ipcEvents: IpcEvents,
    @inject(AuthStore) private readonly authStore: AuthStore,
    @inject(AppStore) private readonly appStore: AppStore
  ){
    super();

    this.listeners = [
      this.ipcEvents.on.UserPublisherChangeEvent(
        this.handleUserPublisherChanged
      ),
      this.ipcEvents.on.ArticleChangeEvent(this.handleArticleChange),
      effect(() => {
        this.initializeWithSession(this.authStore.state.sessionActive.value);
      }),
    ];
  }

  async initializeWithSession(sessionActive: boolean) {
    if (!sessionActive) {
      this.state._set({ userPublishers: [] });
      return;
    }

    try {
      this.state._set({
        userPublishers: await this.ipcSdk.publisher.findUserPublishers(),
      });
    } catch (err) {
      this.appStore.reportError(err);
    }
  }


  handleUserPublisherChanged = async () => {
    this.state._set({
      userPublishers: await this.ipcSdk.publisher.findUserPublishers(),
    });
  };

  handleArticleChange = async ({ db, id }: ArticleChangeEvent) => {
    if (!this.authStore.state.sessionActive.peek()) {
      return;
    }

    const publisher = await this.ipcSdk.publisher.load(db);
    if (publisher._writable && publisher.article._id === id) {
      this.state._set({ userPublishers: await this.ipcSdk.publisher.findUserPublishers() });
    }
  };

  openBackup = () => {
    const modal = this.document.getElementById(this.backupModalId);
    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  };

  closeBackup = () => {
    const modal = this.document.getElementById(this.backupModalId);
    if (modal instanceof HTMLDialogElement) {
      modal.close();
    }
  };

  openNewPublisher = () => {
    const modal = this.document.getElementById(this.newPublisherModalId);
    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  };

  closeNewPublisher = () => {
    const modal = this.document.getElementById(this.newPublisherModalId);
    if (modal instanceof HTMLDialogElement) {
      modal.close();
    }
  };

  signOut = () => {
    this.ipcSdk.auth.signOut();
  }
}
