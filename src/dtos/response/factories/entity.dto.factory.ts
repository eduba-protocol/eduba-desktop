import { EntityDto } from "../interfaces";
import { Entity, EntityClass } from "@/main/models/entity.model";

export class EntityDtoFactory {
    static toDto<T extends Entity>(model: T): EntityDto {
        return {
            _id: model._id,
            _db: model._db,
            _found: model._found,
            _writable: model._writable,
            _entityType: (model.constructor as EntityClass).entityType,
        }
    }
}