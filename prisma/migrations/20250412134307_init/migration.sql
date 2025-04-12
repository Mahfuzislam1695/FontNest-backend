-- CreateTable
CREATE TABLE "Font" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Font_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FontGroup" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
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

-- AddForeignKey
ALTER TABLE "FontGroupFont" ADD CONSTRAINT "FontGroupFont_fontId_fkey" FOREIGN KEY ("fontId") REFERENCES "Font"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FontGroupFont" ADD CONSTRAINT "FontGroupFont_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "FontGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
