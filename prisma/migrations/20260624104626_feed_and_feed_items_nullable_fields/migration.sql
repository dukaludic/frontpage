/*
  Warnings:

  - You are about to drop the column `url` on the `feed_items` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `feeds` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "feed_items" DROP COLUMN "url",
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "feeds" DROP COLUMN "name",
ADD COLUMN     "health_status" TEXT,
ADD COLUMN     "last_fetched_at" TIMESTAMP(3),
ADD COLUMN     "title" TEXT;
