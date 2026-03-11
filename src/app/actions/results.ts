'use server';

import { prisma } from '@/lib/prisma';

console.log('[getPublicResults Module] loaded');

export async function getPublicResults(type: string) {
    console.time('[getPublicResults] total time');
    console.log('[getPublicResults] starting with type:', type);

    try {
        if (type === 'youth') {
            console.log('[getPublicResults] querying prisma.youthAthlete...');
            const athletes = await prisma.youthAthlete.findMany({ include: { events: true } });
            console.log('[getPublicResults] found athletes:', athletes.length);

            const formatted = athletes
                .filter((a: any) => a.events.every((e: any) => e.performance))
                .map((a: any) => {
                    return {
                        id: a.id,
                        name: a.name,
                        dob: a.dob,
                        year: a.year,
                        events: a.events.map((e: any) => ({
                            name: e.name,
                            performance: e.performance,
                            unit: e.unit,
                            year: e.year,
                            id: e.id,
                            athleteId: a.id,
                        })),
                    };
                });
            console.timeEnd('[getPublicResults] total time');
            return { success: true, data: formatted };
        } else if (type === 'community') {
            console.log('[getPublicResults] querying prisma.communityAthlete...');
            const athletes = await prisma.communityAthlete.findMany({ include: { race: true } });
            console.log('[getPublicResults] found community athletes:', athletes.length);

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
            console.log('[getPublicResults] formatted community athletes:', formatted.length);
            console.timeEnd('[getPublicResults] total time');
            return { success: true, data: formatted };
        }
        console.timeEnd('[getPublicResults] total time');
        return { success: false, message: 'Invalid type' };
    } catch (e: any) {
        console.timeEnd('[getPublicResults] total time');
        console.error('[getPublicResults] error:', e);
        return { success: false, message: 'Error fetching results' };
    }
}
