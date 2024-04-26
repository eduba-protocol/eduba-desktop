import { ImageApi } from "../interfaces/image.api";
import { CreateImageRequest, UpdateImageRequest } from "@/dtos/request/interfaces";
import { ImageDto } from "@/dtos/response/interfaces";
import { IpcSdkBase } from "./base.ipc.sdk";

export class ImageIpcSdk extends IpcSdkBase implements ImageApi {
  create = (req: CreateImageRequest): Promise<ImageDto> => {
    return this.invoke("image.create", req);
  }

  update = (req: UpdateImageRequest): Promise<ImageDto> => {
    return this.invoke("image.update", req);
  }

  selectFile = (): Promise<string> => {
    return this.invoke("image.selectFile");
  }

  load = (dbId: string, imageId: string): Promise<ImageDto> => {
    return this.invoke("image.load", dbId, imageId);
  }
}