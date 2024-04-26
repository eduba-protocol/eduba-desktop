import { EntityDto } from "./entity.res.dto";

export interface ArticleDto extends EntityDto {
    title: string;
    ext: string;
}