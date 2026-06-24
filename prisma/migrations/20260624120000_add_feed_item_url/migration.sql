-- AlterTable: add url (nullable first for existing rows)
ALTER TABLE "feed_items" ADD COLUMN "url" TEXT;

-- Backfill any existing items without a URL
UPDATE "feed_items"
SET "url" = 'legacy:' || "id"
WHERE "url" IS NULL;

-- Enforce NOT NULL
ALTER TABLE "feed_items" ALTER COLUMN "url" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "feed_items_feed_id_url_key" ON "feed_items"("feed_id", "url");
