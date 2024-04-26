/**
 * Maintain a least-recently-used cache of hyperdrives or hyperbees
 * Watch all DBs in the cache and emit changes to the DB
 * Joined DBs are always joined to the swarm and always watched
 * Loaded DBs are joined to the swarm until expired from the cache
 * Rotate subscriptions through the cache
 */

import QuickLru from "quick-lru";
import { Emitter } from "../emitter";
import { DbChangeType } from "./enums";
import { DbChangeEvent } from "./events/db-change.event";

export abstract class DbService extends Emitter {
  private corestore: any;

  // cache of joined drives/bees
  private joined: Map<string, any> = new Map();

  // IDs of subscribed drives/bees
  private subscribedIds: string[] = [];

  // cache of watchers of drives/bees
  private watchers: Map<string, any> = new Map();

  // Interval ID for subscription management
  private subscriptionIntervalId: NodeJS.Timeout | undefined = void 0;

  // Least-recently used cache of drives/bees
  private dbs: QuickLru<string, any>;

  constructor(
    // corestore
    private store: any,
    // hyperswarm
    private swarm: any,
    // the key prefix to watch in hyperdrive
    protected root: string
  ) {
    super();
    
    this.corestore = store;

    this.dbs = new QuickLru({
      maxSize: 25,
      onEviction: this._evictDb.bind(this),
    });
  }

  protected abstract isDb(instance: any): boolean;

  protected abstract rawDb(core: any, store?: any): any;

  protected abstract exists(db: any, key: string): Promise<boolean>;

  protected abstract diff(curent: any, previous: any): any;

  async db(opts: any): Promise<any> {
    if (this.isDb(opts)) return opts;

    if (!this.store) {
      throw new Error("Must set store before using service.");
    }

    const dbId = typeof opts === "string" ? opts : opts.key;

    if (typeof dbId === "string") {
      if (this.joined.has(dbId)) return this.joined.get(dbId);
      if (this.dbs.has(dbId)) return this.dbs.get(dbId);
    }

    const core = await this.store.get(opts);
    await core.ready();

    if (this.joined.has(core.id)) return this.joined.get(core.id);
    if (this.dbs.has(core.id)) return this.dbs.get(core.id);

    const db = this.rawDb(core, this.store);
    await db.ready();

    this.dbs.set(db.id, db);
    this._watchDb(db);

    return db;
  }

  /**
   * End a Corestore session
   * Clear the caches and set store back to rootStore
   * Used as trigger to stop the subscription interval
   */
  async endSession(): Promise<void> {
    clearInterval(this.subscriptionIntervalId);

    await Promise.all(
      Array.from(this.joined.values()).map((db) =>
        this._leaveSwarmInteral(db.discoveryKey)
      )
    );

    this.joined.clear();

    await Promise.all(
      Array.from(this.dbs.entries()).map(([id, db]) => this._evictDb(id, db))
    );

    this.dbs.clear();
    this.watchers.clear();
    this.subscribedIds = [];
    this.store = this.corestore;
  }

  async joinSwarm(db: any): Promise<void> {
    db = await this.db(db);
    this.joined.set(db.id, db);
    this._joinSwarmInteral(db.discoveryKey);
  }

  async leaveSwarm(db: any): Promise<void> {
    db = await this.db(db);
    this.joined.delete(db.id);
    await this._leaveSwarmInteral(db.discoveryKey);
    // Ensure db is in LRU cache so it can eventually be evicted and closed
    this.dbs.set(db.id, db);
  }

  async load(db: any): Promise<any> {
    db = await this.db(db);
    if (!db.writable) {
      this._joinSwarmInteral(db.discoveryKey);
    }
    return db;
  }

  startSession(store: any): void {
    this.store = store;
    this.subscriptionIntervalId = setInterval(() => {
      if (this.subscribedIds.length) {
        const dbId = this.subscribedIds.pop();
        this.load(dbId).catch((err) => this.emit("error", err));
        this.subscribedIds.unshift(dbId);
      }
    }, 1000 * 60);
  }

  /**
   * Subscribe to db
   * Add db ID to list of drives that are joined to swarm periodically
   * @param {string} dbId
   */
  subscribe(dbId: string): void {
    if (!this.subscribedIds.includes(dbId)) {
      this.subscribedIds.push(dbId);
    }
  }

  /**
   * Unsubscribe from db
   * @param {string} dbId
   */
  unsubscribe(dbId: string): void {
    this.subscribedIds = this.subscribedIds.filter((id) => id === dbId);
  }

  async waitForKeyToExist(db: any, key: string, maxWait = 500) {
    db = await this.db(db);

    if (await this.exists(db, key)) {
      this.load(db);
      return true;
    }

    return new Promise((resolve, reject) => {
      const respond = () => {
        this.off(DbChangeEvent.eventName, eventHandler);
        this.exists(db, key).then(resolve, reject);
      };

      const eventHandler = (evt: any) => {
        if (evt.dbId === db.id && evt.key === key) {
          clearTimeout(timer);
          respond();
        }
      };

      const timer = setTimeout(respond, maxWait);
      this.on(DbChangeEvent.eventName, eventHandler);
      this.load(db);
    });
  }

  async _joinSwarmInteral(discoveryKey: string) {
    const peerDiscovery = await this.swarm.status(discoveryKey);
    if (!peerDiscovery) {
      await this.swarm.join(discoveryKey);
    }
  }

  async _leaveSwarmInteral(discoveryKey: string) {
    const peerDiscovery = await this.swarm.status(discoveryKey);
    if (peerDiscovery) {
      await peerDiscovery.destroy();
    }
  }

  async _evictDb(id: string, db: any) {
    try {
      // If joined, keep db in cache
      if (this.joined.has(id)) return;

      const watcher = this.watchers.get(db.id);
      if (watcher) {
        await watcher.destroy();
        this.watchers.delete(db.id);
      }

      this._leaveSwarmInteral(db.discoveryKey);

      await db.close();
    } catch (err) {
      this.emit("error", new Error(`Error on evicting DB: ${err.message}`));
    }
  }

  async _watchDb(db: any) {
    if (this.watchers.has(db.id)) return;

    try {
      const watcher = db.watch(this.root);
      this.watchers.set(db.id, watcher);

      for await (const [current, previous] of watcher) {
        const diff = this.diff(current, previous);
        diff.on("data", ({ left, right }: any) => {
          let type;
          if (left) {
            type = right ? DbChangeType.Update : DbChangeType.Create;
          } else {
            type = DbChangeType.Delete;
          }

          this.dispatch(new DbChangeEvent({
            type,
            db: db.id,
            key: (left || right).key,
            version: current.version,
            previousVersion: previous.version,
          }));
        });

        diff.on("error", (err: Error) => {
          this.emit("error", err);
        });
      }
    } catch (err) {
      this.emit("error", err);
    }
  }
}
