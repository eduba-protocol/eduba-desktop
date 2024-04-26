import { CreateBookmarkRequest, UpdateBookmarkRequest } from "@/dtos/request/interfaces";
import { BookmarkDto } from "@/dtos/response/interfaces";

export interface BookmarkApi {
  find(): Promise<BookmarkDto[]>;

  create(req: CreateBookmarkRequest): Promise<BookmarkDto>;

  update(req: UpdateBookmarkRequest): Promise<BookmarkDto>;

  delete(id: string): Promise<void>;
}

