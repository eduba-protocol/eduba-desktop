import { VideoApi } from "../interfaces/video.api";
import { CreateVideoRequest, UpdateVideoRequest } from "@/dtos/request/interfaces";
import { VideoDto } from "@/dtos/response/interfaces";
import { IpcSdkBase } from "./base.ipc.sdk";

export class VideoIpcSdk extends IpcSdkBase implements VideoApi {
    create = (req: CreateVideoRequest): Promise<VideoDto> => {
        return this.invoke("video.create", req);
    }

    update = (req: UpdateVideoRequest): Promise<VideoDto> => {
        return this.invoke("video.update", req);
    }
  
    selectFile = (): Promise<string> => {
        return this.invoke("video.selectFile");
    }
  
    load = (dbId: string, videoId: string): Promise<VideoDto> => {
        return this.invoke("video.load", dbId, videoId);
    }
}