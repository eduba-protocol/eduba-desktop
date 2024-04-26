import { CreateAudioRequest, UpdateAudioRequest } from "@/dtos/request/interfaces";
import { AudioDto } from "@/dtos/response/interfaces";

export interface AudioApi {
  create(req: CreateAudioRequest): Promise<AudioDto>;

  update(req: UpdateAudioRequest): Promise<AudioDto>;

  selectFile(): Promise<string>;

  load(dbId: string, audioId: string): Promise<AudioDto>;
}
