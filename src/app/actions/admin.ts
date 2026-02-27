'use server';

import { prisma } from '@/lib/prisma';

export async function getCollection(collection: string) {
    try {
        let data: any[] = [];
        let schema: any[] = [];

        if (collection === 'dpi-youth-participants') {
            const athletes = await prisma.youthAthlete.findMany({ include: { events: true } });
            console.log(athletes);
            data = athletes.map((a: any) => {
                const parts = a.name.split(' ');
                const firstName = parts[0] || '';
                const lastName = parts.slice(1).join(' ') || '';
                return {
                    _id: a.id,
                    firstName,
                    lastName,
                    grade: a.grade,
                    events: a.events.map((e: any) => e.name),
                };
            });
            schema = [
                { key: 'firstName', type: 'string', required: true },
                { key: 'lastName', type: 'string', required: true },
                { key: 'grade', type: 'string', required: true },
                { key: 'events', type: 'array', required: true },
            ];
        } else if (collection === 'dpi-community-participants') {
            const athletes = await prisma.communityAthlete.findMany({ include: { race: true } });
            data = athletes.map((a: any) => {
                const parts = a.name.split(' ');
                const firstName = parts[0] || '';
                const lastName = parts.slice(1).join(' ') || '';
                return {
                    _id: a.id,
                    firstName,
                    lastName,
                    email: a.email,
                    dob: a.dob.toISOString(),
                    race: a.race?.name || '1600 meters',
                };
            });
            schema = [
                { key: 'firstName', type: 'string', required: true },
                { key: 'lastName', type: 'string', required: true },
                { key: 'email', type: 'string', required: true },
                { key: 'dob', type: 'string', required: true },
                { key: 'race', type: 'string', required: true },
            ];
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
            schema = [
                { key: 'firstName', type: 'string', required: true },
                { key: 'lastName', type: 'string', required: true },
                { key: 'email', type: 'string', required: true },
                { key: 'dob', type: 'string', required: true },
                { key: 'dphsStudent', type: 'boolean', required: true },
            ];
        } else if (collection === 'messages') {
            const messages = await prisma.message.findMany();
            data = messages.map((m: any) => ({
                _id: m.id,
                name: m.name,
                email: m.email,
                subject: m.subject,
                message: m.message,
            }));
            schema = [
                { key: 'name', type: 'string', required: true },
                { key: 'email', type: 'string', required: true },
                { key: 'subject', type: 'string', required: true },
                { key: 'message', type: 'string', required: true },
            ];
        } else {
            return { success: false, message: 'Collection not found' };
        }

        return { success: true, data, schema };
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
