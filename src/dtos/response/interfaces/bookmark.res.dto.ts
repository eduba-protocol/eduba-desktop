import { EntityDto } from "./entity.res.dto";
import { BookmarkType } from "@/enums";

export interface BookmarkDto extends EntityDto {
    type: BookmarkType;
    title: string;
    parent: string;
    href: string;
  }