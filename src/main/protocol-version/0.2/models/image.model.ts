import { ImageExtension } from "../enums";
import { Entity_v0_2 } from "./Entity.model";

export interface Image_v0_2 extends Entity_v0_2 {
  alt: string;
  ext: ImageExtension;
  tags?: string[];
}
