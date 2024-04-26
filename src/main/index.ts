import "reflect-metadata";
import { app, BrowserWindow, DownloadItem, protocol, shell } from 'electron';
import log from "electron-log";
import { TYPES } from './di/types';
import { diContainer } from "./di";
import { UserService } from "./services";
import { EdubaScheme } from "./schemes";
import { EventBinder } from "./event-handlers/event-binder/event-binder";
import { IpcApiMain } from "../api/ipc/ipc-api.main";
import { URL } from "node:url";
import { FileMigrationService } from "./migration/file-migration.service";
import { bindFileDependentProviders } from "./di/inversify.config";
import icon from '../../icons/icon.png';

// on "activate" event, OSX is attempting to create window before app is ready
// This variable is set in the ready handler and checked in the activate handler
let appIsReady = false;

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Configure logger
log.initialize({ preload: true });

// Register Eduba scheme
protocol.registerSchemesAsPrivileged([
  { scheme: "eduba", privileges: { bypassCSP: true, stream: true } },
]);

// Create window
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    icon: icon
  });

  // Wire up API and event passing to/from renderer
  const ipcApi = new IpcApiMain(diContainer);
  ipcApi.listen(mainWindow.webContents);

  // Open external links in the default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  // Using http scheme for eduba scheme downloads because will-download
  // didn't fire for the eduba scheme.
  mainWindow.webContents.session.on(
    'will-download',
    async (event: Event, item: DownloadItem) => {
      event.preventDefault();

      const url = new URL(item.getURL());

      if (url.hostname === "localhost" && url.pathname.startsWith("/eduba/")) {
        const scheme = diContainer.get<EdubaScheme>(EdubaScheme);
        const schemeUrl = `eduba://${url.pathname.slice("/eduba/".length)}`
        return scheme.download(schemeUrl, item.getFilename());
      }
    }
  );

  // Take up all monitor space (not full screen)
  mainWindow.maximize();

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  try {
    const fileMigrationService = diContainer.get<FileMigrationService>(FileMigrationService);
    await fileMigrationService.run();
  
    await bindFileDependentProviders(diContainer);
  
    const eventBinder = new EventBinder(diContainer);
    eventBinder.bindHandlers();
  
    await diContainer.get<UserService>(TYPES.UserService).resumeExistingSession();
  
    createWindow();
  
    diContainer.get<EdubaScheme>(EdubaScheme).registerHandler();
  
    appIsReady = true;
  } catch (err) {
    log.error("App ready handler error", err);
    process.exit(1);
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (appIsReady && BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
