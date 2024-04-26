import { EntityDto } from "./entity.res.dto";

export interface UploadDto extends EntityDto {
    fileName: string;
    ext: string;
    _type: string;
  }
  