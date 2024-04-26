import Hyperdrive from "hyperdrive";
import { DbService } from "./db.service";

type Hyperdrive = typeof Hyperdrive;

export class HyperdriveService extends DbService {
  isDb(db: any): boolean {
    return db instanceof Hyperdrive;
  }

  rawDb(core: any, store: any): Hyperdrive {
    return new Hyperdrive(store, core.key);
  }

  exists(db: any, key: string) {
    return db.exists(key);
  }

  diff(current: any, previous: any): any {
    return current.diff(previous.version, this.root);
  }
}
