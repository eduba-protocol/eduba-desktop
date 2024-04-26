import { Signal, computed, signal } from "@preact/signals";

export interface SignalStateOptions {
  storage: Storage;
  key: string;
}

export interface SignalStateApi {
  _configure(opts: SignalStateOptions): Promise<void>;
  _configured: boolean;
  _set(state: Record<string, unknown>): void;
  _reset(): void;
}

export type SignalState<T> = Signal<T> & SignalStateApi & {
  [K in keyof T]: Signal<T[K]>
}

export class SignalStateHandler<T> {
  private computedProps: Map<string, Signal> = new Map();

  private opts?: SignalStateOptions;

  private configured = false;

  constructor(
    private readonly mainSignal: Signal,
    private readonly initialState: T
  ) {
    this.buildComputedProps();
  }

  public get(target: Signal, prop: string) {
    switch(prop) {
      case "_configure":
        return this.configure;
      case "_configured":
        return this.configured;
      case "_set":
        return this.setState;
      case "_reset":
        return this.resetState;
    }

    if (prop in target) {
      return target[prop as keyof typeof target];
    }

    if (this.computedProps.has(prop)) {
      return this.computedProps.get(prop);
    }
  }

  private buildComputedProps(): void {
    for (const prop in this.initialState) {
      this.computedProps.set(prop, computed(() => this.mainSignal.value[prop]));
    }
  }

  private configure = async (opts: SignalStateOptions): Promise<void> => {
    if (this.configured) return;

    this.opts = opts;

    if (opts?.storage && opts?.key) {
      try {
        const persisted = await opts.storage.getItem(opts.key);

        if (persisted) {
          try {
            const values = JSON.parse(persisted);
            const state: Partial<T> = {};

            for (const key in this.initialState) {
              state[key] = values[key];
            }

            this.setState(state);
          } catch(err) {
            console.warn(`SignalState: Failed to parse persisted state at "${opts.key}"`)
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    this.configured = true;
  }

  private setState = (obj: Partial<T>): void => {
    const state = Object.assign({}, this.mainSignal.peek(), obj);

    this.mainSignal.value = state;

    if (this.opts?.storage && this.opts?.key) {
      this.opts.storage.setItem(this.opts.key, JSON.stringify(state));
    }
  }

  private resetState = (): void => {
    this.mainSignal.value = this.initialState;
  }
}

export function signalState<T>(initialState: T): SignalState<T> {
    const mainSignal = signal<T>(initialState);

    const handler = new SignalStateHandler(mainSignal, initialState);

    const proxy = new Proxy<Signal<T>>(mainSignal, handler);

    return proxy as SignalState<T>;
}
