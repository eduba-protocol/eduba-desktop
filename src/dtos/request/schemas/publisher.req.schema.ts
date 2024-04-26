import { object, string, enums, pattern, boolean } from "superstruct";
import { ArticleContentExtension } from "../../../enums";
import { dbIdRegex } from "../../../main/models/entity.model";

export const CreatePublisherRequestSchema = object({
    title: string(),
    ext: enums(Object.values(ArticleContentExtension)),
});

export const UpdateUserPublisherRequestSchema = object({
    _id: pattern(string(), dbIdRegex),
    pinned: boolean(),
});