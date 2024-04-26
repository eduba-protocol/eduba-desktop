/**
 * Duplicate parts of the hyperdrive and hyperbee APIs
 * based on the DB service
 */

import { ValueEncoding } from "./enums";

export abstract class DbStorage {
  constructor(
    protected dbService: any,
    protected root: string,
    protected valueEncoding: ValueEncoding
  ) {
    this.root = this.normalizeRoot(root);
  }

  protected abstract normalizeRoot(root: string): string;
  protected abstract normalizeKey(key: string): string;
  public abstract db(db: any): any;
  public abstract put(db: any, key: string, value: unknown): Promise<void>;
  public abstract putFile(db: any, key: any, file: any): Promise<void>;
  public abstract get(db: any, key: string): Promise<any>;
  public abstract find(db: any, load: boolean): Promise<any[]>
  public abstract sub(key: string): unknown;

  async load(db: any, key: string): Promise<any> {
    db = await this.db(db);
    await this.dbService.waitForKeyToExist(db, this.normalizeKey(key));
    return this.get(db, key);
  }

  async delete(db: any, key: string): Promise<void> {
    db = await this.db(db);
    await db.del(this.normalizeKey(key));
  }

  async deleteMany(db: any, keys: string[]): Promise<void> {
    const batch = (await this.db(db)).batch();
    await Promise.all(keys.map((key) => batch.del(this.normalizeKey(key))));
    await batch.flush();
  }
}
