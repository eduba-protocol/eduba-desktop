import { inject, injectable } from "inversify";
import { AppConfig } from "../config";
import { TYPES } from "../di/types";
import { migrationsByVersion } from "../protocol-version";

@injectable()
export class MigrationService {
    private protocolVersions: string[] = Object.keys(migrationsByVersion).sort();

    constructor(
        @inject(TYPES.AppConfig) private readonly config: AppConfig
    ){}

    public async migrate(entityType: string, data: any): Promise<any> {
        if (!data) {
            return data;
        }
        
        const version = data.meta?.version || "0.1";

        if (this.config.version.startsWith(version)) {
            return data;
        }

        let migratedData = data;

        for (const ver of this.protocolVersions) {
            if (version >= ver) continue;

            const { [entityType]: migrationClass } = migrationsByVersion[ver];

            if (migrationClass) {
                // @TODO: Support dependency injection in migrations
                const migration = new migrationClass();
                migratedData = await migration.run(migratedData);
            }
        }

        return migratedData;
    }
}