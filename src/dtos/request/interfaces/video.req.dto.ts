export interface CreateVideoRequest {
  // Database ID
  _db: string;
  // File path of video on machine
  file: string;
  // Video Title
  title: string;
  // Tags for search
  tags?: string[]
}

export interface UpdateVideoRequest {
  _db: string;
  _id: string;
  file?: string;
  title?: string;
  tags?: string[]
}
