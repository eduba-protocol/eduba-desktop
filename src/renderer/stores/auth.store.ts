import { signalState } from "@/lib/signal-state";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IpcApi, IpcEvents } from "@/api/ipc/types";
import { SessionStatus } from "@/enums";
import { SessionStatusChangeEvent } from "@/events/common/main";
import { AppStore } from "./app.store";

export interface AuthStoreState {
  sessionActive: boolean;
}

@injectable()
export class AuthStore {
  public state = signalState<AuthStoreState>(
    { sessionActive: false }
  );

  constructor(
    @inject(AppStore) private readonly appStore: AppStore,
    @inject(TYPES.IpcSdk) private readonly ipcSdk: IpcApi,
    @inject(TYPES.IpcEvents) private readonly ipcEvents: IpcEvents
  ){
    this.ipcEvents.on.SessionStatusChangeEvent(({ status }: SessionStatusChangeEvent) => {
      this.state._set({ sessionActive: status === SessionStatus.Active });
    });

    this.initialize().catch(err => {
      console.error("Not able to restore session.");
      this.appStore.reportError(err);
    })
  }

  async initialize() {
    const { status } = await this.ipcSdk.auth.sessionStatus();
    this.state._set({ sessionActive: status === SessionStatus.Active })
  }
}
