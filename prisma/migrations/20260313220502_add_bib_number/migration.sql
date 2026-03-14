/*
  Warnings:

  - A unique constraint covering the columns `[bibNumber]` on the table `CommunityAthlete` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bibNumber]` on the table `YouthAthlete` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CommunityAthlete" ADD COLUMN     "bibNumber" INTEGER;

-- AlterTable
ALTER TABLE "YouthAthlete" ADD COLUMN     "bibNumber" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "CommunityAthlete_bibNumber_key" ON "CommunityAthlete"("bibNumber");

-- CreateIndex
CREATE UNIQUE INDEX "YouthAthlete_bibNumber_key" ON "YouthAthlete"("bibNumber");
