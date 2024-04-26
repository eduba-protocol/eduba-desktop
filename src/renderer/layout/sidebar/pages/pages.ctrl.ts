import { IpcApi, IpcEvents } from "@/api/ipc/types";
import { CreateBookmarkRequest } from "@/dtos/request/interfaces";
import { AlertType, BookmarkType } from "@/enums";
import { AlertEvent } from "@/events/renderer";
import { Emitter } from "@/lib/emitter";
import { signalState } from "@/lib/signal-state";
import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { TYPES } from "@/renderer/di";
import { AppStore, PageStore } from "@/renderer/stores";
import { Page } from "@/renderer/stores/page.store";
import log, { LogFunctions } from "electron-log";
import { inject, injectable } from "inversify";
import { createContext } from "preact";

export const PagesContext = createContext<PagesController>(null);

export interface PagesControllerState {
    bookmarkInEdit: Partial<CreateBookmarkRequest>
  }

@injectable()
export class PagesController extends ComponentController<never> {
    private readonly log: LogFunctions = log.scope("PagesController");

    public state = signalState<PagesControllerState>({
          bookmarkInEdit: null
    });

    constructor(
        @inject(PageStore) private readonly pageStore: PageStore,
        @inject(TYPES.IpcEvents) private readonly ipcEvents: IpcEvents,
        @inject(TYPES.Events) private readonly events: Emitter,
        @inject(TYPES.IpcSdk) private readonly ipcSdk: IpcApi,
        @inject(AppStore) private readonly appStore: AppStore,
    ){
        super()
    }
    
    closePage = (evt: Event): void => {
        if (!(evt.currentTarget instanceof HTMLButtonElement)) {
            return;
        }
        
        const pageId = evt.currentTarget.dataset.page;

        if (pageId) {
            this.pageStore.closePage(pageId);
        }
    }

    share = ({ article }: Page) => {
        if (!article) {
            this.log.warn("Attempted to share page with no article");
            return;
        }
    
        this.ipcEvents.dispatch.CopiedToClipboardEvent(
          `${article._db}/articles/${article._id}`
        );
    
        this.events.dispatch(new AlertEvent({
          type: AlertType.Success,
          message: "Copied to clipboard",
          timeout: 3000,
        }));
    }

    subscribeToPublisher = async ({ publisher }: Page) => {
        try {
          await this.ipcSdk.publisher.subscribe({ _id: publisher._db });
    
          this.events.dispatch(new AlertEvent({
            type: AlertType.Success,
            message: "Subscribed",
            timeout: 3000,
          }));
        } catch (err) {
          this.appStore.reportError(err);
        }
    }

    unsubscribeFromPublisher = async ({ publisher }: Page) => {
        try {
          await this.ipcSdk.publisher.unsubscribe(publisher._db);
    
          this.events.dispatch(new AlertEvent({
            type: AlertType.Success,
            message: "Unsubscribed",
            timeout: 3000,
          }));
        } catch (err) {
          this.appStore.reportError(err);
        }
    }

    openEditBookmark = ({ article }: Page) => {
        this.state._set({
          bookmarkInEdit: {
            type: BookmarkType.Bookmark,
            href: `${article._db}/articles/${article._id}`,
            title: article.title,
          },
        });
    };

    handleBookmarkEditDone = () => {
        this.state._set({ bookmarkInEdit: null });
    };
}