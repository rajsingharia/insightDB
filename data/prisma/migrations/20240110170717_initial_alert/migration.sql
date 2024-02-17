/*
  Warnings:

  - You are about to drop the column `parameters` on the `Insight` table. All the data in the column will be lost.
  - You are about to drop the column `wigth` on the `Insight` table. All the data in the column will be lost.
  - Added the required column `rawQuery` to the `Insight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Insight" DROP COLUMN "parameters",
DROP COLUMN "wigth",
ADD COLUMN     "rawQuery" TEXT NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL DEFAULT 4,
ALTER COLUMN "height" SET DEFAULT 4;

-- CreateTable
CREATE TABLE "Alerts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "rawQuery" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "cronExpression" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "Alerts_pkey" PRIMARY KEY ("id")
);
