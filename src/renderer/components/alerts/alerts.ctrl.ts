import { inject, injectable } from "inversify";
import { Emitter } from "@/lib/emitter";
import { TYPES } from "@/renderer/di";
import { AlertEvent } from "@/events/renderer";
import { signalState } from "@/lib/signal-state";
import { ComponentController } from "@/renderer/controllers/component.ctrl";

export interface AlertsControllerState {
  alerts: AlertEvent[]
}

@injectable()
export class AlertsController extends ComponentController<never>{
  public state = signalState<AlertsControllerState>({ alerts: [] });

  constructor(
    @inject(TYPES.Events) private readonly events: Emitter
  ) {
    super();

    this.events.on(AlertEvent.eventName, this.createAlert);
  }

  destroy() {
    this.events.off(AlertEvent.eventName, this.createAlert);
  }

  createAlert = (alert: AlertEvent) => {
    if (alert.timeout) {
      setTimeout(() => this.removeAlert(alert), alert.timeout);
    }
    if (alert.action) {
      const { handler } = alert.action;
      alert.action.handler = () => {
        handler();
        this.removeAlert(alert);
      };
    }
    this.state._set({ alerts: [...this.state.alerts.peek(), alert] });
  };

  removeAlert(alert: AlertEvent) {
    this.state._set({
      alerts: this.state.alerts.peek().filter((a) => a !== alert),
    });
  }
}