-- AlterTable
ALTER TABLE "Insight" ADD COLUMN     "height" INTEGER NOT NULL DEFAULT 200,
ADD COLUMN     "wigth" INTEGER NOT NULL DEFAULT 200,
ADD COLUMN     "xCoords" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "yCoords" INTEGER NOT NULL DEFAULT 0;
