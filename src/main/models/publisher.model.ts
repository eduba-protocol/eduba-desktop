import { object, string, pattern, assign } from "superstruct";
import { Article } from "./article.model";
import { Publisher_v0_2 } from "../protocol-version/0.2/models/publisher.model";
import { Entity } from "./entity.model";

export class Publisher extends Entity implements Publisher_v0_2 {
  static entityType = "Publisher";

  article: string;
  _subscribed?: boolean;
  _pinned?: boolean;

  static schema = assign(
    object({
      article: pattern(string(), /[0-9]{13}/)
    }),
    Entity.schema
  )

  constructor(init?: Partial<Publisher>) {
    super(init);
  }
}

export type PopulatedPublisher = Omit<Publisher, "article"> & {
  article: Article
}