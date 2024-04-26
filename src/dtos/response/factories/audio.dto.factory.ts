import { Audio } from "@/main/models/audio.model";
import { AudioDto } from "../interfaces";
import { EntityDtoFactory } from "./entity.dto.factory";

export class AudioDtoFactory {
  static toDto(model: Audio): AudioDto {
      return {
          ...EntityDtoFactory.toDto(model),
          _type: model._type,
          title: model.title,
          ext: model.ext
      }
  }
}