import { Subscription_v0_1 } from "../../0.1/models/subscription.model";
import { VERSION } from "../constants";
import { Migration } from "@/main/migration/types";
import { Entity_v0_2 } from "../models/Entity.model";

export class SubscriptionMigration implements Migration {
    public async run({ createdAt }: Subscription_v0_1): Promise<Entity_v0_2> {
        const subscription: Entity_v0_2 = {
            meta: {
                createdAt,
                version: VERSION
            }
        };
        return subscription;
    }
}