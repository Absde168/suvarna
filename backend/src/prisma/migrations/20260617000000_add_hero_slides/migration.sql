-- CreateTable
CREATE TABLE "HeroSlide" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT 'Коллекция',
    "subtitle" TEXT NOT NULL DEFAULT '',
    "cta" TEXT NOT NULL DEFAULT 'Смотреть коллекцию',
    "href" TEXT NOT NULL DEFAULT '/collections',
    "align" TEXT NOT NULL DEFAULT 'left',
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "HeroSlide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroSlideImage" (
    "id" SERIAL NOT NULL,
    "data" BYTEA NOT NULL,
    "mimeType" TEXT NOT NULL,
    "slideId" INTEGER NOT NULL,

    CONSTRAINT "HeroSlideImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HeroSlideImage_slideId_key" ON "HeroSlideImage"("slideId");

-- AddForeignKey
ALTER TABLE "HeroSlideImage" ADD CONSTRAINT "HeroSlideImage_slideId_fkey" FOREIGN KEY ("slideId") REFERENCES "HeroSlide"("id") ON DELETE CASCADE ON UPDATE CASCADE;
