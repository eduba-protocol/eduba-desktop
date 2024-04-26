export interface EventHandler {
    handleEvent(event: unknown): Promise<void>;
}