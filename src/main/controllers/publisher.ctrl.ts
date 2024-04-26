import { string, pattern } from "superstruct";
import { inject, injectable } from "inversify";
import { TYPES } from "@/main/di/types";
import { PublisherService } from "@/main/services/publisher.service";
import { UserPublisherService } from "@/main/services/user-publisher.service";
import { SubscriptionService } from "@/main/services/subscription.service";
import { CreatePublisherRequest, CreateSubscriptionRequest, UpdateUserPublisherRequest } from "@/dtos/request/interfaces";
import { dbIdRegex } from "@/main/models/entity.model";
import { schema, validate } from "./common/decorators";
import { PublisherApi } from "@/api/interfaces/publisher.api";
import { CreatePublisherRequestSchema, UpdateUserPublisherRequestSchema, CreateSubscriptionRequestSchema } from "@/dtos/request/schemas";
import { PublisherDtoFactory, SubscriptionDtoFactory, UserPublisherDtoFactory } from "@/dtos/response/factories";
import { BaseController } from "./base.ctrl";

@injectable()
export class PublisherController extends BaseController implements PublisherApi {
  constructor(
    @inject(TYPES.PublisherService) private readonly publisherService: PublisherService,
    @inject(TYPES.UserPublisherService) private readonly userPublisherService: UserPublisherService,
    @inject(TYPES.SubscriptionService) private readonly subscriptionService: SubscriptionService
  ) {
    super();
  }

  @validate
  async create(
    @schema(CreatePublisherRequestSchema) req: CreatePublisherRequest
  ) {
    this.sessionGuard();
    const publisher = await this.publisherService.create(req);
    return PublisherDtoFactory.toDto(publisher);
  }

  async findSubscribed() {
    this.sessionGuard();
    const publishers = await this.publisherService.findSubscribed();
    const populated = await this.publisherService.populate(publishers);
    return populated.map(PublisherDtoFactory.toPopulatedDto);
  }

  async findUserPublishers() {
    this.sessionGuard();
    const publishers = await this.publisherService.findUserPublished();
    const populated = await this.publisherService.populate(publishers);
    return populated.map(PublisherDtoFactory.toPopulatedDto);
  }

  @validate
  async updateUserPublisher(
    @schema(UpdateUserPublisherRequestSchema) req: UpdateUserPublisherRequest
  ) {
    this.sessionGuard();
    const userPublisher = await this.userPublisherService.update(req);
    return UserPublisherDtoFactory.toDto(userPublisher);
  }

  @validate
  async load(
    @schema(pattern(string(), dbIdRegex)) publisherId: string
  ) {
    const publisher = await this.publisherService.load(publisherId);
    const [populated] = await this.publisherService.populate([publisher]);
    return PublisherDtoFactory.toPopulatedDto(populated);
  }

  @validate
  async subscribe(
    @schema(CreateSubscriptionRequestSchema) req: CreateSubscriptionRequest
  ) {
    this.sessionGuard();
    const subscription = await this.subscriptionService.create(req);
    return SubscriptionDtoFactory.toDto(subscription);
  }

  @validate
  async unsubscribe(
    @schema(string()) id: string
  ) {
    this.sessionGuard();
    await this.subscriptionService.delete(id);
  }
}

