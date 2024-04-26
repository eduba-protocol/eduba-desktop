import mime from "mime";
import { VideoExtension, CollectionName } from "../../enums";
import { HyperdriveStorage } from "../../lib/holepunch";
import { Video } from "../models/video.model";
import { inject, injectable } from "inversify";
import { Dialog, OpenDialogOptions } from "electron";
import { TYPES } from "../di/types";
import { CreateVideoRequest, UpdateVideoRequest } from "@/dtos/request/interfaces";
import log, { LogFunctions } from "electron-log";
import { DocumentRepository, DocumentRepositoryFactory } from "./common/document.repository";

@injectable()
export class VideoService {
  private readonly log: LogFunctions = log.scope("VideoService");

  private readonly repo: DocumentRepository<Video>;

  private readonly storage: HyperdriveStorage;

  constructor(
    @inject(TYPES.ElectronDialog) private readonly dialog: Dialog,
    @inject(TYPES.DriveJsonStorage) private readonly jsonStorage: HyperdriveStorage,
    @inject(TYPES.DriveFileStorage) private readonly fileStorage: HyperdriveStorage,
    @inject(TYPES.RepoFactory) private readonly repoFactory: DocumentRepositoryFactory<Video>
  ) {
    this.repo = this.repoFactory(this.jsonStorage, CollectionName.Video, Video);
    this.storage = this.fileStorage.sub(CollectionName.Video);
  }

  async selectFile(): Promise<string> {
    const opts: OpenDialogOptions = {
      message: "Select video",
      properties: ["openFile"],
      filters: [{
        name: "Video",
        extensions: Object.values(VideoExtension),
      }],
    };

    const { filePaths } = await this.dialog.showOpenDialog(opts);
    return filePaths[0];
  }

  async create({ file, ...props }: CreateVideoRequest): Promise<Video> {
    const video = new Video(props);
    video.setExtension(file);
    await this.repo.create(video);
    this.storage.putFile(video._db, video.fileBase, file);

    return video;
  }

  async update({ file, _db, _id, ...props }: UpdateVideoRequest): Promise<Video> {
    const video = await this.repo.getOrFail(_db, _id);

    if (file) {
      video.setExtension(file);
    }

    Object.assign(video, props);

    await this.repo.put(video);

    if (file) {
      this.storage.putFile(_db, video.fileBase, file);
    }

    return video;
  }

  async get(_db: string, id: string, load = false): Promise<Video> {
    const video = await (load
      ? this.repo.load(_db, id)
      : this.repo.get(_db, id));

    if (video.ext) {
      video._type = mime.getType(`.${video.ext}`);
    }

    return video;
  }
}
