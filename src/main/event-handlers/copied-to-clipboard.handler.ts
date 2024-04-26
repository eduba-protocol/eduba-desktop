import log, { LogFunctions } from "electron-log";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { EventHandler } from "./common/event-handler";
import { CopiedToClipboardEvent } from "@/events/common/renderer";
import { Clipboard } from "electron";

@injectable()
export class CopiedToClipboardHandler implements EventHandler {
    private readonly log: LogFunctions = log.scope("CopiedToClipboardHandler");

    static event = CopiedToClipboardEvent;

    constructor(
        @inject(TYPES.ElectronClipboard) private readonly clipboard: Clipboard
    ) {}
    
    public async handleEvent(event: CopiedToClipboardEvent): Promise<void> {
        try {
            this.clipboard.writeText(event.text)
        } catch (err) {
            this.log.error(err);
        }
    }
}
