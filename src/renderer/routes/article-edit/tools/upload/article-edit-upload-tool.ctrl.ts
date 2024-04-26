import { inject, injectable } from "inversify";
import { IpcApi } from "@/api/ipc/types";
import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { FormController } from "@/renderer/controllers/form.ctrl";
import { TYPES } from "@/renderer/di";
import { signalState } from "@/lib/signal-state";
import { AppStore } from "@/renderer/stores";

export interface ArticleEditUploadToolProps {
    onDone: (text: string) => void;
    dbId?: string;
}

export interface ArticleEditUploadToolFormState {
    fileName: string;
}

@injectable()
export class ArticleEditUploadToolController extends ComponentController<ArticleEditUploadToolProps> {
    public form: FormController<ArticleEditUploadToolFormState>;

    constructor(
        @inject(TYPES.LocalStorage) private readonly storage: Storage,
        @inject(AppStore) private readonly appStore: AppStore,
        @inject(TYPES.IpcSdk) private readonly ipcSdk: IpcApi
    ){
        super();

        this.form = new FormController(
            this.handleSubmit,
            signalState({ fileName: "" })
        );

        this.form.state._configure({
            storage: this.storage,
            key: "ArticleEditUploadToolController-form"
        })
    }

    handleSubmit = async ({ fileName }: ArticleEditUploadToolFormState) => {
        try {
            fileName = fileName.trim();
        
            const file = await this.ipcSdk.upload.selectFile();

            const upload = await this.ipcSdk.upload.create({
                fileName,
                file,
                _db: this.props.dbId
              });
        
            const text = `<eduba-upload publisher="${upload._db}" upload="${upload._id}"></eduba-upload>`;

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