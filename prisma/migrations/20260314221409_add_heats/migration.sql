-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "heatId" TEXT;

-- CreateTable
CREATE TABLE "Heat" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,

    CONSTRAINT "Heat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_heatId_fkey" FOREIGN KEY ("heatId") REFERENCES "Heat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
