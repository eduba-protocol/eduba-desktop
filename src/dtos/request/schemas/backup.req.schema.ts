import { object, string } from "superstruct";

export const BackupConfigSchema = object({
  backupDir: string(),
})
