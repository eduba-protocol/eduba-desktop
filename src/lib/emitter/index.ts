import { EventEmitter, captureRejectionSymbol } from "events";

export interface EventClass {
  new (...args: unknown[]): unknown;
  eventName: string;
}

export class Event {
  constructor(init: Record<string, unknown>) {
      Object.assign(this, init);
  }
}

// Emitter
export class Emitter extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](error: Error, event: string, ...args: any[]) {
    this.emit("error", error, event, ...args);
  }

  dispatch(event: Event) {
    this.emit((event.constructor as EventClass).eventName, event);
  }
}
