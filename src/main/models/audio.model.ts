import { object, string, array, enums, assign, optional } from "superstruct";
import { extname } from "path";
import { AudioExtension } from "../../enums";
import { Audio_v0_2 } from "../protocol-version/0.2/models/audio.model";
import { Entity } from "./entity.model";

export class Audio extends Entity implements Audio_v0_2 {
  static entityType = "Audio";

  ext: AudioExtension;
  tags?: string[];
  title: string;
  _type: string;

  static schema = assign(
    object({
      ext: enums(Object.values(AudioExtension)),
      title: string(),
      tags: optional(array(string()))
    }),
    Entity.schema
  )

  constructor(init?: Partial<Audio>) {
    super(init);
  }

  get fileBase() {
    return `${this._id}.${this.ext}`;
  }

  setExtension(file: string): void {
    this.ext = extname(file).slice('.'.length) as AudioExtension;
  }
}