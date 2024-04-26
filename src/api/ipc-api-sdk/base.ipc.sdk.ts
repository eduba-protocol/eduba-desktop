import { IpcRenderer } from "electron";

export class IpcSdkBase {
    constructor(private ipcRenderer: IpcRenderer) {}

    protected invoke(channel: string, ...args: any[]): Promise<any> {
        return this.ipcRenderer.invoke(channel, ...args);
    }
}