import { Bookmark_v0_1 } from "../../0.1/models/bookmark.model";
import { Bookmark_v0_2 } from "../models/bookmark.model";
import { VERSION } from "../constants";
import { Migration } from "@/main/migration/types";

export class BookmarkMigration implements Migration {
    public async run(data: Bookmark_v0_1): Promise<Bookmark_v0_2> {
        const bookmark: Bookmark_v0_2 = {
            ...data,
            meta: {
                createdAt: new Date().toISOString(),
                version: VERSION
            }
        };
        return bookmark;
    }
}