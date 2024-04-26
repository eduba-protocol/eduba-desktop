import {
    object,
    optional,
    string,
    array,
    pattern,
  } from "superstruct";
  import { dbIdRegex } from "../../../main/models/entity.model";

export const CreateAudioRequestSchema = object({
    _db: pattern(string(), dbIdRegex),
    file: string(),
    title: string(),
    tags: optional(array(string())),
});

export const UpdateAudioRequestSchema = object({
    _db: pattern(string(), dbIdRegex),
    _id: string(),
    file: optional(string()),
    title: optional(string()),
    tags: optional(array(string())),
});