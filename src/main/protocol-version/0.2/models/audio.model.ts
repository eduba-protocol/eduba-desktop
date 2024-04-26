import { AudioExtension } from "../enums";
import { Entity_v0_2 } from "./Entity.model";

export interface Audio_v0_2 extends Entity_v0_2 {
  ext: AudioExtension;
  tags?: string[];
  title: string;
}
