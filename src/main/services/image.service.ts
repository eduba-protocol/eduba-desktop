import mime from "mime";
import { Image } from "../models/image.model";
import { ImageExtension, CollectionName } from "../../enums";
import { HyperdriveStorage } from "../../lib/holepunch";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { Dialog, OpenDialogOptions } from "electron";
import { CreateImageRequest, UpdateImageRequest } from "@/dtos/request/interfaces";
import log, { LogFunctions } from "electron-log";
import { DocumentRepository, DocumentRepositoryFactory } from "./common/document.repository";

@injectable()
export class ImageService {
  private readonly log: LogFunctions = log.scope("ImageService");

  private readonly repo: DocumentRepository<Image>;

  private readonly storage: HyperdriveStorage;

  constructor(
    @inject(TYPES.ElectronDialog) private readonly dialog: Dialog,
    @inject(TYPES.DriveJsonStorage) private readonly jsonStorage: HyperdriveStorage,
    @inject(TYPES.DriveFileStorage) private readonly fileStorage: HyperdriveStorage,
    @inject(TYPES.RepoFactory) private readonly repoFactory: DocumentRepositoryFactory<Image>
  ) {
    this.repo = this.repoFactory(this.jsonStorage, CollectionName.Image, Image);
    this.storage = this.fileStorage.sub(CollectionName.Image);
  }

  async selectFile(): Promise<string> {
    const opts: OpenDialogOptions = {
      message: "Select image",
      properties: ["openFile"],
      filters: [{
        name: "Images",
        extensions: Object.values(ImageExtension),
      }],
    };

    const { filePaths } = await this.dialog.showOpenDialog(opts);
    return filePaths[0];
  }

  async create({ file, ...props }: CreateImageRequest): Promise<Image> {
    const image = new Image(props);
    image.setExtension(file);
    await this.repo.create(image);
    this.storage.putFile(image._db, image.fileBase, file);

    return image;
  }

  async update({ file, _db, _id, ...props }: UpdateImageRequest): Promise<Image> {
    const image = await this.repo.getOrFail(_db, _id);

    if (file) {
      image.setExtension(file);
    }

    Object.assign(image, props);

    await this.repo.put(image);

    if (file) {
      this.storage.putFile(_db, image.fileBase, file);
    }

    return image;
  }

  async get(_db: string, _id: string, load = false): Promise<Image> {
    const image = await (load
      ? this.repo.load(_db, _id)
      : this.repo.get(_db, _id));

    if (image.ext) {
      image._type = mime.getType(`.${image.ext}`);
    }

    return image;
  }
}
