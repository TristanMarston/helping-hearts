-- DropForeignKey
ALTER TABLE "CommunityAthlete" DROP CONSTRAINT "CommunityAthlete_raceId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_youthAthleteId_fkey";

-- AddForeignKey
ALTER TABLE "CommunityAthlete" ADD CONSTRAINT "CommunityAthlete_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_youthAthleteId_fkey" FOREIGN KEY ("youthAthleteId") REFERENCES "YouthAthlete"("id") ON DELETE CASCADE ON UPDATE CASCADE;
