import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { AppStore } from "@/renderer/stores";
import { SidebarTab } from "@/renderer/stores/app.store";
import { inject, injectable } from "inversify";

@injectable()
export class SidebarController extends ComponentController<never> {
    constructor(
        @inject(AppStore) private readonly appStore: AppStore,
    ) {
        super()
    }

    selectTab = ({ currentTarget }: Event) => {
        if (currentTarget instanceof HTMLAnchorElement) {
            this.appStore.setSidebarTab(currentTarget.dataset.tab as SidebarTab);
        }
    };
}