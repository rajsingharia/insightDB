/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Dashboard` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[credentials]` on the table `Integration` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Dashboard_title_key" ON "Dashboard"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Integration_credentials_key" ON "Integration"("credentials");
