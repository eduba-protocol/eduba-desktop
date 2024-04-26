export interface CreateAudioRequest {
  // Database ID
  _db: string;
  // File path of audio on machine
  file: string;
  // Audio Title
  title: string;
  // Tags for search
  tags?: string[];
}

export interface UpdateAudioRequest {
  _db: string;
  _id: string;
  file?: string;
  title?: string;
  tags?: string[];
}
