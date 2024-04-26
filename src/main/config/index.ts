import { BOOTSTRAP_NODES } from "hyperdht/lib/constants";
import { app as electronApp } from "electron";
import { join } from "path";
import { LogLevel } from "electron-log";

/* eslint @typescript-eslint/no-var-requires: "off" */
const pjson = require("package-json");

interface HolepunchConfig {
  dhtBootstrapNodes: string[];
  corestoreDirectory: string;
}

interface LogConfig {
  level: LogLevel
}

export class AppConfig {
  public version: string;
  public holepunch: HolepunchConfig;
  public log: LogConfig;

  constructor() {
    if (process.env.APP_DATA_DIRECTORY) {
      electronApp.setPath("appData", process.env.APP_DATA_DIRECTORY)
    }

    const defaultCorestoreDirectory = join(
      electronApp.getPath("appData"),
      "eduba-data"
    );

    this.version = pjson.version;

    this.holepunch = {
      dhtBootstrapNodes: this.dhtBootstrapNodes(),
      corestoreDirectory:
        process.env.CORESTORE_DIRECTORY || defaultCorestoreDirectory,
    };

    this.log = {
      level: (process.env.LOG_LEVEL || "info") as LogLevel
    };
  }

  private dhtBootstrapNodes(): string[] {
    const { DHT_BOOTSTRAP_NODES } = process.env;
  
    if (!DHT_BOOTSTRAP_NODES) {
      return BOOTSTRAP_NODES;
    }
  
    const nodes = DHT_BOOTSTRAP_NODES.split(",").map((x) => x.trim());
  
    if (!Array.isArray(nodes)) {
      throw new Error("DHT_BOOTSTRAP_NODES must be a JSON array of strings");
    }
  
    return nodes;
  }
}
