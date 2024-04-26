import { CreatePublisherRequest, CreateSubscriptionRequest, UpdateUserPublisherRequest } from "@/dtos/request/interfaces";
import { PopulatedPublisherDto, PublisherDto, EntityDto, UserPublisherDto } from "@/dtos/response/interfaces";

export interface PublisherApi {
  create(req: CreatePublisherRequest): Promise<PublisherDto>;

  findSubscribed(): Promise<PopulatedPublisherDto[]>;

  findUserPublishers(): Promise<PopulatedPublisherDto[]>;

  updateUserPublisher(req: UpdateUserPublisherRequest): Promise<UserPublisherDto>;

  load(dbId: string): Promise<PopulatedPublisherDto>;

  subscribe(req: CreateSubscriptionRequest): Promise<EntityDto>;

  unsubscribe(dbId: string): Promise<void>;
}

