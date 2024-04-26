import mime from "mime";
import { AudioExtension, CollectionName } from "../../enums";
import { HyperdriveStorage } from "../../lib/holepunch";
import { Audio } from "../models/audio.model";
import { inject, injectable } from "inversify";
import { Dialog, OpenDialogOptions } from "electron";
import { TYPES } from "../di/types";
import log, { LogFunctions } from "electron-log";
import { CreateAudioRequest, UpdateAudioRequest } from "@/dtos/request/interfaces";
import { DocumentRepository, DocumentRepositoryFactory } from "./common/document.repository";

@injectable()
export class AudioService {
  private readonly log: LogFunctions = log.scope("AudioService");

  private readonly repo: DocumentRepository<Audio>;

  private readonly storage: HyperdriveStorage;

  constructor(
    @inject(TYPES.DriveJsonStorage) private readonly jsonStorage: HyperdriveStorage,
    @inject(TYPES.DriveFileStorage) private readonly fileStorage: HyperdriveStorage,
    @inject(TYPES.ElectronDialog) private readonly dialog: Dialog,
    @inject(TYPES.RepoFactory) private readonly repoFactory: DocumentRepositoryFactory<Audio>
  ) {
    this.repo = this.repoFactory(this.jsonStorage, CollectionName.Audio, Audio);
    this.storage = this.fileStorage.sub(CollectionName.Audio);
  }

  async selectFile() {
    const opts: OpenDialogOptions = {
      message: "Select audio",
      properties: ["openFile"],
      filters: [{
        extensions: Object.values(AudioExtension),
        name: "Audio",
      }],
    };

    const { filePaths } = await this.dialog.showOpenDialog(opts);
    return filePaths[0];
  }

  async create({ file, ...props }: CreateAudioRequest) {
    const audio = new Audio(props);
    audio.setExtension(file);
    await this.repo.create(audio);
    this.storage.putFile(audio._db, audio.fileBase, file);

    return audio;
  }

  async update({ file, _db, _id, ...props }: UpdateAudioRequest) {
    const audio = await this.repo.getOrFail(_db, _id);

    if (file) {
      audio.setExtension(file);
    }

    Object.assign(audio, props);

    await this.repo.put(audio);

    if (file) {
      this.storage.putFile(_db, audio.fileBase, file);
    }

    return audio;
  }

  async get(_db: string, _id: string, load = false) {
    const audio = await (load
      ? this.repo.load(_db, _id)
      : this.repo.get(_db, _id));

    if (audio.ext) {
      audio._type = mime.getType(`.${audio.ext}`);
    }

    return audio;
  }
}
