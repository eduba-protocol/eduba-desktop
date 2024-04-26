/**
 * The EdubaSchema class provides the functionality for the custom "eduba"
 * schema that serves files to the renderer based on their location
 * as specified in the Eduba protocol.
 */

import { inject, injectable } from "inversify";
import { Dialog, Protocol, SaveDialogOptions } from "electron";
import { parse as parsePath } from "node:path";
import { createWriteStream } from "node:fs";
import pump from "pump";
import { TYPES } from "../di/types";
import * as Constants from "../../constants";
import log, { LogFunctions } from "electron-log";
import { HyperdriveService } from "@/lib/holepunch";

@injectable()
export class EdubaScheme {
  private readonly log: LogFunctions = log.scope("EdubaScheme");
  
  constructor(
    @inject(TYPES.ElectronDialog) private dialog: Dialog,
    @inject(TYPES.ElectronProtocol) private protocol: Protocol,
    @inject(TYPES.HyperdriveService) private driveService: HyperdriveService
  ) {}

  registerHandler(): void {
    this.protocol.handle("eduba", this.handle.bind(this));
  }

  async download(url: string, fileName?: string): Promise<void> {
    try {
      const parsed = this.parseUrl(url);

      if (!parsed) {
        throw new Error(`Invalid URL: ${url}`);
      }

      const { dbId, path, base } = parsed;
      const drive = await this.driveService.load(dbId);
      const exists = await this.driveService.waitForKeyToExist(drive, path);

      if (!exists) {
        throw new Error(`Not found: ${url}`);
      }

      const opts: SaveDialogOptions = {
        title: "Download",
        defaultPath: fileName || base,
        properties: ["createDirectory", "showOverwriteConfirmation"],
      };

      const { canceled, filePath } = await this.dialog.showSaveDialog(opts);

      if (canceled) return;

      const source = drive.createReadStream(path);
      const dest = createWriteStream(filePath);

      pump(source, dest, function (err) {
        if (err) {
          this.logger.warn("Download failed in transfer", err);
        }
      });
    } catch (err) {
      this.log.warn("Download failed", err);
    }
  }

  async handle(request: GlobalRequest) {
    try {
      const parsed = this.parseUrl(request.url);

      if (!parsed) {
        return new Response("", {
          status: 400,
          statusText: "Invalid eduba URL",
        });
      }

      const { dbId, path } = parsed;
      const drive = await this.driveService.load(dbId);
      const exists = await this.driveService.waitForKeyToExist(drive, path);

      if (!exists) {
        return new Response("", {
          status: 404,
          statusText: "Not found.",
        });
      }

      return new Response(drive.createReadStream(path));
    } catch (err) {
      this.log.error("Error in Eduba scheme handler", err);

      return new Response("", {
        status: 500,
        statusText: "Server Error",
      });
    }
  }

  private parseUrl(url: string) {
    const rgx = /^eduba:\/\/?([0-9a-z]{52})\/([/.0-9a-z_-]+)$/i;
    const parts = rgx.exec(url);

    if (!parts) return null;

    const path = `/${Constants.App}/${parts[2]}`;
    const parsed = parsePath(path);

    return {
      dbId: parts[1],
      path,
      base: parsed.base,
      name: parsed.name,
    };
  }
}
