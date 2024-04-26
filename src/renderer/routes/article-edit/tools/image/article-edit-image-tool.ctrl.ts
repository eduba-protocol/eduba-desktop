import { IpcApi } from "@/api/ipc/types";
import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { FormController } from "@/renderer/controllers/form.ctrl";
import { TYPES } from "@/renderer/di";
import { signalState } from "@/lib/signal-state";
import { AppStore } from "@/renderer/stores";
import { inject, injectable } from "inversify";

export interface ArticleEditImageToolProps {
    onDone: (text: string) => void;
    dbId?: string;
}

export interface ArticleEditImageToolFormState {
    alt: string;
    caption: string;
}

@injectable()
export class ArticleEditImageToolController extends ComponentController<ArticleEditImageToolProps> {
    public form: FormController<ArticleEditImageToolFormState>;

    constructor(
        @inject(TYPES.LocalStorage) private readonly storage: Storage,
        @inject(AppStore) private readonly appStore: AppStore,
        @inject(TYPES.IpcSdk) private readonly ipcSdk: IpcApi
    ){
        super();

        this.form = new FormController(
            this.handleSubmit,
            signalState({ alt: "", caption: "" })
        );

        this.form.state._configure({
            storage: this.storage,
            key: "ArticleEditImageToolController-form"
        })
    }

    handleSubmit = async ({ alt, caption }: ArticleEditImageToolFormState) => {
        try {
            alt = alt.trim();
            caption = caption.trim();
        
            const file = await this.ipcSdk.image.selectFile();

            const image = await this.ipcSdk.image.create({
              file,
              alt,
              _db: this.props.dbId,
              tags: [],
            });
        
            const text = `<eduba-image publisher="${image._db}" image="${image._id}" caption="${caption}"></eduba-image>`;

            this.props.onDone(text);
            this.form.state._reset();
          } catch (err) {
            this.appStore.reportError(err);
          }
    }

    cancel = () => {
        this.form.state._reset();
        this.props.onDone("");
    }
}