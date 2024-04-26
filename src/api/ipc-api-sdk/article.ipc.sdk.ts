import { ArticleApi } from "../interfaces/article.api"
import { CreateArticleRequest, UpdateArticleRequest } from "@/dtos/request/interfaces";
import { ArticleDto } from "@/dtos/response/interfaces";
import { IpcSdkBase } from "./base.ipc.sdk";

export class ArticleIpcSdk extends IpcSdkBase implements ArticleApi {
    find = (dbId: string): Promise<ArticleDto[]> => {
        return this.invoke("article.find", dbId);
    }

    create = (req: CreateArticleRequest): Promise<ArticleDto> => {
        return this.invoke("article.create", req);
    }

    update = (req: UpdateArticleRequest): Promise<ArticleDto> => {
        return this.invoke("article.update", req);
    }

    load = (dbId: string, articleId: string): Promise<ArticleDto> => {
        return this.invoke("article.load", dbId, articleId);
    }

    loadWithText = (dbId: string, articleId: string): Promise<{ article: ArticleDto, text: string }> => {
        return this.invoke("article.loadWithText", dbId, articleId);
    }

    delete = (dbId: string, articleId: string): Promise<void> => {
        return this.invoke("article.delete", dbId, articleId);
    }

    putText = (dbId: string, articleId: string, text: string): Promise<void> => {
        return this.invoke("article.putText", dbId, articleId, text);
    }

    getText = (dbId: string, articleId: string): Promise<string> => {
        return this.invoke("article.getText", dbId, articleId);
    }
}