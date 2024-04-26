import { effect } from "@preact/signals";
import { signalState } from "@/lib/signal-state";
import { inject, injectable } from "inversify";
import { TYPES } from "@/renderer/di";
import { IpcApi, IpcEvents } from "@/api/ipc/types";
import { PopulatedPublisherDto } from "@/dtos/response/interfaces";
import { AppStore, AuthStore } from "@/renderer/stores";
import { ComponentController } from "@/renderer/controllers/component.ctrl";

export interface SubscriptionsControllerState {
  subscribedPublishers: PopulatedPublisherDto[];
}

@injectable()
export class SubscriptionsController extends ComponentController<never>{
  public state = signalState<SubscriptionsControllerState>({
    subscribedPublishers: []
  });

  constructor(
    @inject(TYPES.IpcEvents) private readonly ipcEvents: IpcEvents,
    @inject(TYPES.IpcSdk) private readonly ipcSdk: IpcApi,
    @inject(AppStore) private readonly appStore: AppStore,
    @inject(AuthStore) private readonly authStore: AuthStore,
  ) {
    super();

    this.listeners = [
      this.ipcEvents.on.SubscriptionChangeEvent(this.handleSubscriptionChanged),
      effect(() => {
        this.initializeWithSession(this.authStore.state.sessionActive.value);
      }),
    ];
  }

  async initializeWithSession(sessionActive: boolean) {
    if (!sessionActive) {
      this.state._set({ subscribedPublishers: [] });
      return;
    }

    try {
      this.state._set({
        subscribedPublishers: await this.ipcSdk.publisher.findSubscribed()
      });
    } catch (err) {
      this.appStore.reportError(err);
    }
  }

  handleSubscriptionChanged = async () => {
    if (!this.authStore.state.sessionActive.peek()) {
      return;
    }

    this.state._set({
      subscribedPublishers: await this.ipcSdk.publisher.findSubscribed(),
    });
  };
}
