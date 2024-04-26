import {
    object,
    optional,
    string,
    array,
    pattern,
  } from "superstruct";
  import { dbIdRegex } from "../../../main/models/entity.model";

export const CreateVideoRequestSchema = object({
    _db: pattern(string(), dbIdRegex),
    file: string(),
    title: string(),
    tags: array(string()),
});

export const UpdateVideoRequestSchema = object({
    _db: pattern(string(), dbIdRegex),
    _id: string(),
    file: optional(string()),
    title: optional(string()),
    tags: optional(array(string())),
  });