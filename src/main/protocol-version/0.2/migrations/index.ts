import { MigrationClass } from "@/main/migration/types";
import { ArticleMigration } from "./article.migration";
import { AudioMigration } from "./audio.migration";
import { BookmarkMigration } from "./bookmark.migration";
import { ImageMigration } from "./image.migration";
import { PublisherMigration } from "./publisher.migration";
import { SubscriptionMigration } from "./subscription.migration";
import { UploadMigration } from "./upload.migration";
import { UserPublisherMigration } from "./user-publisher.migration";
import { VideoMigration } from "./video.migration";

export const migrations: Record<string, MigrationClass> = {
    Article: ArticleMigration,
    Audio: AudioMigration,
    Bookmark: BookmarkMigration,
    Image: ImageMigration,
    Publisher: PublisherMigration,
    Subscription: SubscriptionMigration,
    Upload: UploadMigration,
    UserPublisher: UserPublisherMigration,
    Video: VideoMigration
}