import { BackupConfig } from "@/dtos/request/interfaces";
import { BackupApi } from "../interfaces/backup.api";
import { IpcSdkBase } from "./base.ipc.sdk";

export class BackupIpcSdk extends IpcSdkBase implements BackupApi {
  selectBackupDir = (): Promise<string> => {
    return this.invoke("backup.selectBackupDir");
  }

  backupData = (req: BackupConfig): Promise<void> => {
    return this.invoke("backup.backupData", req);
  }

  restoreData = (req: BackupConfig): Promise<void> => {
    return this.invoke("backup.restoreData", req);
  }
}