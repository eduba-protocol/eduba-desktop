import { BookmarkType } from "../enums";
import { Entity_v0_2 } from "./Entity.model";

export interface Bookmark_v0_2 extends Entity_v0_2 {
    href?: string;
    parent?: string;
    title: string;
    type: BookmarkType;
}