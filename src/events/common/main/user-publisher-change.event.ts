import { DbChangeType } from "@/lib/holepunch";

export class UserPublisherChangeEvent {
    static eventName = "UserPublisherChangeEvent";

    constructor(
        public readonly type: DbChangeType,
        public readonly db: string,
        public readonly id: string
    ){}
}
