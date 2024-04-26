import { Entity_v0_2 } from "../protocol-version/0.2/models/Entity.model";
import { Entity } from "./entity.model";

export class Subscription extends Entity implements Entity_v0_2 {
  static entityType = "Subscription";

  static schema = Entity.schema

  constructor(init?: Partial<Subscription>) {
    super(init);
  }
}
