import { VideoExtension } from "../enums";

export interface Video_v0_1 {
    createdAt: string;
    ext: VideoExtension;
    tags: string[];
    title: string;
}