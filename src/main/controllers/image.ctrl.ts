import { string, pattern } from "superstruct";
import { inject, injectable } from "inversify";
import { TYPES } from "@/main/di/types";
import { dbIdRegex } from "@/main/models/entity.model";
import { schema, validate } from "./common/decorators";
import { CreateImageRequest, UpdateImageRequest } from "@/dtos/request/interfaces";
import { ImageService } from "@/main/services/image.service";
import { ImageApi } from "@/api/interfaces/image.api";
import { CreateImageRequestSchema, UpdateImageRequestSchema } from "@/dtos/request/schemas";
import { ImageDtoFactory } from "@/dtos/response/factories";
import { BaseController } from "./base.ctrl";

@injectable()
export class ImageController extends BaseController implements ImageApi {
  constructor(
    @inject(TYPES.ImageService) private readonly imageService: ImageService
  ) {
    super();
  }

  @validate
  async create(
    @schema(CreateImageRequestSchema) req: CreateImageRequest
  ) {
    this.sessionGuard();
    const image = await this.imageService.create(req);
    return ImageDtoFactory.toDto(image);
  }

  @validate
  async update(
    @schema(UpdateImageRequestSchema) req: UpdateImageRequest
  ) {
    this.sessionGuard();
    const image = await this.imageService.update(req);
    return ImageDtoFactory.toDto(image);
  }

  async selectFile() {
    this.sessionGuard();
    return this.imageService.selectFile();
  }

  @validate
  async load(
    @schema(pattern(string(), dbIdRegex)) publisherId: string,
    @schema(string()) imageId: string
  ) {
    const image = await this.imageService.get(publisherId, imageId, true);
    return ImageDtoFactory.toDto(image);
  }
}

