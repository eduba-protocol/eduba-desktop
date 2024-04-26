import { Entity_v0_2 } from "./Entity.model";

export interface UserPublisher_v0_2 extends Entity_v0_2 {
    coreName: string;
    pinned: boolean;
}