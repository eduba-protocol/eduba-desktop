import { EntityDto } from "./entity.res.dto";

export interface VideoDto extends EntityDto {
    ext: string;
    title: string;
    _type: string;
  }
  