/*
  Warnings:

  - Added the required column `lane` to the `RelayTeam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RelayTeam" ADD COLUMN     "lane" INTEGER NOT NULL;
