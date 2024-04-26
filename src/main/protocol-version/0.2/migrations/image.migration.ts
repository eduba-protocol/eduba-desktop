import { Image_v0_1 } from "../../0.1/models/image.model";
import { Image_v0_2 } from "../models/image.model";
import { VERSION } from "../constants";
import { stringToEnum } from "@/lib/common/utils/enum";
import { ImageExtension } from "../enums";
import { Migration } from "@/main/migration/types";

export class ImageMigration implements Migration {
    public async run({ createdAt, ext, ...data }: Image_v0_1): Promise<Image_v0_2> {
        const image: Image_v0_2 = {
            ...data,
            ext: stringToEnum(ImageExtension, ext.slice(1)),
            meta: {
                createdAt,
                version: VERSION
            }
        };
        return image;
    }
}