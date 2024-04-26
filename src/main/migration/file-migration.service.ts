import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { AppConfig } from "../config";
import { App } from "electron";
import { join } from "path";
import { readFile, rename, writeFile } from "fs/promises";
import { Emitter } from "@/lib/emitter";
import log from "electron-log";

@injectable()
export class FileMigrationService {
    private log = log.scope("FileMigrationService");

    constructor(
        @inject(TYPES.AppConfig) private readonly config: AppConfig,
        @inject(TYPES.ElectronApp) private readonly app: App,
        @inject(TYPES.Events) private readonly events: Emitter
    ){}

    async run(): Promise<void> {
        try {
            await this.run_0_2_0();
        } catch (err) {
            this.log.error(err.message);
        }
    }

    private async run_0_2_0(): Promise<void> {
        try {
            // electron-store replaces a custom storage solution
            const userData = this.app.getPath("userData");
            const newPath = join(userData, "config.json");

            await rename(
                join(this.app.getPath("userData"), "state.json"),
                newPath
            )

            const serializedState = await readFile(newPath, { encoding: "utf-8"});
            const state = new Map(JSON.parse(serializedState));
            const store = { session: state.get("session") };
            const serializedStore = JSON.stringify(store);
            await writeFile(newPath, serializedStore, { encoding: "utf-8" });
        } catch (err) {
            this.ignoreNotFoundError(err);
        }

        try {
            // the corestore folder moved outside of userData folder
            await rename(
                join(this.app.getPath("userData"), "corestore"),
                join(this.app.getPath("appData"), "eduba-data"),
            )
        } catch(err) {
            this.ignoreNotFoundError(err);
        }
    }

    private ignoreNotFoundError(err: any): void {
        if (err.code !== "ENOENT") {
            throw err;
        }
    }
}