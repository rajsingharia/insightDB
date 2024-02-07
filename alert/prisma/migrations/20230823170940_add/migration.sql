/*
  Warnings:

  - You are about to drop the column `inetgrationId` on the `Insight` table. All the data in the column will be lost.
  - Added the required column `integrationId` to the `Insight` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Insight" DROP CONSTRAINT "Insight_inetgrationId_fkey";

-- AlterTable
ALTER TABLE "Insight" DROP COLUMN "inetgrationId",
ADD COLUMN     "integrationId" TEXT NOT NULL,
ADD COLUMN     "lastRefresh" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "refreshRate" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Insight" ADD CONSTRAINT "Insight_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
