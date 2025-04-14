-- CreateTable
CREATE TABLE "Font" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "path" VARCHAR(500) NOT NULL,
    "size" INTEGER NOT NULL,
    "mimetype" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Font_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FontGroup" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FontGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FontGroupFont" (
    "fontId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FontGroupFont_pkey" PRIMARY KEY ("fontId","groupId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Font_name_key" ON "Font"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Font_filename_key" ON "Font"("filename");

-- CreateIndex
CREATE INDEX "Font_name_idx" ON "Font"("name");

-- CreateIndex
CREATE INDEX "Font_createdAt_idx" ON "Font"("createdAt");

-- CreateIndex
CREATE INDEX "FontGroup_createdAt_idx" ON "FontGroup"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "FontGroup_title_key" ON "FontGroup"("title");

-- CreateIndex
CREATE INDEX "FontGroupFont_createdAt_idx" ON "FontGroupFont"("createdAt");

-- AddForeignKey
ALTER TABLE "FontGroupFont" ADD CONSTRAINT "FontGroupFont_fontId_fkey" FOREIGN KEY ("fontId") REFERENCES "Font"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FontGroupFont" ADD CONSTRAINT "FontGroupFont_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "FontGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
