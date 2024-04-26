import { MigrationClass } from "../migration/types";
import { migrations as v0_2 }  from "./0.2/migrations";

export const migrationsByVersion: Record<string, Record<string, MigrationClass>> = {
    "0.2": v0_2
}