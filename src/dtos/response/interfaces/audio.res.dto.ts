import { EntityDto } from "./entity.res.dto";

export interface AudioDto extends EntityDto {
    _type: string;
    ext: string;
    title: string;
}