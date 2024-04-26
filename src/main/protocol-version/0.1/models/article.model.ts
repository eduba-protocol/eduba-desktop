import { ArticleContentExtension } from "../enums";

export interface Article_v0_1 {
  createdAt: string;
  ext: ArticleContentExtension;
  tags: string[];
  title?: string;
}
