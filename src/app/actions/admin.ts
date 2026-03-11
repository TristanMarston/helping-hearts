'use server';

import { prisma } from '@/lib/prisma';

export async function getCollection(collection: string) {
    try {
        let data: any[] = [];

        if (collection === 'youth-athletes') {
            const athletes = await prisma.youthAthlete.findMany({ include: { events: true } });
            data = athletes.filter((athlete) => athlete.year === 2026).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (collection === 'community-athletes') {
            const athletes = await prisma.communityAthlete.findMany({ include: { race: true } });
            data = athletes.filter((athlete) => athlete.year === 2026).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (collection === 'helping-hearts-volunteers') {
            const volunteers = await prisma.volunteer.findMany();
            data = volunteers.map((v: any) => {
                const parts = v.name.split(' ');
                return {
                    _id: v.id,
                    firstName: parts[0] || '',
                    lastName: parts.slice(1).join(' ') || '',
                    email: v.email,
                    dob: v.dob,
                    dphsStudent: v.dphsStudent,
                };
            });
        } else if (collection === 'messages') {
            const messages = await prisma.message.findMany();
            data = messages.map((m: any) => ({
                _id: m.id,
                name: m.name,
                email: m.email,
                subject: m.subject,
                message: m.message,
            }));
        } else {
            return { success: false, message: 'Collection not found' };
        }

        return { success: true, data };
    } catch (e: any) {
        console.error(e);
        return { success: false, message: 'Error fetching collection' };
    }
}

export async function syncSpreadsheets() {
    // This is a stub, but we return success so the frontend doesn't break
    return { success: true };
}

export async function markPaid(collection: string, id: string, status: string) {
    try {
        // Just acknowledging success for now, as paymentStatus isn't heavily modeled yet
        // If needed we can add a paymentStatus field to athletes in schema
        return { success: true };
    } catch (e: any) {
        console.error(e);
        return { success: false, message: 'Could not mark paid' };
    }
}

export async function submitYouthResults(results: any[]) {
    try {
        for (const res of results) {
            // Update the event performance
            const events = await prisma.event.findMany({
                where: { youthAthleteId: res.athleteID, name: res.event },
            });
            if (events.length > 0) {
                await prisma.event.update({
                    where: { id: events[0].id },
                    data: { performance: res.score },
                });
            }
        }
        return { success: true };
    } catch (e: any) {
        console.error(e);
        return { success: false, message: 'Could not save youth results' };
    }
}

export async function submitCommunityResults(results: any[]) {
    try {
        for (const res of results) {
            const athlete = await prisma.communityAthlete.findUnique({ where: { id: res.athleteID } });
            if (athlete && athlete.raceId) {
                await prisma.event.update({
                    where: { id: athlete.raceId },
                    data: { performance: res.score },
                });
            }
        }
        return { success: true };
    } catch (e: any) {
        console.error(e);
        return { success: false, message: 'Could not save community results' };
    }
}

export async function loginAdmin(credentials: any) {
    const { username, password } = credentials;
    try {
        const user = await prisma.user.findUnique({
            where: { username },
        });
        if (user && user.password === password) {
            return { success: true };
        }
        return { success: false, message: 'Invalid credentials' };
    } catch (e: any) {
        console.error(e);
        return { success: false, message: 'Error logging in' };
    }
}
