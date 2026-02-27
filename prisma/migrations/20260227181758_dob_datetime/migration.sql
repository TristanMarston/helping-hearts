/*
  Warnings:

  - Changed the type of `dob` on the `Volunteer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `dob` to the `YouthAthlete` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('run_1600', 'run_800', 'run_400', 'run_100', 'run_4x100', 'softball_throw', 'long_jump');

-- AlterTable
ALTER TABLE "Volunteer" DROP COLUMN "dob",
ADD COLUMN     "dob" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "YouthAthlete" ADD COLUMN     "dob" TIMESTAMP(3) NOT NULL;
