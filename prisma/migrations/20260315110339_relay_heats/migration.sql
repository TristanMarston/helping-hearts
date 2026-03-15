-- AlterTable
ALTER TABLE "RelayTeam" ADD COLUMN     "relayHeatId" TEXT;

-- CreateTable
CREATE TABLE "RelayHeat" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "RelayHeat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RelayTeam" ADD CONSTRAINT "RelayTeam_relayHeatId_fkey" FOREIGN KEY ("relayHeatId") REFERENCES "RelayHeat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
