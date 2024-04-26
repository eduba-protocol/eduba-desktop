import { VNode, h } from "preact";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useController } from "@/renderer/hooks";
import { AlertsController } from "./alerts.ctrl";

export default function Alerts() {
  const ctrl = useController<never, AlertsController>(
    AlertsController
  );

  return (
    <div class="toast toast-center">
      {ctrl.state.alerts.value.map((alert) => {
        let actionBtn: VNode<HTMLButtonElement>;

        if (alert.action) {
          actionBtn = (
            <button class="btn btn-ghost" onClick={alert.action.handler}>
              {alert.action.label}
            </button>
          );
        } else if (!alert.timeout) {
          actionBtn = (
            <button
              class="btn btn-circle btn-ghost"
              onClick={() => ctrl.removeAlert(alert)}
            >
              <XMarkIcon class="x-4 h-4 text-inherit" />
            </button>
          );
        }

        return (
          <div key={alert.message} class={`alert ${alert.type}`}>
            <span>{alert.message}</span>
            {actionBtn}
          </div>
        );
      })}
    </div>
  );
}


