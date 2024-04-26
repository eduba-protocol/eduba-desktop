import { UploadApi } from "../interfaces/upload.api";
import { CreateUploadRequest, UpdateUploadRequest } from "@/dtos/request/interfaces";
import { UploadDto } from "@/dtos/response/interfaces";
import { IpcSdkBase } from "./base.ipc.sdk";

export class UploadIpcSdk extends IpcSdkBase implements UploadApi {
    create = (req: CreateUploadRequest): Promise<UploadDto> => {
        return this.invoke("upload.create", req);
    }

    update = (req: UpdateUploadRequest): Promise<UploadDto> => {
        return this.invoke("upload.update", req);
    }
  
    selectFile = (): Promise<string> => {
        return this.invoke("upload.selectFile");
    }
  
    get = (dbId: string, uploadId: string): Promise<UploadDto> => {
        return this.invoke("upload.get", dbId, uploadId);
    }
}