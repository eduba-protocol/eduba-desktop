import {
    object,
    optional,
    string,
    pattern,
  } from "superstruct";
  import { dbIdRegex } from "../../../main/models/entity.model";

export const CreateUploadRequestSchema = object({
    _db: pattern(string(), dbIdRegex),
    file: string(),
    fileName: optional(string()),
});

export const UpdateUploadRequestSchema = object({
    _db: pattern(string(), dbIdRegex),
    _id: string(),
    file: optional(string()),
    fileName: optional(string()),
});