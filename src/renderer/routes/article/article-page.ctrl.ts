import { createContext } from "preact";
import { Signal, computed } from "@preact/signals";
import { inject, injectable } from "inversify";
import { TYPES } from "@/renderer/di";
import { Emitter } from "@/lib/emitter";
import { ArticleDto, PopulatedPublisherDto } from "@/dtos/response/interfaces";
import { signalState } from "@/lib/signal-state";
import { AppStore, PageStore } from "@/renderer/stores";
import { IpcApi, IpcEvents } from "@/api/ipc/types";
import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { ArticleChangeEvent, ArticleTextChangeEvent, PublisherChangeEvent } from "@/events/common/main";

export const ArticlePageContext = createContext(null);

export interface ArticlePageProps {
  pageId: string;
  dbId: string;
  articleId: string;
}

export interface ArticlePageControllerState {
  publisher: PopulatedPublisherDto;
  article: ArticleDto;
  markdown: string;
}

@injectable()
export class ArticlePageController extends ComponentController<ArticlePageProps>{
  public state = signalState<ArticlePageControllerState>(
    {
      publisher: null,
      article: null,
      markdown: ""
    }
  );

  public displayMarkdown: Signal<string>;

  public loading: Signal<boolean>;

  constructor(
    @inject(TYPES.Events) private readonly events: Emitter,
    @inject(TYPES.LocalStorage) private readonly storage: Storage,
    @inject(TYPES.IpcSdk) private readonly ipcSdk: IpcApi,
    @inject(TYPES.IpcEvents) private readonly ipcEvents: IpcEvents,
    @inject(AppStore) private readonly appStore: AppStore,
    @inject(PageStore) private readonly pageStore: PageStore,
  ) {
    super();

    this.displayMarkdown = computed(() => {
      const { title } = this.state.article.value;
      const markdown = this.state.markdown.value;
      return title ? `# ${title}\n\n${markdown}` : markdown;
    });

    this.loading = computed(() => !this.state.markdown.value);
  }


  async initialize(props: ArticlePageProps) {
    try {
      this.state._configure({ storage: this.storage, key: props.pageId });

      const publisher = await this.ipcSdk.publisher.load(props.dbId);
      const { article, text: markdown } = await this.ipcSdk.article.loadWithText(
        props.dbId,
        props.articleId
      );

      this.state._set({ article, markdown, publisher });

      if (article) {
        this.pageStore.updatePage(props.pageId, { article, publisher });
      }

      this.listeners = [
        this.ipcEvents.on.PublisherChangeEvent(this.handlePublisherChanged),
        this.ipcEvents.on.ArticleChangeEvent(this.handleArticleChanged),
        this.ipcEvents.on.ArticleTextChangeEvent(this.handleTextChanged),
      ];
    } catch (err) {
      this.appStore.reportError(err);
    }
  }

  handlePublisherChanged = async (evt: PublisherChangeEvent) => {
    try {
      if (this.props.dbId === evt.db) {
        const publisher = await this.ipcSdk.publisher.load(evt.db);
        if (publisher) {
          this.state._set({ publisher });
          this.pageStore.updatePage(this.props.pageId, { publisher });
        }
      }
    } catch (err) {
      this.appStore.reportError(err);
    }
  };

  handleArticleChanged = async (evt: ArticleChangeEvent) => {
    try {
      if (this.props.dbId === evt.db && this.props.articleId === evt.id) {
        const article = await this.ipcSdk.article.load(evt.db, evt.id);
        if (article) {
          this.state._set({ article });
          this.pageStore.updatePage(this.props.pageId, { article });
        }
      }
    } catch (err) {
      this.appStore.reportError(err);
    }
  };

  handleTextChanged = async (evt: ArticleTextChangeEvent) => {
    try {
      if (this.props.dbId === evt.db && this.props.articleId === evt.id) {
        const markdown = await this.ipcSdk.article.getText(evt.db, evt.id);
        if (markdown) {
          this.state._set({ markdown });
        }
      }
    } catch (err) {
      this.appStore.reportError(err);
    }
  };
}
