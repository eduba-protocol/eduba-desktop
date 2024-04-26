import log, { LogFunctions } from "electron-log";
import { EventHandler } from "./common/event-handler";
import { RendererErrorEvent } from "@/events/common/renderer";
import { injectable } from "inversify";

@injectable()
export class RendererErrorHandler implements EventHandler {
    private readonly log: LogFunctions = log.scope("RendererErrorHandler");

    static event = RendererErrorEvent;
    
    public async handleEvent(event: RendererErrorEvent): Promise<void> {
        try {
            this.log.error(event.stack)
        } catch (err) {
            this.log.error(err);
        }
    }
}
