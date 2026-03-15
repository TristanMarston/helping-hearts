-- CreateEnum
CREATE TYPE "RelayName" AS ENUM ('terrific_tigers', 'great_gazelles', 'super_starfishes', 'fast_falcons', 'dancing_dolphins', 'bright_bisons', 'cheerful_cheetahs', 'brave_bears', 'lightning_leopards', 'racing_ravens', 'turbo_tucans', 'rampaging_rhinos', 'golden_geckos', 'rapid_rabbits', 'swift_swans');

-- CreateTable
CREATE TABLE "RelayTeam" (
    "id" TEXT NOT NULL,
    "name" "RelayName" NOT NULL,
    "performance" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "year" INTEGER NOT NULL DEFAULT 2026,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RelayTeam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RelayTeam_name_key" ON "RelayTeam"("name");
