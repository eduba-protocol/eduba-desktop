import { inject, injectable } from "inversify";
import { CollectionName } from "../../enums";
import { HyperbeeStorage } from "../../lib/holepunch";
import { Bookmark } from "../models/bookmark.model";
import { TYPES } from "../di/types";
import { UserService } from "./user.service";
import { CreateBookmarkRequest, UpdateBookmarkRequest } from "@/dtos/request/interfaces";
import log, { LogFunctions } from "electron-log";
import { DocumentRepository, DocumentRepositoryFactory } from "./common/document.repository";

@injectable()
export class BookmarkService {
  private readonly log: LogFunctions = log.scope("BookmarkService");

  private readonly repo: DocumentRepository<Bookmark>;

  constructor(
    @inject(TYPES.BeeJsonStorage) private readonly jsonStorage: HyperbeeStorage,
    @inject(TYPES.UserService) private readonly userService: UserService,
    @inject(TYPES.RepoFactory) private readonly repoFactory: DocumentRepositoryFactory<Bookmark>
  ) {
    this.repo = this.repoFactory(this.jsonStorage, CollectionName.Bookmark, Bookmark);
  }

  async create(request: CreateBookmarkRequest): Promise<Bookmark> {
    const bookmark = new Bookmark(request);
    bookmark._db = this.userService.sessionDbId();
    await this.repo.create(bookmark);
    return bookmark;
  }

  async update({ _id, ...props }: UpdateBookmarkRequest): Promise<Bookmark> {
    const bookmark = await this.repo.getOrFail(this.userService.sessionDbId(), _id);
    Object.assign(bookmark, props);
    await this.repo.put(bookmark);
    return bookmark;
  }

  async get(id: string): Promise<Bookmark> {
    return this.repo.get(this.userService.sessionDbId(), id);
  }

  async find(load?: boolean): Promise<Bookmark[]> {
    return this.repo.find(this.userService.sessionDbId(), load);
  }

  async delete(id: string): Promise<void> {
    const bookmarks = await this.repo.find(this.userService.sessionDbId());
    const toDelete: string[] = [id];
    let lastLength = 0;

    while (toDelete.length !== lastLength) {
      lastLength = toDelete.length;
      for (const bookmark of bookmarks) {
        if (
          bookmark.parent &&
          toDelete.includes(bookmark.parent) &&
          !toDelete.includes(bookmark._id as string)
        ) {
          toDelete.push(bookmark._id as string);
        }
      }
    }

    await this.repo.deleteMany(this.userService.sessionDbId(), toDelete);
  }
}