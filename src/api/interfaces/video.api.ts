import { CreateVideoRequest, UpdateVideoRequest } from "@/dtos/request/interfaces";
import { VideoDto } from "@/dtos/response/interfaces";

export interface VideoApi {
  create(req: CreateVideoRequest): Promise<VideoDto>;

  update(req: UpdateVideoRequest): Promise<VideoDto>;

  selectFile(): Promise<string>;

  load(dbId: string, videoId: string): Promise<VideoDto>;
}