import { Audio_v0_1 } from "../../0.1/models/audio.model";
import { Audio_v0_2 } from "../models/audio.model";
import { VERSION } from "../constants";
import { stringToEnum } from "@/lib/common/utils/enum";
import { AudioExtension } from "../enums";
import { Migration } from "@/main/migration/types";

export class AudioMigration implements Migration {
    public async run({ createdAt, ext, ...data }: Audio_v0_1): Promise<Audio_v0_2> {
        const audio: Audio_v0_2 = {
            ...data,
            ext: stringToEnum(AudioExtension, ext.slice(1)),
            meta: {
                createdAt,
                version: VERSION
            }
        };
        return audio;
    }
}