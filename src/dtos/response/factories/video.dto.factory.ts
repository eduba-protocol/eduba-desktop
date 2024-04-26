import { Video } from "@/main/models/video.model";
import { VideoDto } from "../interfaces";
import { EntityDtoFactory } from "./entity.dto.factory";

export class VideoDtoFactory {
  static toDto(model: Video): VideoDto {
      return {
        ...EntityDtoFactory.toDto(model),
          _type: model._type,
          ext: model.ext,
          title: model.title
      }
  }
}
