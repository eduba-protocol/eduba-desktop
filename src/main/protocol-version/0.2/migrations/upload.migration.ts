import { Upload_v0_1 } from "../../0.1/models/upload.model";
import { Upload_v0_2 } from "../models/upload.model";
import { VERSION } from "../constants";
import { Migration } from "@/main/migration/types";

export class UploadMigration implements Migration {
    public async run({ createdAt, ext, ...data }: Upload_v0_1): Promise<Upload_v0_2> {
        const upload: Upload_v0_2 = {
            ...data,
            ext: ext && ext.slice(1),
            meta: {
                createdAt,
                version: VERSION
            }
        };
        return upload;
    }
}