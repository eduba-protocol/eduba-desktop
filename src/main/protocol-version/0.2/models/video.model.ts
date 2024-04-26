import { VideoExtension } from "../enums";
import { Entity_v0_2 } from "./Entity.model";

export interface Video_v0_2 extends Entity_v0_2 {
    ext: VideoExtension;
    tags?: string[];
    title: string;
}