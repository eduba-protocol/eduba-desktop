export enum CollectionName {
  Article = "articles",
  Audio = "audio",
  Bookmark = "bookmarks",
  Image = "images",
  Publisher = "publishers",
  Subscription = "subscriptions",
  Upload = "uploads",
  UserPublisher = "user-publishers",
  UserSetting = "user-setting",
  Video = "video",
}

export enum DbChangeType {
  Create = "create",
  Update = "update",
  Delete = "delete",
}

export enum BookmarkType {
  Bookmark = "bookmark",
  Folder = "folder",
}

export enum ArticleContentExtension {
  Markdown = "md",
}

export enum ImageExtension {
  Avif = "avif",
  Bmp = "bmp",
  Gif = "gif",
  Jpeg = "jpeg",
  Png = "png",
  Svg = "svg",
  Tif = "tif",
  Webp = "webp",
}

export enum AudioExtension {
  Mp3 = "mp3",
  Ogg = "ogg",
  Wav = "wav",
}

export enum VideoExtension {
  Mp4 = "mp4",
  Avi = "avi",
  Ogv = "ogv",
  Webm = "webm",
}

export enum SessionStatus {
  Active = "active",
  Inactive = "inactive",
}

export enum UserSettings {}

export enum AlertType {
  Info = "alert-info",
  Success = "alert-success",
  Warning = "alert-warning",
  Error = "alert-error",
}

export enum HdWalletType {
  Mneumonic = "mneumonic",
  Ledger = "ledger",
}