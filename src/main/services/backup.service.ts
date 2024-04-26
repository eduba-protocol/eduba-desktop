import Corestore from "corestore";
import * as Constants from "../../constants";
import Hyperdrive from "hyperdrive";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import log, { LogFunctions } from "electron-log";
import { HyperdriveService } from "@/lib/holepunch";
import { UserService } from "./user.service";
import { UserPublisherService } from "./user-publisher.service";
import { Dialog, OpenDialogOptions } from "electron";
import { BackupConfig } from "@/dtos/request/interfaces";

@injectable()
export class BackupService {
  private readonly log: LogFunctions = log.scope("BackupService");
  
  constructor(
    @inject(TYPES.ElectronDialog) private readonly dialog: Dialog,
    @inject(TYPES.HyperdriveService) private readonly driveService: HyperdriveService,
    @inject(TYPES.UserService) private readonly userService: UserService,
    @inject(TYPES.UserPublisherService) private readonly userPublisherService: UserPublisherService
  ) {}

  async backupData({ backupDir }: BackupConfig): Promise<void> {
    const startTime = Date.now();
    this.log.debug("Starting backup");

    const backupStore = new Corestore(backupDir).namespace(Constants.App);
    await backupStore.ready();
    const { sessionStore } = this.userService;

    const backupStream = backupStore.replicate(true);
    const sessionStream = sessionStore.replicate(false);
    backupStream.pipe(sessionStream).pipe(backupStream);

    const _db = this.userService.sessionDbId();
    const userCore = sessionStore.get(_db);
    const userCoreBackup = backupStore.get(_db);

    await this.downloadCore(userCoreBackup, userCore);

    const userPublishers = await this.userPublisherService.find();

    await Promise.all(
      userPublishers.map(async (userPublisher) => {
        const publisherDrive = await this.driveService.db(
          userPublisher._id
        );

        const publisherDriveBackup = new Hyperdrive(
          backupStore,
          userPublisher._id
        );

        await this.downloadCore(
          publisherDriveBackup.core,
          publisherDrive.core
        );

        await publisherDriveBackup.download(`/${Constants.App}`);
      })
    );

    await backupStore.close();

    this.log.debug("Backup complete", `${Date.now() - startTime}ms`);
  }

  async restoreData({ backupDir }: BackupConfig): Promise<void> {
    const startTime = Date.now();
    this.log.debug("Starting restore");

    const backupStore = new Corestore(backupDir).namespace(Constants.App);
    await backupStore.ready();
    const { sessionStore } = this.userService;

    const sessionStream = sessionStore.replicate(true);
    const backupStream = backupStore.replicate(false);
    sessionStream.pipe(backupStream).pipe(sessionStream);

    const _db = this.userService.sessionDbId();
    const userCoreBackup = backupStore.get(_db);
    const userCore = sessionStore.get(_db);

    await this.downloadCore(userCore, userCoreBackup);

    const userPublishers = await this.userPublisherService.find();

    await Promise.all(
      userPublishers.map(async (userPublisher) => {
        // Must get drive by name initially for it to be writable
        const publisherDrive = await this.driveService.db({
          name: userPublisher.coreName,
        });

        const publisherDriveBackup = new Hyperdrive(
          backupStore,
          userPublisher._id
        );

        await this.downloadCore(
          publisherDrive.core,
          publisherDriveBackup.core
        );

        await publisherDrive.download(`/${Constants.App}`);
      })
    );

    await backupStore.close();
    this.log.debug("Restore complete", `${Date.now() - startTime}ms`);
  }

  async selectBackupDir(): Promise<string> {
    const opts: OpenDialogOptions = {
      message: "Select backup folder",
      properties: ["openDirectory"],
    };

    const { filePaths } = await this.dialog.showOpenDialog(opts);
    return filePaths[0];
  }

  private async downloadCore(dest: any, source: any): Promise<void> {
    await source.ready();
    await dest.ready();
  
    const range = dest.download({
      start: dest.length,
      end: source.length
    });

    await range.done();
  }
}
