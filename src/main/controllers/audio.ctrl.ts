import { string, pattern } from "superstruct";
import { inject, injectable } from "inversify";
import { TYPES } from "@/main/di/types";
import { dbIdRegex } from "@/main/models/entity.model";
import { schema, validate } from "./common/decorators";
import { CreateAudioRequestSchema, UpdateAudioRequestSchema } from "@/dtos/request/schemas";
import { AudioService } from "@/main/services/audio.service";
import { AudioApi } from "@/api/interfaces/audio.api";
import { CreateAudioRequest, UpdateAudioRequest } from "@/dtos/request/interfaces";
import { AudioDtoFactory } from "@/dtos/response/factories";
import { BaseController } from "./base.ctrl";

@injectable()
export class AudioController extends BaseController implements AudioApi {
  constructor(
    @inject(TYPES.AudioService) private readonly audioService: AudioService,
  ) {
    super();
  }

  @validate
  async create(
    @schema(CreateAudioRequestSchema) req: CreateAudioRequest
  ) {
    this.sessionGuard();
    const audio = await this.audioService.create(req);
    return AudioDtoFactory.toDto(audio);
  }

  @validate
  async update(
    @schema(UpdateAudioRequestSchema) req: UpdateAudioRequest
  ) {
    this.sessionGuard();
    const audio = await this.audioService.update(req);
    return AudioDtoFactory.toDto(audio);
  }

  async selectFile() {
    return this.audioService.selectFile();
  }

  @validate
  async load(
    @schema(pattern(string(), dbIdRegex)) publisherId: string,
    @schema(string()) audioId: string
  ) {
    const audio = await this.audioService.get(publisherId, audioId, true);
    return AudioDtoFactory.toDto(audio);
  }
}

