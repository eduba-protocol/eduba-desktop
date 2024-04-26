import { CreateImageRequest, UpdateImageRequest } from "@/dtos/request/interfaces";
import { ImageDto } from "@/dtos/response/interfaces";

export interface ImageApi {
  create(req: CreateImageRequest): Promise<ImageDto>;

  update(req: UpdateImageRequest): Promise<ImageDto>;

  selectFile(): Promise<string>;

  load(dbId: string, imageId: string): Promise<ImageDto>;
}