import log, { LogFunctions } from "electron-log";
import { inject, injectable } from "inversify";
import { parse as parsePath } from "node:path";
import { EventHandler } from "./common/event-handler";
import * as Constants from "@/constants";
import { CollectionName } from "@/enums";
import { DbChangeEvent } from "@/lib/holepunch";
import { TYPES } from "../di/types";
import { Emitter } from "@/lib/emitter";
import { ArticleChangeEvent, ArticleTextChangeEvent, AudioChangeEvent, ImageChangeEvent, PublisherChangeEvent, UploadChangeEvent, VideoChangeEvent } from "@/events/common/main";

@injectable()
export class HyperdriveChangeHandler implements EventHandler {
    private readonly log: LogFunctions = log.scope("HyperdriveChangeHandler");

    static event = DbChangeEvent;

    private static entityRoot = `/${Constants.App}/${Constants.DB}`;
    private static fileRoot = `/${Constants.App}/${Constants.Files}`;
    private static textRoot = `/${Constants.App}/${Constants.Text}`;

    constructor(
        @inject(TYPES.Events) private readonly events: Emitter
    ) {}

    public async handleEvent(event: DbChangeEvent): Promise<void> {
        if (event.key.startsWith(HyperdriveChangeHandler.entityRoot)) {
            this.handleEntityChange(event);
        }
        if (event.key.startsWith(HyperdriveChangeHandler.textRoot)) {
            this.handleTextChange(event);
        }
    }

    private handleEntityChange({ type, db, key }: DbChangeEvent): void {
        const parsed = parsePath(key.slice(HyperdriveChangeHandler.entityRoot.length));
        
        switch(parsed.dir.slice(1)) {
            case CollectionName.Article:
                this.events.dispatch(new ArticleChangeEvent(type, db, parsed.name));
                break;
            case CollectionName.Audio:
                this.events.dispatch(new AudioChangeEvent(type, db, parsed.name));
                break;
            case CollectionName.Image:
                this.events.dispatch(new ImageChangeEvent(type, db, parsed.name));
                break;
            case CollectionName.Publisher:
                this.events.dispatch(new PublisherChangeEvent(type, db, parsed.name));
                break;
            case CollectionName.Upload:
                this.events.dispatch(new UploadChangeEvent(type, db, parsed.name));
                break;
            case CollectionName.Video:
                this.events.dispatch(new VideoChangeEvent(type, db, parsed.name));
                break;
            default:
                this.log.warn(`Unknown DB collection "${parsed.dir}"`)
        }
    }

    private handleTextChange({ type, db, key }: DbChangeEvent): void {
        const parsed = parsePath(key.slice(HyperdriveChangeHandler.textRoot.length));

        switch(parsed.dir.slice(1)) {
            case CollectionName.Article:
                this.events.dispatch(new ArticleTextChangeEvent(type, db, parsed.name))
        }
    }
}