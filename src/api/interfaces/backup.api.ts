import { BackupConfig } from "@/dtos/request/interfaces";

export interface BackupApi {
  selectBackupDir(): Promise<string>;

  backupData(req: BackupConfig): Promise<void>;

  restoreData(req: BackupConfig): Promise<void>;
}

