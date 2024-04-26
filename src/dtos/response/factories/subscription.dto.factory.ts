import { Subscription } from "@/main/models/subscription.model";
import { EntityDto } from "../interfaces";
import { EntityDtoFactory } from "./entity.dto.factory";

export class SubscriptionDtoFactory {
    static toDto(model: Subscription): EntityDto {
        return EntityDtoFactory.toDto(model);
    }
}

