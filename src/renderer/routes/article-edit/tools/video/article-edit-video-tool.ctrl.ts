import { IpcApi } from "@/api/ipc/types";
import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { FormController } from "@/renderer/controllers/form.ctrl";
import { TYPES } from "@/renderer/di";
import { signalState } from "@/lib/signal-state";
import { AppStore } from "@/renderer/stores";
import { inject, injectable } from "inversify";

export interface ArticleEditVideoToolProps {
    onDone: (text: string) => void;
    dbId?: string;
}

export interface ArticleEditVideoToolFormState {
    title: string;
    caption: string;
}

@injectable()
export class ArticleEditVideoToolController extends ComponentController<ArticleEditVideoToolProps> {
    public form: FormController<ArticleEditVideoToolFormState>;

    constructor(
        @inject(TYPES.LocalStorage) private readonly storage: Storage,
        @inject(AppStore) private readonly appStore: AppStore,
        @inject(TYPES.IpcSdk) private readonly ipcSdk: IpcApi
    ){
        super();

        this.form = new FormController(
            this.handleSubmit,
            signalState({ title: "", caption: "" })
        );

        this.form.state._configure({
            storage: this.storage,
            key: "ArticleEditVideoToolController-form"
        })
    }

    handleSubmit = async ({ title, caption }: ArticleEditVideoToolFormState) => {
        try {
            title = title.trim();
            caption = caption.trim();
        
            const file = await this.ipcSdk.video.selectFile();

            const video = await this.ipcSdk.video.create({
                file,
                title,
                _db: this.props.dbId,
                tags: [],
              });
        
            const text = `<eduba-video publisher="${video._db}" video="${video._id}" caption="${caption}"></eduba-video>`;

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