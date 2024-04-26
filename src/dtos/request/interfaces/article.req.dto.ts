import { ArticleContentExtension } from "@/enums";

export interface CreateArticleRequest {
    // Database ID
    _db: string;
    // Article Title
    title?: string;
    // Article Content Type Extension
    ext: ArticleContentExtension,
    // Tags for searching
    tags: string[];
}

export interface UpdateArticleRequest {
    _db: string;
    _id: string;
    title?: string;
    ext?: ArticleContentExtension,
    tags?: string[];
}
