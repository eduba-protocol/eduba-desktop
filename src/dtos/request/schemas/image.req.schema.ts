import {
    object,
    optional,
    string,
    array,
    pattern,
  } from "superstruct";
import { dbIdRegex } from "../../../main/models/entity.model";

export const CreateImageRequestSchema = object({
    _db: pattern(string(), dbIdRegex),
    file: string(),
    alt: string(),
    tags: array(string()),
});

export const UpdateImageRequestSchema = object({
    _db: pattern(string(), dbIdRegex),
    _id: string(),
    file: optional(string()),
    alt: optional(string()),
    tags: optional(array(string())),
});