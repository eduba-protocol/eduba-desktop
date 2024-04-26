import { Signal } from "@preact/signals";
import { FormController } from "../../controllers/form.ctrl";
import { AlertType, BookmarkType } from "@/enums";
import { inject, injectable } from "inversify";
import { TYPES } from "@/renderer/di";
import { Emitter } from "@/lib/emitter";
import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { AppStore, BookmarkStore } from "@/renderer/stores";
import { signalState } from "@/lib/signal-state";
import { BookmarkDto } from "@/dtos/response/interfaces";
import { AlertEvent } from "@/events/renderer";

export interface BookmarkEditProps {
  bookmarkSignal: Signal;
  disableHrefEdit?: boolean;
  onDone: (bookmark?: BookmarkDto) => void;
}

export interface BookmarkEditFormState {
  href: string;
  title: string;
}

@injectable()
export class BookmarkEditController extends ComponentController<BookmarkEditProps>{
  public form: FormController<BookmarkEditFormState>;

  public bookmark: BookmarkDto;

  constructor(
    @inject(TYPES.Events) private readonly events: Emitter,
    @inject(TYPES.LocalStorage) private readonly storage: Storage,
    @inject(AppStore) private readonly appStore: AppStore,
    @inject(BookmarkStore) private readonly bookmarkStore: BookmarkStore
  ) {
    super();

    this.form = new FormController<BookmarkEditFormState>(
      this.saveBookmark,
      signalState({ href: "", title: "" })
    );

    this.form.state._configure({
      storage: this.storage,
      key: "BookmarkEditController-form"
    });
  }

  async setFormData(data: BookmarkEditFormState) {
    const { href = "", title = "" } = data || {};
    this.form.state._set({ href, title });
  }

  saveBookmark = async ({ href, title }: BookmarkEditFormState) => {
    try {
      const { _id, type } = this.props.bookmarkSignal.peek();
      href = href.trim();
      title = title.trim();

      let bookmark: BookmarkDto;

      const req: { title: string, href?: string } = { title };

      if (type === BookmarkType.Bookmark) {
        req.href = href;
      }

      if (_id) {
        bookmark = await this.bookmarkStore.updateBookmark({ ...req, _id });
      } else {
        bookmark = await this.bookmarkStore.createBookmark({ ...req, type });
      }

      this.events.dispatch(new AlertEvent({
        type: AlertType.Info,
        message: "Bookmark Saved",
        timeout: 3000,
      }));

      this.props.onDone(bookmark);
    } catch (err) {
      this.appStore.reportError(err);
    }
  };

  cancel = () => {
    this.props.onDone();
  };
}
