import { DbChangeType } from "@/lib/holepunch";

export class VideoChangeEvent {
    static eventName = "VideoChangeEvent";

    constructor(
        public readonly type: DbChangeType,
        public readonly db: string,
        public readonly id: string
    ){}
}
