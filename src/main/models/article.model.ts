import { object, string, optional, array, enums, assign } from "superstruct";
import { extname } from "path";
import { ArticleContentExtension } from "@/enums";
import { Article_v0_2 } from "../protocol-version/0.2/models/article.model";
import { Entity } from "./entity.model";

export class Article extends Entity implements Article_v0_2 {
  static entityType = "Article";
  
  ext: ArticleContentExtension;
  tags?: string[];
  title?: string;

  static schema = assign(
    object({
      ext: enums(Object.values(ArticleContentExtension)),
      tags: optional(array(string())),
      title: optional(string())
    }),
    Entity.schema
  )

  constructor(init?: Partial<Article>) {
    super(init);
  }

  get fileBase() {
    return `${this._id}.${this.ext}`;
  }

  setExtension(file: string): void {
    this.ext = extname(file).slice('.'.length) as ArticleContentExtension;
  }
}
