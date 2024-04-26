export interface CreateImageRequest {
    // Database ID
    _db: string;
    // File path of image to upload
    file: string;
    // Alternate text
    alt: string;
    // Tags for search
    tags?: string[]
}

export interface UpdateImageRequest {
    _db: string;
    _id: string;
    file?: string;
    alt?: string;
    tags?: string[]
}
