// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { IpcApiPreload } from "@/api/ipc/ipc-api.preload";
import { contextBridge, ipcRenderer } from "electron";

async function main() {
    const loader = new IpcApiPreload(contextBridge, ipcRenderer);
    loader.expose();
}

main().catch(err => console.error(err));