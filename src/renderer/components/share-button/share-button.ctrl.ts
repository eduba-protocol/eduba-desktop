import { inject, injectable } from "inversify";
import { IpcEvents } from "@/api/ipc/types";
import { AlertType } from "@/enums";
import { AlertEvent } from "@/events/renderer";
import { Emitter } from "@/lib/emitter";
import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { TYPES } from "@/renderer/di";

export interface ShareButtonProps {
  href: string;
}

@injectable()
export class ShareButtonController extends ComponentController<ShareButtonProps> {
  constructor(
    @inject(TYPES.Events) private readonly events: Emitter,
    @inject(TYPES.IpcEvents) private readonly ipcEvents: IpcEvents
  ){
    super();
  }
  
  copyToClipboard = () => {
    this.ipcEvents.dispatch.CopiedToClipboardEvent(this.props.href);

    this.events.dispatch(new AlertEvent({
      type: AlertType.Info,
      message: "Copied to clipboard",
      timeout: 3000,
    }));
  }
}

