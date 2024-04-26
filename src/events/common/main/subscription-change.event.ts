import { DbChangeType } from "@/lib/holepunch";

export class SubscriptionChangeEvent {
    static eventName = "SubscriptionChangeEvent";

    constructor(
        public readonly type: DbChangeType,
        public readonly db: string,
        public readonly id: string
    ){}
}
