import { ArticleContentExtension } from "../enums";
import { Entity_v0_2 } from "./Entity.model";

export interface Article_v0_2 extends Entity_v0_2 {
  ext: ArticleContentExtension;
  tags?: string[];
  title?: string;
}
