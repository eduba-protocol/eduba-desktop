import { CreateUploadRequest, UpdateUploadRequest } from "@/dtos/request/interfaces";
import { UploadDto } from "@/dtos/response/interfaces";

export interface UploadApi {
  create(req: CreateUploadRequest): Promise<UploadDto>;

  update(req: UpdateUploadRequest): Promise<UploadDto>;

  selectFile(): Promise<string>;

  get(dbId: string, uploadId: string): Promise<UploadDto>;
}
