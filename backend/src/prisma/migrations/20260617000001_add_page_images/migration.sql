CREATE TABLE "PageImage" (
  "id" SERIAL NOT NULL,
  "key" TEXT NOT NULL,
  "data" BYTEA NOT NULL,
  "mimeType" TEXT NOT NULL,
  CONSTRAINT "PageImage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PageImage_key_key" ON "PageImage"("key");
