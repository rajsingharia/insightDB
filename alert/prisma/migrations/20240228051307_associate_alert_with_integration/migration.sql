/*
  Warnings:

  - Added the required column `integrationAlertId` to the `Alerts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alerts" ADD COLUMN     "integrationAlertId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Alerts" ADD CONSTRAINT "Alerts_integrationAlertId_fkey" FOREIGN KEY ("integrationAlertId") REFERENCES "Integration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
