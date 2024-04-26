import { IpcApi } from "@/api/ipc/types";
import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { FormController } from "@/renderer/controllers/form.ctrl";
import { TYPES } from "@/renderer/di";
import { signalState } from "@/lib/signal-state";
import { AppStore } from "@/renderer/stores";
import { inject, injectable } from "inversify";

export interface ArticleEditAudioToolProps {
    onDone: (text: string) => void;
    dbId?: string;
}

export interface ArticleEditAudioToolFormState {
    title: string;
    caption: string;
}

@injectable()
export class ArticleEditAudioToolController extends ComponentController<ArticleEditAudioToolProps> {
    public form: FormController<ArticleEditAudioToolFormState>;

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
            key: "ArticleEditAudioToolController-form"
        })
    }

    handleSubmit = async ({ title, caption }: ArticleEditAudioToolFormState) => {
        try {
            title = title.trim();
            caption = caption.trim();
        
            const file = await this.ipcSdk.audio.selectFile();

            const audio = await this.ipcSdk.audio.create({
              file,
              title,
              _db: this.props.dbId,
              tags: [],
            });
        
            const text = `<eduba-audio publisher="${audio._db}" audio="${audio._id}" caption="${caption}"></eduba-audio>`;

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