import { object, string, array, enums, assign, optional } from "superstruct";
import { extname } from "path";
import { VideoExtension } from "../../enums";
import { Video_v0_2 } from "../protocol-version/0.2/models/video.model";
import { Entity } from "./entity.model";

export class Video extends Entity implements Video_v0_2 {
  static entityType = "Video";

  ext: VideoExtension;
  title: string;
  tags?: string[];
  _type?: string;

  static schema = assign(
    object({
      ext: enums(Object.values(VideoExtension)),
      title: string(),
      tags: optional(array(string()))
    }),
    Entity.schema
  )
  
  constructor(init?: Partial<Video>) {
    super(init);
  }

  get fileBase() {
    return `${this._id}.${this.ext}`;
  }

  setExtension(file: string): void {
    this.ext = extname(file).slice('.'.length) as VideoExtension;
  }
}
