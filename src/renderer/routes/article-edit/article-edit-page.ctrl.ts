import { FormController } from "../../controllers/form.ctrl";
import { createContext, createRef } from "preact";
import { Signal, computed } from "@preact/signals";
import { ArticleDto } from "@/dtos/response/interfaces";
import { signalState } from "@/lib/signal-state";
import { inject, injectable } from "inversify";
import { TYPES } from "@/renderer/di";
import { AppStore, PageStore } from "@/renderer/stores";
import { IpcApi } from "@/api/ipc/types";
import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { ArticleContentExtension } from "@/enums";

export const ArticleEditPageContext = createContext(null);

export enum EditToolType {
  Article = "article",
  Audio = "audio",
  Image = "image",
  Upload = "upload",
  Video = "video",
}

export interface ArticleEditPageControllerState {
    article: ArticleDto | null;
    markdown: string;
    warning: boolean;
    toolModal: EditToolType | null;
}

export interface ArticleEditPageFormState {
  title: string;
  markdown: string;
}

export interface ArticleEditPageProps {
  pageId: string;
  dbId?: string;
  articleId?: string;
}

@injectable()
export class ArticleEditPageController extends ComponentController<ArticleEditPageProps> {
  public state = signalState<ArticleEditPageControllerState>(
    {
      article: null,
      markdown: "",
      warning: false,
      toolModal: null
    }
  );

  public form: FormController<ArticleEditPageFormState>;

  public displayMarkdown: Signal<string>;

  public textareaRef = createRef<HTMLTextAreaElement>();

  constructor(
    @inject(TYPES.LocalStorage) private readonly storage: Storage,
    @inject(TYPES.IpcSdk) private readonly ipcSdk: IpcApi,
    @inject(AppStore) private readonly appStore: AppStore,
    @inject(PageStore) private readonly pageStore: PageStore
  ) {
    super();

    this.form = new FormController<ArticleEditPageFormState>(
      this.handleSubmit,
      signalState<ArticleEditPageFormState>(
        { title: "", markdown: "" }
      )
    )

    this.displayMarkdown = computed(() => {
      const title = this.form.state.title.value;
      const markdown = this.form.state.markdown.value;
      return title ? `# ${title}\n\n${markdown}` : markdown;
    });
  }

  async initialize(props: ArticleEditPageProps) {
    try {
      this.state._configure({ storage: this.storage, key: this.props.pageId });
      this.form.state._configure({ storage: this.storage, key: `${this.props.pageId}-form` })

      const { dbId, articleId } = props;

      if (dbId && articleId) {
        const { article, text } = await this.ipcSdk.article.loadWithText(dbId, articleId);
        
        this.state._set({ article, markdown: text });

        const formState: Partial<ArticleEditPageFormState> = {}

        if (!this.form.state.title.peek()) {
          formState.title = article.title;
        }

        if (!this.form.state.markdown.peek()) {
          formState.markdown = text;
        }

        this.form.state._set(formState);
      }
    } catch (err) {
      this.appStore.reportError(err);
    }
  }

  cancelEdit = () => {
    const article = this.state.article.peek();

    if (article) {
      const page = {
        href: `${article._db}/articles/${article._id}`,
      };
      this.pageStore.replacePage(this.props.pageId, page);
    } else {
      this.pageStore.closePage(this.props.pageId);
    }
  };

  handleSubmit = async (data: ArticleEditPageFormState) => {
    try {
      let { dbId, articleId } = this.props;
      const article = this.state.article.peek();

      if (!dbId) {
        const publisher = await this.ipcSdk.publisher.create({
          ext: ArticleContentExtension.Markdown,
          title: data.title,
        });

        dbId = publisher._db;
        articleId = publisher.article as string;
      } else if (!articleId) {
        const article = await this.ipcSdk.article.create({
          _db: dbId,
          title: data.title,
          ext: ArticleContentExtension.Markdown,
          tags: [],
        });

        articleId = article._id;
      } else if (article.title !== data.title) {
        await this.ipcSdk.article.update({ _db: dbId, _id: articleId, title: data.title });
      }

      const markdown = this.state.markdown.peek();

      if (!markdown || markdown !== data.markdown) {
        await this.ipcSdk.article.putText(dbId, articleId, data.markdown);
      }

      const page = { href: `${dbId}/articles/${articleId}` };
      this.pageStore.replacePage(this.props.pageId, page);
    } catch (err) {
      this.appStore.reportError(err);
    }
  };

  setTextarea = (text: string) => {
    this.textareaRef.current.value = text;
    if (text !== this.form.state.markdown.value) {
      this.form.state._set({ markdown: text });
    }
  };

  insertText = (text: string) => {
    const textarea = this.textareaRef.current;
    let value = textarea.value;

    if (textarea.selectionStart) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      value = `${value.slice(0, start)}${text}${value.slice(end)}`;
    } else {
      value += text;
    }

    this.setTextarea(value);
  };

  openToolModal({ target }: Event) {
    if (target instanceof HTMLElement) {
      const { type } = target.dataset;
      this.state._set({ toolModal: type });
    }
  }
}
