import { EntityDto } from "./entity.res.dto";

export interface ImageDto extends EntityDto {
    alt: string;
    ext: string;
    _type: string;
  }