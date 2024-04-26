import { object, string, enums, pattern, optional, array } from "superstruct";
import { ArticleContentExtension } from "../../../enums";
import { dbIdRegex } from "../../../main/models/entity.model";

export const CreateArticleRequestSchema = object({
    _db: pattern(string(), dbIdRegex),
    title: optional(string()),
    ext: enums(Object.values(ArticleContentExtension)),
    tags: array(string()),
});

export const UpdateArticleRequestSchema = object({
    _db: pattern(string(), dbIdRegex),
    _id: string(),
    title: optional(string()),
    ext: optional(enums(Object.values(ArticleContentExtension))),
    tags: optional(array(string())),
});