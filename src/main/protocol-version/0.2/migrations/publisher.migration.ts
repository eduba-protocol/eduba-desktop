import { Publisher_v0_1 } from "../../0.1/models/publisher.model";
import { Publisher_v0_2 } from "../models/publisher.model";
import { VERSION } from "../constants";
import { Migration } from "@/main/migration/types";

export class PublisherMigration implements Migration {
    public async run({ createdAt, article }: Publisher_v0_1): Promise<Publisher_v0_2> {
        const publisher: Publisher_v0_2 = {
            article,
            meta: {
                createdAt,
                version: VERSION
            }
        };
        return publisher;
    }
}