import { IpcMain, WebContents } from "electron";
import { TYPES } from "@/main/di/types";
import { Emitter } from "@/lib/emitter";
import * as Ctrl from "@/main/controllers/index";
import * as RendererEvents from "@//events/common/renderer/index";
import * as MainEvents from "@/events/common/main/index";
import { Container } from "inversify";

export class IpcApiMain {
  private ipcMain: IpcMain;
  
  private events: Emitter;

  constructor(private diContainer: Container) {
    this.ipcMain = this.diContainer.get<IpcMain>(TYPES.ElectronIpcMain);
    this.events = this.diContainer.get<Emitter>(TYPES.Events);
  }

  listen(webContents: WebContents): void {
    for (const eventClass of Object.values(RendererEvents)) {
      this.ipcMain.on(eventClass.eventName, (_, event) => {
        this.events.dispatch(new eventClass(event));
      });
    }

    for (const eventClass of Object.values(MainEvents)) {
      this.events.on(
        eventClass.eventName, (event: typeof eventClass) => webContents.send(eventClass.eventName, event)
      );
    }

    this.listenToApi("article", Ctrl.ArticleController);
    this.listenToApi("audio", Ctrl.AudioController);
    this.listenToApi("auth", Ctrl.AuthController);
    this.listenToApi("backup", Ctrl.BackupController);
    this.listenToApi("bookmark", Ctrl.BookmarkController);
    this.listenToApi("image", Ctrl.ImageController);
    this.listenToApi("publisher", Ctrl.PublisherController);
    this.listenToApi("upload", Ctrl.UploadController);
    this.listenToApi("video", Ctrl.VideoController);
  }

  private listenToApi(apiName: string, controllerClass: any): void {
      const methodNames = Object
          .getOwnPropertyNames(controllerClass.prototype)
          .filter(
              (name) => typeof controllerClass.prototype[name] === "function" && name !== "constructor"
          );

      for (const methodName of methodNames) {
        this.ipcMain.handle(`${apiName}.${methodName}`, async (_, ...args) => {
          const controller = this.diContainer.get<typeof controllerClass>(controllerClass);
            return controller[methodName](...args);
        });
      }
  }
}
