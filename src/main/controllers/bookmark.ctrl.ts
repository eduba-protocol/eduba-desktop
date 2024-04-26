import { string } from "superstruct";
import { inject, injectable } from "inversify";
import { TYPES } from "@/main/di/types";
import { schema, validate } from "./common/decorators";
import { CreateBookmarkRequest, UpdateBookmarkRequest } from "@/dtos/request/interfaces";
import { BookmarkService } from "@/main/services/bookmark.service";
import { BookmarkApi } from "@/api/interfaces/bookmark.api";
import { CreateBookmarkRequestSchema, UpdateBookmarkRequestSchema } from "@/dtos/request/schemas";
import { BookmarkDtoFactory } from "@/dtos/response/factories";
import { BaseController } from "./base.ctrl";

@injectable()
export class BookmarkController extends BaseController implements BookmarkApi {
  constructor(
    @inject(TYPES.BookmarkService) private readonly bookmarkService: BookmarkService,
  ) {
    super();
  }

  async find() {
    this.sessionGuard();
    const bookmarks = await this.bookmarkService.find();
    return bookmarks.map(BookmarkDtoFactory.toDto);
  }

  @validate
  async create(
    @schema(CreateBookmarkRequestSchema) req: CreateBookmarkRequest
  ) {
    this.sessionGuard();
    const bookmark = await this.bookmarkService.create(req);
    return BookmarkDtoFactory.toDto(bookmark);
  }

  @validate
  async update(
    @schema(UpdateBookmarkRequestSchema) req: UpdateBookmarkRequest
  ) {
    this.sessionGuard();
    const bookmark = await this.bookmarkService.update(req);
    return BookmarkDtoFactory.toDto(bookmark);
  }

  @validate
  async delete(
    @schema(string()) bookmarkId: string
  ) {
    this.sessionGuard();
    await this.bookmarkService.delete(bookmarkId);
  }
}

