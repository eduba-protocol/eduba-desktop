import { IpcApi, IpcEvents } from "@/api/ipc/types";
import { ArticleDto } from "@/dtos/response/interfaces";
import { ArticleChangeEvent } from "@/events/common/main";
import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { TYPES } from "@/renderer/di";
import { signalState } from "@/lib/signal-state";
import { AppStore } from "@/renderer/stores";
import { inject, injectable } from "inversify";

export interface PublisherArticlesPageControllerState {
  articles: ArticleDto[];
}

export interface PublisherArticlesPageProps {
  pageId: string;
  dbId: string;
}

@injectable()
export class PublisherArticlesPageController extends ComponentController<PublisherArticlesPageProps> {
  public state = signalState<PublisherArticlesPageControllerState>({ articles: [] });

  constructor(
    @inject(AppStore) private readonly appStore: AppStore,
    @inject(TYPES.IpcSdk) private readonly ipcSdk: IpcApi,
    @inject(TYPES.IpcEvents) private readonly ipcEvents: IpcEvents
  ) {
    super();
  }

  async initialize() {
    this.listeners = [
      this.ipcEvents.on.ArticleChangeEvent(this.handleArticleChanged),
    ];

    this.refreshArticles();
  }

  handleArticleChanged = async ({ db }: ArticleChangeEvent) => {
    if (db === this.props.dbId) {
      this.refreshArticles();
    }
  };

  async refreshArticles() {
    try {
      const articles = await this.ipcSdk.article.find(this.props.dbId);
      this.state._set({ articles });
    } catch (err) {
      this.appStore.reportError(err);
    }
  }
}
