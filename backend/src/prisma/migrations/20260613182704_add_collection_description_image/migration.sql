-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "CollectionImage" (
    "id" SERIAL NOT NULL,
    "data" BYTEA NOT NULL,
    "mimeType" TEXT NOT NULL,
    "collectionId" INTEGER NOT NULL,

    CONSTRAINT "CollectionImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CollectionImage_collectionId_key" ON "CollectionImage"("collectionId");

-- AddForeignKey
ALTER TABLE "CollectionImage" ADD CONSTRAINT "CollectionImage_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
