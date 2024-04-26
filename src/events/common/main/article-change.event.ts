import { DbChangeType } from "@/lib/holepunch";

export class ArticleChangeEvent {
    static eventName = "ArticleChangeEvent";
    
    constructor(
        public readonly type: DbChangeType,
        public readonly db: string,
        public readonly id: string
    ){}
}
