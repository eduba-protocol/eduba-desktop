import { FormController } from "../../controllers/form.ctrl";
import { inject, injectable } from "inversify";
import { TYPES } from "@/renderer/di";
import { signalState } from "@/lib/signal-state";
import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { PageStore } from "@/renderer/stores";

export interface NewTabPageProps {
  pageId: string;
}

export interface NewTabFormState {
  href: string;
}

@injectable()
export class NewTabPageController extends ComponentController<NewTabPageProps> {
  public form: FormController<NewTabFormState>;

  constructor(
    @inject(TYPES.LocalStorage) private readonly storage: Storage,
    @inject(PageStore) private readonly pageStore: PageStore
  ) {
    super();

    this.form = new FormController(
      this.insertPage,
      signalState({ href: "" })
    );
  }

  initialize(props: NewTabPageProps): void {
    this.form.state._configure({ storage: this.storage, key: `${props.pageId}-form` })
  }
  
  insertPage = ({ href }: NewTabFormState) => {
    this.pageStore.addPage({ href });
  };
}
