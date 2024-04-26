import { DbChangeType } from "@/lib/holepunch";

export class BookmarkChangeEvent {
    static eventName = "BookmarkChangeEvent";

    constructor(
        public readonly type: DbChangeType,
        public readonly db: string,
        public readonly id: string
    ){}
}
