'use server';

import { prisma } from '@/lib/prisma';

export async function getPublicResults(type: string) {
    try {
        if (type === 'youth') {
            const athletes = await prisma.youthAthlete.findMany({ include: { events: true } });

            const formatted = athletes.map((a: any) => {
                const parts = a.name.split(' ');
                const firstName = parts[0] || '';
                const lastName = parts.slice(1).join(' ') || '';
                return {
                    _id: a.id,
                    firstName,
                    lastName,
                    age: parseInt(a.grade) > 0 ? parseInt(a.grade) + 5 : 6, // roughly map grade to age, or just use 0 if grade is not age
                    results: a.events
                        .filter((e: any) => e.performance !== '')
                        .map((e: any) => ({
                            event: e.name,
                            performance: e.performance,
                            unit: e.name === 'softball throw' || e.name === 'long jump' ? 'inches' : 'seconds',
                            enteredAt: new Date().toISOString(),
                        })),
                };
            });
            return { success: true, data: formatted };
        } else if (type === 'community') {
            const athletes = await prisma.communityAthlete.findMany({ include: { race: true } });

            const formatted = athletes.map((a: any) => {
                const parts = a.name.split(' ');
                const firstName = parts[0] || '';
                const lastName = parts.slice(1).join(' ') || '';
                return {
                    _id: a.id,
                    firstName,
                    lastName,
                    age: a.dob ? new Date().getFullYear() - new Date(a.dob).getFullYear() : 0,
                    result: a.race?.performance || '',
                };
            });
            return { success: true, data: formatted };
        }
        return { success: false, message: 'Invalid type' };
    } catch (e: any) {
        console.error(e);
        return { success: false, message: 'Error fetching results' };
    }
}
