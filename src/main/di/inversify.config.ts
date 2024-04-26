import { Clipboard, Dialog, IpcMain, Protocol, clipboard, dialog, ipcMain, protocol, app, App } from "electron";
import { Container, interfaces } from "inversify";
import ElectronStore from "electron-store";
import { Emitter } from "../../lib/emitter"
import Corestore from "corestore";
import Hyperswarm from "hyperswarm";
import { TYPES } from "./types";
import { AppConfig } from "../config";
import * as Constants from "../../constants";
import { HyperbeeService, HyperbeeStorage, HyperdriveService, HyperdriveStorage, ValueEncoding } from "../../lib/holepunch/index";
import * as Svc from "../services/index";
import { DocumentRepository } from "../services/common/document.repository";
import { MigrationService } from "../migration/migration.service";
import { CollectionName } from "@/enums";

export const diContainer = new Container({ autoBindInjectable: true });

type Corestore = typeof Corestore;
type Hyperswarm = typeof Hyperswarm;

// Electron
diContainer.bind<App>(TYPES.ElectronApp).toConstantValue(app);
diContainer.bind<Dialog>(TYPES.ElectronDialog).toConstantValue(dialog);
diContainer.bind<Protocol>(TYPES.ElectronProtocol).toConstantValue(protocol);
diContainer.bind<IpcMain>(TYPES.ElectronIpcMain).toConstantValue(ipcMain);
diContainer.bind<Clipboard>(TYPES.ElectronClipboard).toConstantValue(clipboard);

// App
diContainer.bind<AppConfig>(TYPES.AppConfig).toConstantValue(new AppConfig());
diContainer.bind<Emitter>(TYPES.Events).toConstantValue(new Emitter());

// Svc
diContainer.bind<Svc.ArticleService>(TYPES.ArticleService).to(Svc.ArticleService);
diContainer.bind<Svc.AudioService>(TYPES.AudioService).to(Svc.AudioService);
diContainer.bind<Svc.BackupService>(TYPES.BackupService).to(Svc.BackupService);
diContainer.bind<Svc.BookmarkService>(TYPES.BookmarkService).to(Svc.BookmarkService);
diContainer.bind<Svc.ImageService>(TYPES.ImageService).to(Svc.ImageService);
diContainer.bind<Svc.PublisherService>(TYPES.PublisherService).to(Svc.PublisherService);
diContainer.bind<Svc.SubscriptionService>(TYPES.SubscriptionService).to(Svc.SubscriptionService);
diContainer.bind<Svc.UploadService>(TYPES.UploadService).to(Svc.UploadService);
diContainer.bind<Svc.UserService>(TYPES.UserService).to(Svc.UserService).inSingletonScope();
diContainer.bind<Svc.UserPublisherService>(TYPES.UserPublisherService).to(Svc.UserPublisherService);
diContainer.bind<Svc.VideoService>(TYPES.VideoService).to(Svc.VideoService);


// These providers are bound after file migrations have run
export function bindFileDependentProviders(container: Container): void {
    // Store
    container.bind<ElectronStore>(TYPES.ElectronStore).toConstantValue(new ElectronStore());

    // Holepunch
    container
        .bind<Corestore>(TYPES.Corestore)
        .toDynamicValue((context) => {
            const { holepunch } = context.container.get<AppConfig>(TYPES.AppConfig);
            return new Corestore(holepunch.corestoreDirectory).namespace(Constants.App);
        })
        .inSingletonScope()

    container
        .bind<Hyperswarm>(TYPES.Hyperswarm)
        .toDynamicValue((context) => {
            const { holepunch } = context.container.get<AppConfig>(TYPES.AppConfig);
            const corestore = context.container.get<Corestore>(TYPES.Corestore);

            const swarm = new Hyperswarm({ bootstrap: holepunch.dhtBootstrapNodes });

            swarm.on("connection", (conn: any) => {
                corestore.replicate(conn);
            });

            return swarm;
        })
        .inSingletonScope();

    container
        .bind<HyperdriveService>(TYPES.HyperdriveService)
        .toDynamicValue((context) => {
            const store = context.container.get<Corestore>(TYPES.Corestore);
            const swarm = context.container.get<Hyperswarm>(TYPES.Hyperswarm);
            return new HyperdriveService(store, swarm, Constants.App);
        })
        .inSingletonScope()

    container
        .bind<HyperbeeService>(TYPES.HyperbeeService)
        .toDynamicValue((context) => {
            const store = context.container.get<Corestore>(TYPES.Corestore);
            const swarm = context.container.get<Hyperswarm>(TYPES.Hyperswarm);
            return new HyperbeeService(store, swarm, Constants.App);
        })
        .inSingletonScope()

    container
        .bind<HyperdriveStorage>(TYPES.DriveJsonStorage)
        .toDynamicValue((context) => {
            const root = `/${Constants.App}/${Constants.DB}`;
            const driveService = context.container.get<HyperdriveService>(TYPES.HyperdriveService);
            return new HyperdriveStorage(driveService, root, ValueEncoding.Json);
        })

    container
        .bind<HyperbeeStorage>(TYPES.BeeJsonStorage)
        .toDynamicValue((context) => {
            const root = `/${Constants.App}/${Constants.DB}`;
            const beeService = context.container.get<HyperbeeService>(TYPES.HyperbeeService);
            return new HyperbeeStorage(beeService, root, ValueEncoding.Json);
        })

    container
        .bind<HyperdriveStorage>(TYPES.DriveFileStorage)
        .toDynamicValue((context) => {
            const root = `/${Constants.App}/${Constants.Files}`;
            const driveService = context.container.get<HyperdriveService>(TYPES.HyperdriveService);
            return new HyperdriveStorage(driveService, root, ValueEncoding.Binary);
        })

    container
        .bind<HyperdriveStorage>(TYPES.DriveTextStorage)
        .toDynamicValue((context) => {
            const root = `/${Constants.App}/${Constants.Text}`;
            const driveService = context.container.get<HyperdriveService>(TYPES.HyperdriveService);
            return new HyperdriveStorage(driveService, root, ValueEncoding.Utf8);
        })

    container.bind(TYPES.RepoFactory)
        .toDynamicValue((context: interfaces.Context) => {
            return (
                storage: HyperdriveStorage | HyperbeeStorage,
                collectionName: CollectionName,
                entityClass: any
            ) => new DocumentRepository(
                storage,
                collectionName,
                entityClass,
                context.container.get<MigrationService>(MigrationService),
                context.container.get<AppConfig>(TYPES.AppConfig)
            );
        })
        .inRequestScope();
}







