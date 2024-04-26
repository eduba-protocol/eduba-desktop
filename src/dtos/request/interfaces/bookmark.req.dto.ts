import { BookmarkType } from "@/enums";

export interface CreateBookmarkRequest {
    // Type (folder or bookmark)
    type: BookmarkType;
    // Title
    title: string;
    // Parent in tree of bookmark folders
    parent?: string;
    // Href (publisherId/articles/articleId)
    href?: string;
}

export interface UpdateBookmarkRequest {
    _id: string;
    type?: BookmarkType;
    title?: string;
    parent?: string;
    href?: string;
}
