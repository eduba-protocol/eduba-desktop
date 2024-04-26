import log, { LogFunctions } from "electron-log";
import { inject, injectable } from "inversify";
import { parse as parsePath } from "node:path";
import { EventHandler } from "./common/event-handler";
import { DbChangeEvent } from "@/lib/holepunch";
import * as Constants from "@/constants";
import { TYPES } from "../di/types";
import { Emitter } from "@/lib/emitter";
import { CollectionName, DbChangeType } from "@/enums";
import { BookmarkChangeEvent, PublisherChangeEvent, SubscriptionChangeEvent, UserPublisherChangeEvent } from "@/events/common/main";

@injectable()
export class HyperbeeChangeHandler implements EventHandler {
    private readonly log: LogFunctions = log.scope("HyperbeeChangeHandler");

    static event = DbChangeEvent;

    private static entityRoot = `/${Constants.App}/${Constants.DB}`;

    constructor(
        @inject(TYPES.Events) private readonly events: Emitter
    ) {}

    public async handleEvent(event: DbChangeEvent): Promise<void> {
        if (event.key.startsWith(HyperbeeChangeHandler.entityRoot)) {
            this.handleEntityChange(event);
        }
    }

    private handleEntityChange({ type, db, key }: DbChangeEvent): void {
        const parsed = parsePath(key.slice(HyperbeeChangeHandler.entityRoot.length));
        
        switch(parsed.dir.slice(1)) {
            case CollectionName.Bookmark:
                this.events.dispatch(new BookmarkChangeEvent(type, db, parsed.name));
                break;
            case CollectionName.Subscription:
                this.events.dispatch(new SubscriptionChangeEvent(type, db, parsed.name));
                this.events.dispatch(new PublisherChangeEvent(DbChangeType.Update, parsed.name, Constants.Default));
                break;
            case CollectionName.UserPublisher:
                this.events.dispatch(new UserPublisherChangeEvent(type, db, parsed.name));
                break;
            default:
                this.log.warn(`Unknown DB collection "${parsed.dir}"`)
        }
    }
}
