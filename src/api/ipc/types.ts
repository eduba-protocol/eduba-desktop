import * as MainEvents from "../../events/common/main";
import * as RendererEvents from "../../events/common/renderer";
import * as Api from "../interfaces";

export type MainEventCallback = (...args: unknown[]) => void;

export type MainEventUnsubscriber = () => void;

export type RendererEventPublisher = (...args: unknown[]) => void;

export type MainEventSubscriber = (callback: MainEventCallback) => MainEventUnsubscriber;

export type MainEventName = keyof typeof MainEvents;

export type EventSubscribers = Record<MainEventName, MainEventSubscriber>;

export type RendererEventName = keyof typeof RendererEvents;

export type EventPublishers = Record<RendererEventName, RendererEventPublisher>

export interface IpcEvents {
    on: EventSubscribers,
    dispatch: EventPublishers
}

export interface IpcApi {
    article: Api.ArticleApi,
    audio: Api.AudioApi,
    auth: Api.AuthApi,
    backup: Api.BackupApi,
    bookmark: Api.BookmarkApi,
    image: Api.ImageApi,
    publisher: Api.PublisherApi,
    upload: Api.UploadApi,
    video: Api.VideoApi
}