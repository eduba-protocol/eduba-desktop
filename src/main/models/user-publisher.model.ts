import { object, boolean, string, assign } from "superstruct";
import { UserPublisher_v0_2 } from "../protocol-version/0.2/models/user-publisher.model";
import { Entity } from "./entity.model";

export class UserPublisher extends Entity implements UserPublisher_v0_2 {
  static entityType = "UserPublisher";

  coreName: string;
  pinned: boolean;

  static schema = assign(
    object({
      coreName: string(),
      pinned: boolean()
    }),
    Entity.schema
  )

  constructor(init?: Partial<UserPublisher>) {
    super(init);
  }
}
