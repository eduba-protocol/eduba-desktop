import { object, string, array, enums, assign, optional } from "superstruct";
import { extname } from "path";
import { ImageExtension } from "../../enums";
import { Image_v0_2 } from "../protocol-version/0.2/models/image.model";
import { Entity } from "./entity.model";

export class Image extends Entity implements Image_v0_2 {
  static entityType = "Image";

  alt: string;
  ext: ImageExtension;
  tags?: string[];
  _type: string;

  constructor(init?: Partial<Image>) {
    super(init);
  }

  static schema = assign(
    object({
      ext: enums(Object.values(ImageExtension)),
      alt: string(),
      tags: optional(array(string()))
    }),
    Entity.schema
  )

  get fileBase() {
    return `${this._id}.${this.ext}`;
  }

  setExtension(file: string): void {
    const ext: string = extname(file).slice('.'.length);
    this.ext = ext as ImageExtension;
    if (ext === "jpg") {
      this.ext = ImageExtension.Jpeg;
    }
  }
}