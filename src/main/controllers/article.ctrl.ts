import { string, pattern } from "superstruct";
import { inject, injectable } from "inversify";
import { TYPES } from "@/main/di/types";
import { dbIdRegex } from "@/main/models/entity.model";
import { ArticleService } from "@/main/services/article.service";
import { ArticleApi } from "@/api/interfaces/article.api";
import { schema, validate } from "./common/decorators";
import { ArticleDtoFactory } from "@/dtos/response/factories";
import { CreateArticleRequest, UpdateArticleRequest } from "@/dtos/request/interfaces";
import { CreateArticleRequestSchema, UpdateArticleRequestSchema } from "@/dtos/request/schemas";
import { BaseController } from "./base.ctrl";

@injectable()
export class ArticleController extends BaseController implements ArticleApi {
  constructor(
    @inject(TYPES.ArticleService) private readonly articleService: ArticleService,
  ) {
    super();
  }

  @validate
  async find(
    @schema(pattern(string(), dbIdRegex)) publisherId: string
  ) {
    const articles = await this.articleService.find(publisherId);
    return articles.map(ArticleDtoFactory.toDto);
  }

  @validate
  async create(
    @schema(CreateArticleRequestSchema) req: CreateArticleRequest
  ) {
    this.sessionGuard();
    const article = await this.articleService.create(req);
    return ArticleDtoFactory.toDto(article);
  }

  @validate
  async update(
    @schema(UpdateArticleRequestSchema) req: UpdateArticleRequest
  ) {
    this.sessionGuard();
    const article = await this.articleService.update(req);
    return ArticleDtoFactory.toDto(article);
  }

  @validate
  async load(
    @schema(pattern(string(), dbIdRegex)) publisherId: string,
    @schema(string()) articleId: string
  ) {
    const article = await this.articleService.get(publisherId, articleId, true);
    return ArticleDtoFactory.toDto(article);
  }

  @validate
  async loadWithText(
    @schema(pattern(string(), dbIdRegex)) publisherId: string,
    @schema(string()) articleId: string
  ) {
    const { article, text } = await this.articleService.loadWithText(
      publisherId,
      articleId
    );
    return {
      article: ArticleDtoFactory.toDto(article),
      text
    };
  }

  @validate
  async delete(
    @schema(pattern(string(), dbIdRegex)) publisherId: string,
    @schema(string()) articleId: string
  ) {
    this.sessionGuard();
    await this.articleService.delete(publisherId, articleId);
  }

  @validate
  async putText(
    @schema(pattern(string(), dbIdRegex)) publisherId: string,
    @schema(string()) articleId: string,
    @schema(string()) text: string
  ) {
    this.sessionGuard();
    await this.articleService.putText(publisherId, articleId, text);
  }

  @validate
  async getText(
    @schema(pattern(string(), dbIdRegex)) publisherId: string,
    @schema(string()) articleId: string,
  ) {
    return this.articleService.getText(publisherId, articleId);
  }
}

