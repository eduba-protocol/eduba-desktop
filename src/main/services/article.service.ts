import { inject, injectable } from "inversify";
import { CollectionName } from "../../enums";
import { HyperdriveStorage } from "../../lib/holepunch";
import { Article } from "../models/article.model";
import { TYPES } from "../di/types";
import log, { LogFunctions } from "electron-log";
import { CreateArticleRequest, UpdateArticleRequest } from "@/dtos/request/interfaces";
import { DocumentRepository, DocumentRepositoryFactory } from "./common/document.repository";

@injectable()
export class ArticleService {
  private readonly log: LogFunctions = log.scope("ArticleService");

  private readonly repo: DocumentRepository<Article>;

  private readonly storage: HyperdriveStorage;

  constructor(
    @inject(TYPES.DriveJsonStorage) private readonly jsonStorage: HyperdriveStorage,
    @inject(TYPES.DriveTextStorage) private readonly textStorage: HyperdriveStorage,
    @inject(TYPES.RepoFactory) private readonly repoFactory: DocumentRepositoryFactory<Article>
  ) {
    this.repo = this.repoFactory(this.jsonStorage, CollectionName.Article, Article);
    this.storage = this.textStorage.sub(CollectionName.Article)
  }

  async create(props: CreateArticleRequest): Promise<Article> {
    const article = new Article(props);
    await this.repo.create(article);
    return article;
  }

  async update({ _db, _id, ...props }: UpdateArticleRequest): Promise<Article> {
    const article = await this.repo.getOrFail(_db, _id);
    Object.assign(article, props);
    await this.repo.put(article);
    return article;
  }

  async putText(_db: string, id: string, text: string): Promise<void> {
    const article = await this.repo.getOrFail(_db, id);
    await this.storage.put(_db, article.fileBase, text);
  }

  async get(_db: string, id: string, load?: boolean): Promise<Article> {
    return load ? this.repo.load(_db, id) : this.repo.get(_db, id);
  }

  async loadWithText(_db: string, id: string): Promise<{ article: Article, text: string }> {
    const article = await this.repo.load(_db, id);
    let text = "";
    if (article._found) {
      text = await this.storage.get(_db, article.fileBase);
    }
    return { article, text };
  }

  async getText(_db: string, id: string): Promise<string> {
    const article = await this.get(_db, id);
    return article ? this.storage.get(_db, article.fileBase) : "";
  }

  async find(_db: string): Promise<Article[]> {
    const load = true;
    const articles = await this.repo.find(_db, load);
    return articles.reverse();
  }

  async delete(_db: string, id: string) {
    const article = await this.repo.getOrFail(_db, id);

    await Promise.all([
      this.repo.delete(_db, id),
      this.storage.delete(_db, article.fileBase),
    ]);
  }
}
