import { ArticleContentExtension } from "@/enums";

export interface CreatePublisherRequest {
    // Title of publisher's profile Article
    title?: string;
    // Content-type of publisher's profile Article
    ext: ArticleContentExtension;
}

export interface UpdateUserPublisherRequest {
    _id: string;
    pinned: boolean;
}
