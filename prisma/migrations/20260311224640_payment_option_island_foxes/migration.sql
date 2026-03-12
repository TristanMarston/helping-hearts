/*
  Warnings:

  - The `paid` column on the `CommunityAthlete` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paid` column on the `YouthAthlete` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PaymentOption" AS ENUM ('unpaid', 'paid', 'island_foxes');

-- AlterTable
ALTER TABLE "CommunityAthlete" DROP COLUMN "paid",
ADD COLUMN     "paid" "PaymentOption" NOT NULL DEFAULT 'unpaid';

-- AlterTable
ALTER TABLE "YouthAthlete" DROP COLUMN "paid",
ADD COLUMN     "paid" "PaymentOption" NOT NULL DEFAULT 'unpaid';
