'use server';

import { prisma } from '@/lib/prisma';

export async function getPublicResults(type: string) {
    try {
        if (type === 'youth') {
            const athletes = await prisma.youthAthlete.findMany({ include: { events: true } });

            const formatted = athletes
                .filter((a: any) => a.events.some((e: any) => e.performance))
                .map((a: any) => {
                    return {
                        id: a.id,
                        name: a.name,
                        dob: a.dob,
                        year: a.year,
                        events: a.events
                            .filter((e: any) => e.performance)
                            .map((e: any) => ({
                                name: e.name,
                                performance: e.performance,
                                unit: e.unit,
                                year: e.year,
                                id: e.id,
                                athleteId: a.id,
                            })),
                    };
                });

            return { success: true, data: formatted };
        } else if (type === 'community') {
            const athletes = await prisma.communityAthlete.findMany({ include: { race: true } });

            const formatted = athletes
                .filter((a: any) => a.race && a.race.performance)
                .map((a: any) => {
                    return {
                        id: a.id,
                        name: a.name,
                        dob: a.dob,
                        race: { id: a.race.id, performance: a.race.performance, unit: a.race.unit, athleteId: a.id, name: a.name, year: a.race.year },
                    };
                });
            return { success: true, data: formatted };
        }
        return { success: false, message: 'Invalid type' };
    } catch (e: any) {
        return { success: false, message: 'Error fetching results' };
    }
}
