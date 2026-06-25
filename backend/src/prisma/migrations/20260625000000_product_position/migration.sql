-- AlterTable
ALTER TABLE "Product" ADD COLUMN "position" INTEGER NOT NULL DEFAULT 0;

-- Initialize position based on createdAt order (newest = highest position number)
UPDATE "Product" SET "position" = sub.row_num
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "createdAt" ASC) - 1 AS row_num
  FROM "Product"
) sub
WHERE "Product".id = sub.id;
