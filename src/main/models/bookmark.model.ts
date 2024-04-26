import { object, string, optional, enums, pattern, assign } from "superstruct";
import { BookmarkType } from "../../enums";
import { bookmarkHrefRegex } from "@/constants";
import { Bookmark_v0_2 } from "../protocol-version/0.2/models/bookmark.model";
import { Entity } from "./entity.model";

export class Bookmark extends Entity implements Bookmark_v0_2 {
  static entityType = "Bookmark";

  href?: string;
  parent?: string;
  title: string;
  type: BookmarkType;

  static schema = assign(
    object({
      href: optional(pattern(string(), bookmarkHrefRegex)),
      parent: optional(pattern(string(), /[0-9]{13}/)),
      title: string(),
      type: enums(Object.values(BookmarkType))
    }),
    Entity.schema
  )

  constructor(init?: Partial<Bookmark>) {
    super(init);
  }
}