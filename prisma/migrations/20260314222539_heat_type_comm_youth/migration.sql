/*
  Warnings:

  - Added the required column `type` to the `Heat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "HeatType" AS ENUM ('community', 'youth');

-- AlterTable
ALTER TABLE "Heat" ADD COLUMN     "type" "HeatType" NOT NULL;
