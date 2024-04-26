import { string, pattern } from "superstruct";
import { inject, injectable } from "inversify";
import { TYPES } from "@/main/di/types";
import { dbIdRegex } from "@/main/models/entity.model";
import { schema, validate } from "./common/decorators";
import { CreateVideoRequest, UpdateVideoRequest } from "@/dtos/request/interfaces";
import { VideoService } from "@/main/services/video.service";
import { VideoApi } from "@/api/interfaces/video.api";
import { CreateVideoRequestSchema, UpdateVideoRequestSchema } from "@/dtos/request/schemas";
import { VideoDtoFactory } from "@/dtos/response/factories";
import { BaseController } from "./base.ctrl";

@injectable()
export class VideoController extends BaseController implements VideoApi {
  constructor(
    @inject(TYPES.VideoService) private readonly videoService: VideoService
  ) {
    super();
  }

  @validate
  async create(
    @schema(CreateVideoRequestSchema) req: CreateVideoRequest
  ) {
    this.sessionGuard();
    const video = await this.videoService.create(req);
    return VideoDtoFactory.toDto(video);
  }

  @validate
  async update(
    @schema(UpdateVideoRequestSchema) req: UpdateVideoRequest
  ) {
    this.sessionGuard();
    const video = await this.videoService.update(req);
    return VideoDtoFactory.toDto(video);
  }

  async selectFile() {
    return this.videoService.selectFile();
  }

  @validate
  async load(
    @schema(pattern(string(), dbIdRegex)) publisherId: string,
    @schema(string()) audioId: string
  ) {
    const video = await this.videoService.get(publisherId, audioId, true);
    return VideoDtoFactory.toDto(video);
  }
}

