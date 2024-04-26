import streamToArray from "stream-to-array";
import { readFile } from "node:fs/promises";
import { KeyEncoding } from "./enums";
import { DbStorage } from "./db.storage";
import Hyperbee from "hyperbee";
import { join as joinPath } from "node:path";

export class HyperbeeStorage extends DbStorage {
  async db(bee: any): Promise<any> {
    if (bee instanceof Hyperbee) {
      return bee;
    }

    bee = await this.dbService.db(bee);

    return bee.sub(this.root, {
      keyEncoding: KeyEncoding.Utf8,
      valueEncoding: this.valueEncoding,
      sep: Buffer.from("/"),
    });
  }

  normalizeRoot(root: string): string {
    return root;
  }

  normalizeKey(base: string): string {
    return base;
  }

  async put(bee: any, id: string, value: any) {
    bee = await this.db(bee);
    return bee.put(id, value);
  }

  async putFile(bee: any, key: string, file: string) {
    bee = await this.db(bee);

    const content: Buffer = await readFile(file);

    setImmediate(() =>
      bee.put(key, content).catch((err: Error) => console.log(err))
    );
  }

  async get(bee: any, id: string) {
    bee = await this.db(bee);
    const result = await bee.get(id);
    return result && result.value;
  }

  async find(bee: any, load = false) {
    bee = await this.db(bee);

    if (load) {
      this.dbService.load(bee).catch((err: Error) => console.log(err));
    }

    return streamToArray(bee.createReadStream());
  }

  sub(key: string): HyperbeeStorage {
    return new HyperbeeStorage(
      this.dbService,
      joinPath(this.root, key),
      this.valueEncoding,
    );
  }
}
