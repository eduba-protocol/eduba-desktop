import { Video_v0_1 } from "../../0.1/models/video.model";
import { Video_v0_2 } from "../models/video.model";
import { VERSION } from "../constants";
import { stringToEnum } from "@/lib/common/utils/enum";
import { VideoExtension } from "../enums";
import { Migration } from "@/main/migration/types";

export class VideoMigration implements Migration {
    public async run({ createdAt, ext, ...data }: Video_v0_1): Promise<Video_v0_2> {
        const video: Video_v0_2 = {
            ...data,
            ext: stringToEnum(VideoExtension, ext.slice(1)),
            meta: {
                createdAt,
                version: VERSION
            }
        };
        return video;
    }
}