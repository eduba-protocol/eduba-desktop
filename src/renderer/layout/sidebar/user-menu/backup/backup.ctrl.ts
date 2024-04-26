import { FormController } from "../../../../controllers/form.ctrl";
import { inject, injectable } from "inversify";
import { TYPES } from "@/renderer/di";
import { Emitter } from "@/lib/emitter";
import { signalState } from "@/lib/signal-state";
import { AppStore } from "@/renderer/stores";
import { IpcApi } from "@/api/ipc/types";
import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { AlertEvent } from "@/events/renderer";
import { AlertType } from "@/enums";

export enum BackupAction {
  Backup = "Backup",
  Restore = "Restore",
}

export interface BackupProps {
  onClose: () => void;
}

export interface BackupFormState {
  backupDir: string;
  action: BackupAction
}

export interface BackupControllerState {
  backupInProgress: boolean;
}

@injectable()
export class BackupController extends ComponentController<BackupProps>{
  public state = signalState<BackupControllerState>({ backupInProgress: false });

  public form: FormController<BackupFormState>;

  constructor(
    @inject(TYPES.Events) private readonly events: Emitter,
    @inject(TYPES.LocalStorage) private readonly storage: Storage,
    @inject(AppStore) private readonly appStore: AppStore,
    @inject(TYPES.IpcSdk) private readonly ipcSdk: IpcApi
  ) {
    super();

    this.state._configure({ storage: this.storage, key: "BackupController" });

    this.form = new FormController<BackupFormState>(
      this.handleSubmit,
      signalState({ backupDir: "", action: BackupAction.Backup })
    );

    this.form.state._configure({
      storage: this.storage,
      key: "BackupController-form"
    })
  }

  handleSubmit = ({ backupDir, action }: BackupFormState) => {
    switch (action) {
      case BackupAction.Backup:
        this.backupData(backupDir);
        break;
      case BackupAction.Restore:
        this.restoreData(backupDir);
        break;
    }
  };

  backupData(backupDir: string) {
    if (this.state.backupInProgress.peek()) return;

    this.props.onClose();

    this.events.dispatch(new AlertEvent({
      type: AlertType.Info,
      message: "Backup in progress",
      timeout: 1500,
    }));

    this.ipcSdk.backup
      .backupData({ backupDir })
      .then(() => {
        this.events.dispatch(new AlertEvent({
          type: AlertType.Success,
          message: "Backup finished",
          timeout: 3000,
        }));
      })
      .catch(this.appStore.reportError)
      .finally(() => {
        this.state._set({ backupInProgress: false });
      });
  }

  restoreData(backupDir: string) {
    if (this.state.backupInProgress.peek()) return;

    this.events.dispatch(new AlertEvent({
      type: AlertType.Success,
      message: "Restore in progress",
      timeout: 1500,
    }));

    this.props.onClose();

    this.ipcSdk.backup
      .restoreData({ backupDir })
      .then(() => {
        this.events.dispatch(new AlertEvent({
          type: AlertType.Success,
          message: "Restore finished",
          timeout: 3000,
        }));
      })
      .catch(this.appStore.reportError)
      .finally(() => {
        this.state._set({ backupInProgress: false })
      });
  }

  selectBackupDir = async () => {
    try {
      this.form.state._set({ backupDir: await this.ipcSdk.backup.selectBackupDir() });
    } catch (err) {
      this.appStore.reportError(err);
    }
  };
}
