import { createReadStream } from "node:fs";
import streamToArray from "stream-to-array";
import pump from "pump";
import { ValueEncoding } from "./enums";
import { DbStorage } from "./db.storage";
import { join as joinPath } from "node:path";

export class HyperdriveStorage extends DbStorage {
  async db(db: any): Promise<any> {
    return this.dbService.db(db);
  }

  normalizeRoot(root: string): string {
    return root.startsWith("/") ? root : `/${root}`;
  }

  normalizeKey(key: string): string {
    return this.valueEncoding === ValueEncoding.Json
      ? `${this.root}/${key}.json`
      : `${this.root}/${key}`;
  }

  async put(drive: any, key: string, value: any) {
    if (this.valueEncoding === ValueEncoding.Json) {
      value = Buffer.from(JSON.stringify(value), "utf-8");
    } else if (this.valueEncoding === ValueEncoding.Utf8) {
      value = Buffer.from(value, "utf-8");
    }
    drive = await this.db(drive);
    await drive.put(this.normalizeKey(key), value);
  }

  async putFile(drive: any, key: string, file: string): Promise<void> {
    drive = await this.db(drive);

    const source = createReadStream(file);
    const dest = drive.createWriteStream(this.normalizeKey(key));

    pump(source, dest, function (err) {
      if (err) this.emit("error", err);
    });
  }

  async get(drive: any, key: string): Promise<any> {
    drive = await this.db(drive);
    const buffer = await drive.get(this.normalizeKey(key));

    if (this.valueEncoding === ValueEncoding.Utf8) {
      return buffer ? buffer.toString("utf-8") : "";
    }

    if (buffer && this.valueEncoding === ValueEncoding.Json) {
      return JSON.parse(buffer.toString("utf-8"));
    }

    return buffer;
  }

  async find(drive: any, load = false): Promise<any[]> {
    drive = await this.db(drive);

    if (load) {
      this.dbService.load(drive).catch((err: Error) => console.log(err));
    }
    
    let keys: string[] = await streamToArray(drive.readdir(this.root));

    if (this.valueEncoding === ValueEncoding.Json) {
      keys = keys
        .filter((k) => k.endsWith(".json"))
        .map((k) => k.slice(0, -".json".length));
    }

    return Promise.all(
      keys.map(async (key) => ({
        key,
        value: await this.get(drive, key),
      }))
    );
  }

  sub(key: string): HyperdriveStorage {
    return new HyperdriveStorage(
      this.dbService,
      joinPath(this.root, key),
      this.valueEncoding,
    );
  }
}
