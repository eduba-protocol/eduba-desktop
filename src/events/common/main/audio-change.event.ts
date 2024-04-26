import { DbChangeType } from "@/lib/holepunch";

export class AudioChangeEvent {
    static eventName = "AudioChangeEvent";

    constructor(
        public readonly type: DbChangeType,
        public readonly db: string,
        public readonly id: string
    ){}
}
