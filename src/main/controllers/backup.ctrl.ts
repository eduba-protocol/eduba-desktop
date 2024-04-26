import { inject, injectable } from "inversify";
import { TYPES } from "@/main/di/types";
import { schema, validate } from "./common/decorators";
import { BackupService } from "@/main/services/backup.service";
import { BackupApi } from "@/api/interfaces/backup.api";
import { BackupConfig } from "@/dtos/request/interfaces";
import { BackupConfigSchema } from "@/dtos/request/schemas";
import { BaseController } from "./base.ctrl";

@injectable()
export class BackupController extends BaseController implements BackupApi {
  constructor(
    @inject(TYPES.BackupService) private readonly backupService: BackupService
  ) {
    super();
  }

  async selectBackupDir() {
    this.sessionGuard();
    return this.backupService.selectBackupDir();
  }

  @validate
  async backupData(
    @schema(BackupConfigSchema) req: BackupConfig
  ) {
    this.sessionGuard();
    return this.backupService.backupData(req);
  }

  @validate
  async restoreData(
    @schema(BackupConfigSchema) req: BackupConfig
  ) {
    this.sessionGuard();
    return this.backupService.restoreData(req);
  }
}

