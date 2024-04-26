import { IpcApi, IpcEvents } from "@/api/ipc/types";

declare global {
    interface Window {
      ipcSdk: IpcApi;
      ipcEvents: IpcEvents
    }
}