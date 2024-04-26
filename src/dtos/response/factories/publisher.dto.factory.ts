import { PopulatedPublisher, Publisher } from "@/main/models/publisher.model";
import { UserPublisher } from "@/main/models/user-publisher.model";
import { PopulatedPublisherDto, PublisherDto, UserPublisherDto } from "../interfaces";
import { ArticleDtoFactory } from "./article.dto.factory";
import { EntityDtoFactory } from "./entity.dto.factory";

export class PublisherDtoFactory {
  static toDto(model: Publisher): PublisherDto {
      return {
        ...EntityDtoFactory.toDto(model),
          _pinned: model._pinned,
          _subscribed: model._subscribed,
          article: model.article
      }
  }

  static toPopulatedDto(model: PopulatedPublisher): PopulatedPublisherDto {
        return {
            ...EntityDtoFactory.toDto(model),
            _pinned: model._pinned,
            _subscribed: model._subscribed,
            article: ArticleDtoFactory.toDto(model.article)
        }
  }
}

  
export class UserPublisherDtoFactory {
    static toDto(model: UserPublisher): UserPublisherDto {
        return {
            ...EntityDtoFactory.toDto(model),
            pinned: model.pinned,
        }
    }
}