import { inject, injectable } from "inversify";
import { CollectionName } from "../../enums";
import { HyperbeeStorage, HyperdriveService } from "../../lib/holepunch";
import { Subscription } from "../models/subscription.model";
import { TYPES } from "../di/types";
import log, { LogFunctions } from "electron-log";
import { UserService } from "./user.service";
import { CreateSubscriptionRequest } from "@/dtos/request/interfaces";
import { DocumentRepository, DocumentRepositoryFactory } from "./common/document.repository";

@injectable()
export class SubscriptionService {
  private readonly log: LogFunctions = log.scope("SubscriptionService");

  private readonly repo: DocumentRepository<Subscription>;

  constructor(
    @inject(TYPES.BeeJsonStorage) private readonly jsonStorage: HyperbeeStorage,
    @inject(TYPES.UserService) private readonly userService: UserService,
    @inject(TYPES.HyperdriveService) private readonly driveService: HyperdriveService,
    @inject(TYPES.RepoFactory) private readonly repoFactory: DocumentRepositoryFactory<Subscription>
  ) {
    this.repo = this.repoFactory(this.jsonStorage, CollectionName.Subscription, Subscription);
  }

  async create(request: CreateSubscriptionRequest): Promise<Subscription> {
    const subscription = new Subscription();
    subscription._id = request._id;
    subscription._db = this.userService.sessionDbId();
    await this.repo.create(subscription);
    this.driveService.subscribe(subscription._id as string);
    return subscription;
  }

  async delete(id: string): Promise<void> {
    const subscription = await this.repo.getOrFail(this.userService.sessionDbId(), id);
    this.driveService.unsubscribe(subscription._id as string);
    await this.repo.delete(subscription._db as string, subscription._id as string);
  }

  async find(): Promise<Subscription[]> {
    if (!this.userService.sessionDbId(false)) {
      return [];
    }

    return this.repo.find(this.userService.sessionDbId());
  }

  async get(id: string): Promise<Subscription> {
    if (!this.userService.sessionDbId(false)) {
      const subscription = new Subscription({});
      subscription._id = id;
      subscription._found = false;
      return subscription;
    }

    return this.repo.get(this.userService.sessionDbId(), id);
  }

  async subscribeAllToSwarm(): Promise<void> {
    const subscriptions = await this.repo.find(this.userService.sessionDbId());
    for (const subscription of subscriptions) {
      this.driveService.subscribe(subscription._id as string);
    }
  }
}

