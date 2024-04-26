import Hyperbee from "hyperbee";
import { KeyEncoding } from "./enums";
import { DbService } from "./db.service";

type Hyperbee = typeof Hyperbee;

export class HyperbeeService extends DbService {
  isDb(db: any): boolean {
    return db instanceof Hyperbee;
  }

  rawDb(core: any): Hyperbee {
    return new Hyperbee(core, { keyEncoding: KeyEncoding.Utf8 });
  }

  exists(db: any, key: string): Promise<boolean> {
    return db.get(key).then((val: unknown) => val != null);
  }

  diff(current: any, previous: any): any {
    return current.createDiffStream(previous.version, this.root);
  }
}

