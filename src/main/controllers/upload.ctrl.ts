import { string, pattern } from "superstruct";
import { inject, injectable } from "inversify";
import { TYPES } from "@/main/di/types";
import { dbIdRegex } from "@/main/models/entity.model";
import { schema, validate } from "./common/decorators";
import { CreateUploadRequest, UpdateUploadRequest } from "@/dtos/request/interfaces";
import { UploadService } from "@/main/services/upload.service";
import { UploadApi } from "@/api/interfaces/upload.api";
import { UploadDtoFactory } from "@/dtos/response/factories";
import { CreateUploadRequestSchema, UpdateUploadRequestSchema } from "@/dtos/request/schemas";
import { BaseController } from "./base.ctrl";

@injectable()
export class UploadController extends BaseController implements UploadApi {
  constructor(
    @inject(TYPES.UploadService) private readonly uploadService: UploadService
  ) {
    super();
  }

  @validate
  async get(
    @schema(pattern(string(), dbIdRegex)) publisherId: string,
    @schema(string()) uploadId: string
  ) {
    const upload = await this.uploadService.get(publisherId, uploadId);
    return UploadDtoFactory.toDto(upload);
  }

  @validate
  async create(
    @schema(CreateUploadRequestSchema) req: CreateUploadRequest
  ) {
    this.sessionGuard();
    const upload = await this.uploadService.create(req);
    return UploadDtoFactory.toDto(upload);
  }

  @validate
  async update(
    @schema(UpdateUploadRequestSchema) req: UpdateUploadRequest
  ) {
    this.sessionGuard();
    const upload = await this.uploadService.update(req);
    return UploadDtoFactory.toDto(upload);
  }

  async selectFile() {
    this.sessionGuard();
    return this.uploadService.selectFile();
  }
}

