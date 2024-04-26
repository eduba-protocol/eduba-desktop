import { AudioExtension } from "../enums";

export interface Audio_v0_1 {
  createdAt: string;
  ext: AudioExtension;
  tags: string[];
  title: string;
}
