export interface Migration {
    run(a: unknown): Promise<unknown>
}

export interface MigrationClass {
    new (): Migration;
}