/**
 * User publisher is a collection to track the publications created
 * by the logged in user.
 */
import { CollectionName } from "../../enums";
import { HyperbeeStorage, HyperdriveService } from "../../lib/holepunch";
import { UserPublisher } from "../models/user-publisher.model";
import { inject, injectable } from "inversify";
import { UserService } from "./user.service";
import log, { LogFunctions } from "electron-log";
import { TYPES } from "../di/types";
import { UpdateUserPublisherRequest } from "@/dtos/request/interfaces";
import { DocumentRepository, DocumentRepositoryFactory } from "./common/document.repository";

@injectable()
export class UserPublisherService {
  private readonly log: LogFunctions = log.scope("UserPublisherService");

  private readonly repo: DocumentRepository<UserPublisher>;

  constructor(
    @inject(TYPES.UserService) private readonly userService: UserService,
    @inject(TYPES.HyperdriveService) private readonly driveService: HyperdriveService,
    @inject(TYPES.BeeJsonStorage) private readonly jsonStorage: HyperbeeStorage,
    @inject(TYPES.RepoFactory) private readonly repoFactory: DocumentRepositoryFactory<UserPublisher>
  ) {
    this.repo = this.repoFactory(this.jsonStorage, CollectionName.UserPublisher, UserPublisher);
  }

  async create(request: any): Promise<UserPublisher> {
    const userPublisher = new UserPublisher(request);
    userPublisher._db = this.userService.sessionDbId();
    await this.repo.create(userPublisher);

    if (userPublisher.pinned) {
      this.driveService.joinSwarm(userPublisher._id);
    } else {
      this.driveService.leaveSwarm(userPublisher._id);
    }

    return userPublisher;
  }

  async update({ _id, ...props }: UpdateUserPublisherRequest): Promise<UserPublisher> {
    const userPublisher = await this.repo.getOrFail(this.userService.sessionDbId(), _id);
    Object.assign(userPublisher, props);
    await this.repo.put(userPublisher);

    if ("pinned" in props) {
      if (userPublisher.pinned) {
        this.driveService.joinSwarm(userPublisher._id);
      } else {
        this.driveService.leaveSwarm(userPublisher._id);
      }
    }

    return userPublisher;
  }

  async find(): Promise<UserPublisher[]> {
    if (!this.userService.sessionDbId(false)) {
      return [];
    }

    return this.repo.find(this.userService.sessionDbId());
  }

  async get(id: string): Promise<UserPublisher> {
    if (!this.userService.sessionDbId(false)) {
      const userPublisher = new UserPublisher({});
      userPublisher._id = id;
      userPublisher._found = false;
      return userPublisher;
    }

    return this.repo.get(this.userService.sessionDbId(), id);
  }

  async joinAllToSwarm(): Promise<void> {
    const _db = this.userService.sessionDbId();
    const userPublishers = await this.repo.find(_db);
    for (const userPublisher of userPublishers) {
      if (userPublisher.pinned) {
        this.driveService.joinSwarm(userPublisher._id);
      }
    }
  }
}
