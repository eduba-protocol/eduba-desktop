import {
    object,
    optional,
    string,
    enums,
    pattern,
  } from "superstruct";
import { BookmarkType } from "../../../enums";
import { bookmarkHrefRegex } from "../../../constants";

export const CreateBookmarkRequestSchema = object({
    type: enums(Object.values(BookmarkType)),
    title: string(),
    parent: optional(string()),
    href: optional(pattern(string(), bookmarkHrefRegex)),
});

export const UpdateBookmarkRequestSchema = object({
    _id: string(),
    type: optional(enums(Object.values(BookmarkType))),
    title: optional(string()),
    parent: optional(string()),
    href: optional(pattern(string(), bookmarkHrefRegex)),
});