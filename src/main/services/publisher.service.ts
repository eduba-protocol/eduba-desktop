import { PopulatedPublisher, Publisher } from "../models/publisher.model";
import * as Constants from "../../constants";
import { HyperdriveService, HyperdriveStorage } from "../../lib/holepunch";
import { CollectionName } from "../../enums";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import log, { LogFunctions } from "electron-log";
import { UserPublisherService } from "./user-publisher.service";
import { ArticleService } from "./article.service";
import { SubscriptionService } from "./subscription.service";
import { CreatePublisherRequest } from "@/dtos/request/interfaces";
import { DocumentRepository, DocumentRepositoryFactory } from "./common/document.repository";

@injectable()
export class PublisherService {
  private readonly log: LogFunctions = log.scope("PublisherService");

  private readonly repo: DocumentRepository<Publisher>;

  constructor(
    @inject(TYPES.DriveJsonStorage) private readonly jsonStorage: HyperdriveStorage,
    @inject(TYPES.HyperdriveService) private readonly driveService: HyperdriveService,
    @inject(TYPES.UserPublisherService) private readonly userPublisherService: UserPublisherService,
    @inject(TYPES.ArticleService) private readonly articleService: ArticleService,
    @inject(TYPES.SubscriptionService) private readonly subscriptionService: SubscriptionService,
    @inject(TYPES.RepoFactory) private readonly repoFactory: DocumentRepositoryFactory<Publisher>
  ) {
    this.repo = this.repoFactory(this.jsonStorage, CollectionName.Publisher, Publisher);
  }

  async create({ ext, title }: CreatePublisherRequest): Promise<Publisher> {
    const userPublishers = await this.userPublisherService.find();
    const coreName = `${Constants.Publisher}${userPublishers.length}`;

    const db = await this.driveService.db({ name: coreName });
    await db.ready();

    const publisher = new Publisher();
    publisher._db = db.id;
    publisher._id = Constants.Default

    // Create a publisher profile aritcle and add ID to Request
    const article = await this.articleService.create({
      _db: db.id,
      ext,
      title,
      tags: [],
    });

    publisher.article = article._id as string;

    await Promise.all([
      this.repo.create(publisher),
      this.userPublisherService.create({
        _id: db.id,
        coreName,
        pinned: true,
      }),
    ]);

    return publisher;
  }

  async findSubscribed(): Promise<Publisher[]> {
    const subscriptions = await this.subscriptionService.find();
    return Promise.all(subscriptions.map((x) => this.load(x._id, true)));
  }

  async findUserPublished(): Promise<Publisher[]> {
    const userPublishers = await this.userPublisherService.find();
    const publishers = await Promise.all(userPublishers.map(
      async (x) => {
        const publisher = await this.repo.get(x._id, Constants.Default);
        publisher._subscribed = false;
        const userPublisher = await this.userPublisherService.get(x._id);
        if (userPublisher._found) {
          publisher._pinned = userPublisher.pinned;
        }
        return publisher;
      }
    ));

    return publishers;
  }

  async load(_db: string, subscribed?: boolean): Promise<Publisher> {
    const publisher = await this.repo.load(_db, Constants.Default);
    if (typeof subscribed === "undefined") {
      const subscription = await this.subscriptionService.get(_db);
      subscribed = subscription._found;
    }
    publisher._subscribed = subscribed;
    const userPublisher = await this.userPublisherService.get(_db);
    if (userPublisher._found) {
      publisher._pinned = userPublisher.pinned;
    }
    return publisher;
  }

  async populate(publishers: Publisher[]): Promise<PopulatedPublisher[]> {
    return Promise.all(publishers.map(async publisher => {
      const article = await this.articleService.get(
        publisher._db as string,
        publisher.article as string
      );
      return { ...publisher, article };
    }));
  }
}
