import { Entity_v0_2 } from "./Entity.model";

export interface Upload_v0_2 extends Entity_v0_2 {
    ext?: string;
    fileName?: string;
    tags?: string[];
}