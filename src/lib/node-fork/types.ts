export interface ParentMessage<T> {
    key: keyof T;
    args?: unknown[];
}

export interface ChildMessage {
    ok: boolean;
    result?: unknown;
    error?: string;
}