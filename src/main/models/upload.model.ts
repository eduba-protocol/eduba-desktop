import { object, string, optional, assign, array } from "superstruct";
import { extname } from "path";
import { Upload_v0_2 } from "../protocol-version/0.2/models/upload.model";
import { Entity } from "./entity.model";

export class Upload extends Entity implements Upload_v0_2 {
  static entityType = "Upload";

  ext?: string;
  fileName?: string;
  tags?: string[];
  _type?: string;

  static schema = assign(
    object({
      ext: optional(string()),
      fileName: optional(string()),
      tags: optional(array(string()))
    }),
    Entity.schema
  )

  constructor(init?: Partial<Upload>) {
    super(init);
  }

  get fileBase() {
    return `${this._id}.${this.ext}`;
  }

  setExtension(file: string): void {
    this.ext = extname(file).slice('.'.length);
  }
}
