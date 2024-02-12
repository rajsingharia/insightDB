/*
  Warnings:

  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_dashId_fkey";

-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "writePermissionToDashboardId" TEXT;

-- DropTable
DROP TABLE "Permission";

-- DropEnum
DROP TYPE "AccessType";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_writePermissionToDashboardId_fkey" FOREIGN KEY ("writePermissionToDashboardId") REFERENCES "Dashboard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
