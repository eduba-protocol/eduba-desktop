import mime from "mime";
import { Upload } from "../models/upload.model";
import { HyperdriveStorage } from "../../lib/holepunch";
import { CollectionName } from "../../enums";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { Dialog, OpenDialogOptions } from "electron";
import { CreateUploadRequest, UpdateUploadRequest } from "@/dtos/request/interfaces";
import log, { LogFunctions } from "electron-log";
import { DocumentRepository, DocumentRepositoryFactory } from "./common/document.repository";

@injectable()
export class UploadService {
  private readonly log: LogFunctions = log.scope("UploadService");

  private repo: DocumentRepository<Upload>;

  private storage: HyperdriveStorage;

  constructor(
    @inject(TYPES.ElectronDialog) private readonly dialog: Dialog,
    @inject(TYPES.DriveJsonStorage) private readonly jsonStorage: HyperdriveStorage,
    @inject(TYPES.DriveFileStorage) private readonly fileStorage: HyperdriveStorage,
    @inject(TYPES.RepoFactory) private readonly repoFactory: DocumentRepositoryFactory<Upload>
  ) {
    this.repo = this.repoFactory(this.jsonStorage, CollectionName.Upload, Upload);
    this.storage = this.fileStorage.sub(CollectionName.Upload);
  }

  async selectFile(): Promise<string> {
    const opts: OpenDialogOptions = {
      message: "Upload file",
      properties: ["openFile"],
    };

    const { filePaths } = await this.dialog.showOpenDialog(opts);
    return filePaths[0];
  }

  async create({ file, ...props }: CreateUploadRequest): Promise<Upload> {
    const upload = new Upload(props);
    upload.setExtension(file);

    await this.repo.create(upload);
    this.storage.putFile(upload._db, upload.fileBase, file);

    return upload;
  }

  async update({ file, _db, _id, ...props }: UpdateUploadRequest): Promise<Upload> {
    const upload = await this.repo.getOrFail(_db, _id);

    if (file) {
      upload.setExtension(file);
    }

    Object.assign(upload, props);

    await this.repo.put(upload);

    if (file) {
      this.storage.putFile(_db, upload.fileBase, file);
    }

    return upload;
  }

  async get(_db: string, id: string) {
    const upload = await this.repo.load(_db, id);
    if (upload.ext) {
      upload._type = mime.getType(`.${upload.ext}`);
    }
    return upload;
  }
}

