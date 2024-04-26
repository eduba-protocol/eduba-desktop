import { UserPublisher_v0_1 } from "../../0.1/models/user-publisher.model";
import { UserPublisher_v0_2 } from "../models/user-publisher.model";
import { VERSION } from "../constants";
import { Migration } from "@/main/migration/types";

export class UserPublisherMigration implements Migration {
    public async run(data: UserPublisher_v0_1): Promise<UserPublisher_v0_2> {
        const userPublisher: UserPublisher_v0_2 = {
            ...data,
            meta: {
                createdAt: new Date().toISOString(),
                version: VERSION
            }
        };
        return userPublisher;
    }
}