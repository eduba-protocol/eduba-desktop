import { Image } from "@/main/models/image.model";
import { ImageDto } from "../interfaces";
import { EntityDtoFactory } from "./entity.dto.factory";

export class ImageDtoFactory {
  static toDto(model: Image): ImageDto {
      return {
          ...EntityDtoFactory.toDto(model),
          _type: model._type,
          alt: model.alt,
          ext: model.ext,
      }
  }
}
