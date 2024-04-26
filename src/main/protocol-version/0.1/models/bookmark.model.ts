import { BookmarkType } from "../enums";

export interface Bookmark_v0_1 {
    href?: string;
    parent?: string;
    title: string;
    type: BookmarkType;
}