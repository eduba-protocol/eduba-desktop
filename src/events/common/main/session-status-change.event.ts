import { SessionStatus } from "@/enums";

export class SessionStatusChangeEvent {
    static eventName = "SessionStatusChangeEvent";

    constructor(public readonly status: SessionStatus){}
}
