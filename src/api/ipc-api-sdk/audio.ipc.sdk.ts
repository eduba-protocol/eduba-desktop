import { CreateAudioRequest, UpdateAudioRequest } from "@/dtos/request/interfaces";
import { AudioDto } from "@/dtos/response/interfaces";
import { AudioApi } from "../interfaces/audio.api";
import { IpcSdkBase } from "./base.ipc.sdk";

export class AudioIpcSdk extends IpcSdkBase implements AudioApi {
    create = (req: CreateAudioRequest): Promise<AudioDto> => {
        return this.invoke("audio.create", req);
    }

    update = (req: UpdateAudioRequest): Promise<AudioDto> => {
        return this.invoke("audio.update", req);
    }

    selectFile = (): Promise<string> => {
        return this.invoke("audio.selectFile");
    }

    load = (dbId: string, audioId: string): Promise<AudioDto> => {
        return this.invoke("audio.load", dbId, audioId);
    }
}