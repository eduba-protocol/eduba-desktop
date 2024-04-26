export interface CreateUploadRequest {
    // Database ID
    _db: string;
    // Path of file to upload
    file: string;
    // File name to suggest to user on download
    fileName?: string;
}

export interface UpdateUploadRequest {
    _db: string;
    _id: string;
    file?: string;
    fileName?: string;
}
