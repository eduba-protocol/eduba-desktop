import { EntityDto } from "./entity.res.dto";
import { ArticleDto } from "./article.res.dto";

export interface PublisherDto extends EntityDto {
    article: string;
    _subscribed: boolean;
    _pinned: boolean;
}

export interface PopulatedPublisherDto extends EntityDto {
  article: ArticleDto;
  _subscribed: boolean;
  _pinned: boolean;
}
  
export interface UserPublisherDto extends EntityDto {
    pinned: boolean;
  }