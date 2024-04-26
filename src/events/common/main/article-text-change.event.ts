import { DbChangeType } from "@/lib/holepunch";

export class ArticleTextChangeEvent {
    static eventName = "ArticleTextChangeEvent";

    constructor(
        public readonly type: DbChangeType,
        public readonly db: string,
        public readonly id: string
    ){}
}
