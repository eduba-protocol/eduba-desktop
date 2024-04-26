import { Bookmark } from "@/main/models/bookmark.model";
import { BookmarkDto } from "../interfaces";
import { EntityDtoFactory } from "./entity.dto.factory";

export class BookmarkDtoFactory {
  static toDto(model: Bookmark): BookmarkDto {
      return {
          ...EntityDtoFactory.toDto(model),
          type: model.type,
          title: model.title,
          parent: model.parent,
          href: model.href,
      }
  }
}
