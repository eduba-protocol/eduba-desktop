import { inject, injectable } from "inversify";
import { IpcApi } from "@/api/ipc/types";
import { ArticleContentExtension } from "@/enums";
import { signalState } from "@/lib/signal-state";
import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { FormController } from "@/renderer/controllers/form.ctrl";
import { TYPES } from "@/renderer/di";
import { AppStore, PageStore } from "@/renderer/stores";

export interface NewPublisherProps {
    onClose: () => void;
}

export interface NewPublisherFormState {
    title: string;
}

@injectable()
export class NewPublisherController extends ComponentController<NewPublisherProps> {
    public form: FormController<NewPublisherFormState>;

    public modalId = "new-publisher-modal";

    constructor(
      @inject(AppStore) private readonly appStore: AppStore,
      @inject(TYPES.IpcSdk) private readonly ipcSdk: IpcApi,
      @inject(PageStore) private readonly pageStore: PageStore
    ) {
      super();
  
      this.form = new FormController<NewPublisherFormState>(
        this.handleSubmit,
        signalState({ title: "" })
      );
    }

    cancel = () => {
        this.form.state._reset();
        this.props.onClose();
    }

    handleSubmit = async ({ title }: NewPublisherFormState): Promise<void> => {
        try {
            const publisher = await this.ipcSdk.publisher.create({
                ext: ArticleContentExtension.Markdown,
                title
            });
            const href = `/edit/articles/${publisher._db}/${publisher.article}`;
            this.pageStore.addPage({ title: `Edit - ${title}`, href });
            this.cancel();
        } catch (err) {
            this.appStore.reportError(err);
        }
    }
}