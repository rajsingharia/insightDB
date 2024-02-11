/*
  Warnings:

  - You are about to drop the column `count` on the `Alerts` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `Alerts` table. All the data in the column will be lost.
  - Added the required column `configuration` to the `Alerts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destination` to the `Alerts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Alerts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AlertDestinations" AS ENUM ('SLACK', 'EMAIL');

-- AlterTable
ALTER TABLE "Alerts" DROP COLUMN "count",
DROP COLUMN "data",
ADD COLUMN     "configuration" JSONB NOT NULL,
ADD COLUMN     "destination" "AlertDestinations" NOT NULL,
ADD COLUMN     "repeatCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AlertTriggered" (
    "id" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "isSuccessful" BOOLEAN NOT NULL,
    "errorMessage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertTriggered_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Alerts" ADD CONSTRAINT "Alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertTriggered" ADD CONSTRAINT "AlertTriggered_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alerts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
