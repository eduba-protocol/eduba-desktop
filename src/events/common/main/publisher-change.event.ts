import { DbChangeType } from "@/lib/holepunch";

export class PublisherChangeEvent {
    static eventName = "PublisherChangeEvent";

    constructor(
        public readonly type: DbChangeType,
        public readonly db: string,
        public readonly id: string
    ){}
}
