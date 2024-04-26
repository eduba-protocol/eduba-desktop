import { DbChangeType } from "@/lib/holepunch";

export class UploadChangeEvent {
    static eventName = "UploadChangeEvent";

    constructor(
        public readonly type: DbChangeType,
        public readonly db: string,
        public readonly id: string
    ){}
}
