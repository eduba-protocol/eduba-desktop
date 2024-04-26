export class RendererErrorEvent {
    static eventName = "RendererErrorEvent";

    constructor(public stack: string) {}
}
