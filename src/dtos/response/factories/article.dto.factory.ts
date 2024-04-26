import { Article } from "@/main/models/article.model";
import { ArticleDto } from "../interfaces";
import { EntityDtoFactory } from "./entity.dto.factory";

export class ArticleDtoFactory {
    static toDto(model: Article): ArticleDto {
        return {
            ...EntityDtoFactory.toDto(model),
            title: model.title,
            ext: model.ext
        }
    }
}