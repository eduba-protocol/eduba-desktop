import { PublisherApi } from "../interfaces/publisher.api";
import { CreatePublisherRequest, CreateSubscriptionRequest, UpdateUserPublisherRequest } from "@/dtos/request/interfaces";
import { PopulatedPublisherDto, PublisherDto, EntityDto, UserPublisherDto } from "@/dtos/response/interfaces";
import { IpcSdkBase } from "./base.ipc.sdk";

export class PublisherIpcSdk extends IpcSdkBase implements PublisherApi {
  create = (req: CreatePublisherRequest): Promise<PublisherDto> => {
    return this.invoke("publisher.create", req);
  }

  findSubscribed = (): Promise<PopulatedPublisherDto[]> => {
    return this.invoke("publisher.findSubscribed");
  }

  findUserPublishers = (): Promise<PopulatedPublisherDto[]> => {
    return this.invoke("publisher.findUserPublishers");
  }

  updateUserPublisher = (req: UpdateUserPublisherRequest): Promise<UserPublisherDto> => {
    return this.invoke("publisher.updateUserPublisher", req);
  }

  load = (dbId: string): Promise<PopulatedPublisherDto> => {
    return this.invoke("publisher.load", dbId);
  }

  subscribe = (req: CreateSubscriptionRequest): Promise<EntityDto> => {
    return this.invoke("publisher.subscribe", req);
  }

  unsubscribe = (dbId: string): Promise<void> => {
    return this.invoke("publisher.unsubscribe", dbId);
  }
}