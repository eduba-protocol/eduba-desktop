import { AppStore } from "@/renderer/stores";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IpcApi } from "@/api/ipc/types";
import { PopulatedPublisherDto } from "@/dtos/response/interfaces";

@injectable()
export class PublisherStore {
  constructor(
    @inject(AppStore) private readonly appStore: AppStore,
    @inject(TYPES.IpcSdk) private readonly ipcSdk: IpcApi
  ) {}

  togglePublisherPinned = async (publisher: PopulatedPublisherDto) => {
    try {
      await this.ipcSdk.publisher.updateUserPublisher({
        _id: publisher._db,
        pinned: !publisher._pinned,
      });
    } catch (err) {
      this.appStore.reportError(err);
    }
  };
}
