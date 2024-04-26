import { ContextBridge, IpcRenderer } from "electron";
import * as MainEvents from "../../events/common/main";
import * as RendererEvents from "../../events/common/renderer";
import { IpcApi, EventPublishers, EventSubscribers, IpcEvents, MainEventCallback, MainEventName, RendererEventName } from "./types";
import { ArticleIpcSdk } from "../ipc-api-sdk/article.ipc.sdk";
import { AudioIpcSdk } from "../ipc-api-sdk/audio.ipc.sdk";
import { AuthIpcSdk } from "../ipc-api-sdk/auth.ipc.sdk";
import { BackupIpcSdk } from "../ipc-api-sdk/backup.ipc.sdk";
import { BookmarkIpcSdk } from "../ipc-api-sdk/bookmark.ipc.sdk";
import { ImageIpcSdk } from "../ipc-api-sdk/image.ipc.sdk";
import { PublisherIpcSdk } from "../ipc-api-sdk/publisher.ipc.sdk";
import { UploadIpcSdk } from "../ipc-api-sdk/upload.ipc.sdk";
import { VideoIpcSdk } from "../ipc-api-sdk/video.ipc.sdk";

export class IpcApiPreload {
    constructor(
        private contextBridge: ContextBridge,
        private ipcRenderer: IpcRenderer
    ) {}

    async expose() {
      try {
        const ipcEvents: IpcEvents = {
          on: this.buildMainEventSubscribers(),
          dispatch: this.buildRendererEventPublishers()
        };

        const ipcSdk: IpcApi = {
          article: new ArticleIpcSdk(this.ipcRenderer),
          audio: new AudioIpcSdk(this.ipcRenderer),
          auth: new AuthIpcSdk(this.ipcRenderer),
          backup: new BackupIpcSdk(this.ipcRenderer),
          bookmark: new BookmarkIpcSdk(this.ipcRenderer),
          image: new ImageIpcSdk(this.ipcRenderer),
          publisher: new PublisherIpcSdk(this.ipcRenderer),
          upload: new UploadIpcSdk(this.ipcRenderer),
          video: new VideoIpcSdk(this.ipcRenderer)
      }

        this.contextBridge.exposeInMainWorld("ipcSdk", ipcSdk);
        this.contextBridge.exposeInMainWorld("ipcEvents", ipcEvents);
      } catch (err) {
        console.error("Failed to load and build the public API");
      }
  }

  private buildMainEventSubscribers(): EventSubscribers {
    const result: Partial<EventSubscribers> = {};

    for (const eventClass of Object.values(MainEvents)) {
      result[eventClass.eventName as MainEventName] = (callback: MainEventCallback) => {
        const listener = (_: never, ...args: unknown[]) => {
          callback(...args);
        };

        this.ipcRenderer.on(eventClass.eventName, listener);

        return () => {
            this.ipcRenderer.removeListener(eventClass.eventName, listener);
        }
      };
    }

    return result as EventSubscribers;
  }

  private buildRendererEventPublishers(): EventPublishers {
      const result: Partial<EventPublishers> = {};

      for (const eventClass of Object.values(RendererEvents)) {
          result[eventClass.eventName as RendererEventName] = (...args) => {
            this.ipcRenderer.send(eventClass.eventName, ...args);
          }
      }

      return result as EventPublishers;
  }
}