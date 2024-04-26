/**
 * JSON Document Repository API based on DB Storage
 */
import { assert } from "superstruct";
import { Entity, EntityClass } from "../../models/entity.model";
import { MigrationService } from "@/main/migration/migration.service";
import { AppConfig } from "@/main/config";
import { HyperbeeStorage, HyperdriveStorage } from "@/lib/holepunch";
import { CollectionName } from "@/enums";

export interface DocumentRepositoryFactory<T extends Entity> {
  (
    storage: HyperdriveStorage | HyperbeeStorage,
    collectioName: CollectionName,
    entityClass: any): DocumentRepository<T>
}

export class DocumentRepository<T extends Entity> {
  private storage: HyperdriveStorage | HyperbeeStorage;

  constructor(
    rawStorage: HyperdriveStorage | HyperbeeStorage,
    private collectioName: CollectionName,
    private entityClass: EntityClass<T>,
    private migrationService: MigrationService,
    private config: AppConfig
  ) {
    this.storage = rawStorage.sub(this.collectioName);
  }

  public async create(entity: T): Promise<T> {
    if (!entity._id) {
        entity._id = `${Date.now()}`;
    }

    entity.meta = {
      createdAt: new Date().toISOString(),
      version: this.config.version
    };

    await this.put(entity);
    return entity;
  }

  async put(entity: T): Promise<T> {
    if (!entity._db || !entity._id) {
      throw new Error("Both _db and _id required to put document");
    }

    let props: Record<string, unknown> = {};

    for (const prop in entity) {
      if (!prop.startsWith("_")) {
        props[prop] = entity[prop];
      }
    }

    props = await this.migrationService.migrate(this.entityClass.entityType, props);

    if (this.entityClass.schema) {
      assert(props, this.entityClass.schema);
    }

    await this.storage.put(entity._db, entity._id, props);

    return entity;
  }

  async get(_db: string, _id: string): Promise<T> {
    const db = await this.storage.db(_db);
    let props = await this.storage.get(db, _id);
    props = await this.migrationService.migrate(this.entityClass.entityType, props);
    return this.toEntity(db, _id, props);
  }

  async getOrFail(_db: string, _id: string): Promise<T> {
    const entity = await this.get(_db, _id);
    if (!entity._found) {
      throw new Error("Not Found");
    }
    return entity
  }

  async load(_db: string, _id: string): Promise<T> {
    const db = await this.storage.db(_db);
    let props = await this.storage.load(db, _id);
    props = await this.migrationService.migrate(this.entityClass.entityType, props);
    return this.toEntity(db, _id, props);
  }

  async find(_db: string, load = false): Promise<Array<T>> {
    const db = await this.storage.db(_db);
    const results = await this.storage.find(db, load);
    return results.map((r: any) => this.toEntity(db, r.key, r.value));
  }

  async delete(_db: string, _id: string): Promise<void> {
    await this.storage.delete(_db, _id);
  }

  async deleteMany(_db: string, ids: string[]): Promise<void> {
    await this.storage.deleteMany(_db, ids);
  }

  private toEntity(db: any, _id: string, props?: T | null) {
    const entity = new this.entityClass(props);
    entity._id = _id;
    entity._db = db.id;
    entity._writable = db.writable;
    entity._found = !!props;
    return entity;
  }
}
