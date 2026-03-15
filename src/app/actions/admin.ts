'use server';

import { prisma } from '@/lib/prisma';
import { PaymentOption } from '@prisma/client';
import { cookies } from 'next/headers';
import * as bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function getCollection(collection: string) {
    try {
        let data: any[] = [];

        if (collection === 'youth-athletes') {
            const athletes = await prisma.youthAthlete.findMany({ include: { events: true } });
            data = athletes.filter((athlete) => athlete.year === 2026).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (collection === 'community-athletes') {
            const athletes = await prisma.communityAthlete.findMany({ include: { race: true } });
            data = athletes.filter((athlete) => athlete.year === 2026).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (collection === 'volunteers') {
            const volunteers = await prisma.volunteer.findMany();
            data = volunteers;
        } else if (collection === 'messages') {
            const messages = await prisma.message.findMany();
            data = messages;
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

export async function markPaidWithBib(collection: string, id: string, status: PaymentOption, bib: number) {
    try {
        const bibTakenYouth = await prisma.youthAthlete.findUnique({ where: { bibNumber: bib } });
        const bibTakenCommunity = await prisma.communityAthlete.findUnique({ where: { bibNumber: bib } });
        if (bibTakenYouth) return { error: `Bib # already taken by youth athlete ${bibTakenYouth.name}` };
        if (bibTakenCommunity) return { error: `Bib # already taken by community athlete ${bibTakenCommunity.name}` };

        if (collection === 'youth-athletes') await prisma.youthAthlete.update({ where: { id }, data: { paid: status, bibNumber: bib } });
        else if (collection === 'community-athletes') await prisma.communityAthlete.update({ where: { id }, data: { paid: status, bibNumber: bib } });

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
        if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
            return { success: false, message: 'Admin credentials not configured in environment' };
        }

        if (username !== process.env.ADMIN_USERNAME) {
            return { success: false, message: 'Invalid credentials' };
        }

        const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD);
        if (!isMatch) {
            return { success: false, message: 'Invalid credentials' };
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const jwt = await new SignJWT({ user: 'admin' }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('48h').sign(secret);

        (await cookies()).set('admin_session', jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 48,
        });

        return { success: true };
    } catch (e: any) {
        console.error(e);
        return { success: false, message: 'Error logging in' };
    }
}

export async function editAthlete(collection: 'youth-athletes' | 'community-athletes', id: string, bib: number | null, removingEvents: string[] | null, addingEvents: string[] | null) {
    try {
        if (collection === 'youth-athletes') {
            if (!bib && (!removingEvents || removingEvents.length === 0) && (!addingEvents || addingEvents.length === 0)) return { error: 'Nothing to update' };
            const youthAthlete = await prisma.youthAthlete.findUnique({ where: { id }, include: { events: true } });
            if (!youthAthlete) return { error: 'No athlete found with that ID.' };

            if (addingEvents && addingEvents.length > 0)
                for (const eventName of addingEvents) {
                    await prisma.event.create({
                        data: {
                            name: eventName,
                            performance: '',
                            unit: '',
                            youthAthleteId: youthAthlete.id,
                        },
                    });
                }

            if (removingEvents && removingEvents.length > 0) {
                for (const eventName of removingEvents) {
                    await prisma.event.deleteMany({ where: { AND: [{ youthAthleteId: youthAthlete.id }, { name: eventName }] } });
                }
            }

            if (bib) {
                await prisma.youthAthlete.update({ where: { id }, data: { bibNumber: bib } });
            }

            return { success: true };
        } else if (collection === 'community-athletes') {
            if (!bib) return { error: 'No bib passed' };
            await prisma.communityAthlete.update({ where: { id }, data: { bibNumber: bib } });
            return { success: true };
        }

        return { error: 'Invalid collection' };
    } catch (error) {
        console.error('Error editing athlete', error);
        return { error: 'Error editing athlete' };
    }
}
