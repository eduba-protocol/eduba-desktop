import { AlertEvent } from "@/events/renderer";
import { AlertType } from "@/enums";
import { inject, injectable } from "inversify";
import { Emitter } from "@/lib/emitter";
import { TYPES } from "../di/types";
import { IpcEvents } from "@/api/ipc/types";
import { signalState } from "@/lib/signal-state";

export enum SidebarTab {
    Subscriptions = "Subscriptions",
    UserMenu = "UserMenu",
    Pages = "Pages"
}

export interface AppStoreState {
    sidebarTab: SidebarTab
}

@injectable()
export class AppStore {
    public state = signalState<AppStoreState>({
        sidebarTab: SidebarTab.Pages
    });

    constructor(
        @inject(TYPES.Events) private readonly events: Emitter,
        @inject(TYPES.IpcEvents) private readonly ipcEvents: IpcEvents
    ) {}

    reportError = (error: Error, showAlert = true) => {
        console.error(error);
        this.ipcEvents.dispatch.RendererErrorEvent(error.stack);

        if (showAlert) {
            this.events.dispatch(new AlertEvent({
              type: AlertType.Error,
              message: error.message,
            }));
        }
    };

    setSidebarTab(sidebarTab: SidebarTab) {
        this.state._set({ sidebarTab });
    }
}
