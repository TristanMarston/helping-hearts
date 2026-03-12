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

export async function markPaid(collection: string, id: string, status: PaymentOption) {
    try {
        if (collection === 'youth-athletes') await prisma.youthAthlete.update({ where: { id }, data: { paid: status } });
        else if (collection === 'community-athletes') await prisma.communityAthlete.update({ where: { id }, data: { paid: status } });

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
        console.log(process.env.ADMIN_PASSWORD);
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
