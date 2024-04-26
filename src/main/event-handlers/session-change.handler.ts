import log, { LogFunctions } from "electron-log";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { SessionStatusChangeEvent } from "@/events/common/main/index";
import { UserPublisherService } from "../services/user-publisher.service";
import { SubscriptionService } from "../services/subscription.service";
import { EventHandler } from "./common/event-handler";
import { SessionStatus } from "@/enums";
import { HyperbeeService, HyperdriveService } from "@/lib/holepunch";
import ElectronStore from "electron-store";
import * as Constants from "@/constants"

@injectable()
export class SessionStatusChangeHandler implements EventHandler {
    private readonly log: LogFunctions = log.scope("SessionStatusChangeHandler");

    static event = SessionStatusChangeEvent;

    constructor(
        @inject(TYPES.UserPublisherService) private readonly userPublisherService: UserPublisherService,
        @inject(TYPES.SubscriptionService) private readonly subscriptionService: SubscriptionService,
        @inject(TYPES.HyperdriveService) private readonly driveService: HyperdriveService,
        @inject(TYPES.HyperbeeService) private readonly beeService: HyperbeeService,
        @inject(TYPES.ElectronStore) private readonly store: ElectronStore
    ) {}
    
    public async handleEvent(event: SessionStatusChangeEvent): Promise<void> {
        try {
            if (event.status === SessionStatus.Active) {
                await Promise.all([
                    this.userPublisherService.joinAllToSwarm(),
                    this.subscriptionService.subscribeAllToSwarm(),
                ]);
            } else {
                await Promise.all([
                    this.driveService.endSession(),
                    this.beeService.endSession(),
                    this.store.delete(Constants.Session),
                ]);
            }
        } catch (err) {
            this.log.error(err);
        }

    }
}
