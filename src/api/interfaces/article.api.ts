import { CreateArticleRequest, UpdateArticleRequest } from "@/dtos/request/interfaces";
import { ArticleDto } from "@/dtos/response/interfaces";

export interface ArticleApi {
    find(dbId: string): Promise<ArticleDto[]>;

    create(req: CreateArticleRequest): Promise<ArticleDto>;

    update(req: UpdateArticleRequest): Promise<ArticleDto>;

    load(dbId: string, articleId: string): Promise<ArticleDto>;

    loadWithText(dbId: string, articleId: string): Promise<{ article: ArticleDto, text: string }>;

    delete(dbId: string, articleId: string): Promise<void>;

    putText(dbId: string, articleId: string, text: string): Promise<void>;
    
    getText(dbId: string, articleId: string): Promise<string>;
}