import { shareArticlePattern } from "@/constants";
import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { FormController } from "@/renderer/controllers/form.ctrl";
import { TYPES } from "@/renderer/di";
import { signalState } from "@/lib/signal-state";
import { AppStore } from "@/renderer/stores";
import { inject, injectable } from "inversify";

export interface ArticleEditLinkToolProps {
    onDone: (text: string) => void;
}

export interface ArticleEditLinkToolFormState {
    href: string;
    label: string;
}

@injectable()
export class ArticleEditLinkToolController extends ComponentController<ArticleEditLinkToolProps> {
    public form: FormController<ArticleEditLinkToolFormState>;

    constructor(
        @inject(TYPES.LocalStorage) private readonly storage: Storage,
        @inject(AppStore) private readonly appStore: AppStore
    ){
        super();

        this.form = new FormController(
            this.handleSubmit,
            signalState({ href: "", label: "" })
        );

        this.form.state._configure({
            storage: this.storage,
            key: "ArticleEditLinkToolController-form"
        })
    }

    handleSubmit = ({ href, label }: ArticleEditLinkToolFormState) => {
        try {
            href = href.trim();
            label = label.trim();
        
            const parts = new RegExp(shareArticlePattern, "i").exec(href);

            // @TODO: better UI around invalid links
            const text = parts
              ? `<eduba-article publisher="${parts[1]}" article="${parts[2]}" label="${label}"></eduba-article>`
              : "";

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