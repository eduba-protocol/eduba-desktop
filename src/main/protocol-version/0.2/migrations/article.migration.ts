import { Article_v0_1 } from "../../0.1/models/article.model";
import { Article_v0_2 } from "../models/article.model";
import { VERSION } from "../constants";
import { stringToEnum } from "@/lib/common/utils/enum";
import { ArticleContentExtension } from "../enums";
import { Migration } from "@/main/migration/types";

export class ArticleMigration implements Migration {
    public async run({ createdAt, ext, ...data }: Article_v0_1): Promise<Article_v0_2> {
        const article: Article_v0_2 = {
            ...data,
            ext: stringToEnum(ArticleContentExtension, ext.slice(1)),
            meta: {
                createdAt,
                version: VERSION
            }
        };
        return article;
    }
}