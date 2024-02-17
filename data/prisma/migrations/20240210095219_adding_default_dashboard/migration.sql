-- AlterTable
ALTER TABLE "Organisation" ADD COLUMN     "defaultDashboardId" TEXT;

-- AddForeignKey
ALTER TABLE "Organisation" ADD CONSTRAINT "Organisation_defaultDashboardId_fkey" FOREIGN KEY ("defaultDashboardId") REFERENCES "Dashboard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
