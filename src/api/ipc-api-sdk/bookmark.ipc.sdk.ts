import { BookmarkApi } from "../interfaces/bookmark.api";
import { BookmarkDto } from "@/dtos/response/interfaces";
import { CreateBookmarkRequest, UpdateBookmarkRequest } from "@/dtos/request/interfaces";
import { IpcSdkBase } from "./base.ipc.sdk";

export class BookmarkIpcSdk extends IpcSdkBase implements BookmarkApi {
  find = (): Promise<BookmarkDto[]> => {
    return this.invoke("bookmark.find");
  }

  create = (req: CreateBookmarkRequest): Promise<BookmarkDto> => {
    return this.invoke("bookmark.create", req);
  }

  update = (req: UpdateBookmarkRequest): Promise<BookmarkDto> => {
    return this.invoke("bookmark.update", req);
  }

  delete = (id: string): Promise<void> => {
    return this.invoke("bookmark.delete", id);
  }
}