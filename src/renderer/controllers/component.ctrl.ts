import { MainEventUnsubscriber } from "@/api/ipc/types";
import { injectable } from "inversify";

export interface ComponentController<T> {
    initialize?(props: T): void;

    destroy(): void;
}

@injectable()
export abstract class ComponentController<T> {
    public props: T;

    protected listeners?: MainEventUnsubscriber[];

    async setProps(props: T) {
        this.props = props;
    }

    public destroy() {
        if (this.listeners?.length) {
            this.listeners.forEach(fn => fn());
        }
    }
}