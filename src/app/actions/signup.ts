'use server';

import { prisma } from '@/lib/prisma';

console.log('file loaded');

export async function submitYouthParticipants(participants: any[]) {
    try {
        for (const p of participants) {
            const name = `${p.firstName} ${p.lastName}`;
            const dob = new Date(`${p.birthYear}-${p.birthMonth}-${p.birthDay}`);

            const youth = await prisma.youthAthlete.create({
                data: {
                    name,
                    grade: p.gradeLevel,
                    dob,
                },
            });

            for (const eventName of p.events) {
                await prisma.event.create({
                    data: {
                        name: eventName,
                        performance: '',
                        unit: '',
                        youthAthleteId: youth.id,
                    },
                });
            }
        }
        return { success: true };
    } catch (e: any) {
        console.error(e);
        return { success: false, message: 'Could not sign up.' };
    }
}

export async function submitCommunityParticipant(participant: any) {
    try {
        const name = `${participant.firstName} ${participant.lastName}`;
        const dob = new Date(`${participant.birthYear}-${participant.birthMonth}-${participant.birthDay}`);

        const community = await prisma.communityAthlete.create({
            data: {
                name,
                email: participant.email,
                dob,
            },
        });

        const race = await prisma.event.create({
            data: {
                name: '1600 meters',
                performance: '',
                unit: '',
            },
        });

        await prisma.communityAthlete.update({
            where: { id: community.id },
            data: { raceId: race.id },
        });

        return { success: true };
    } catch (e: any) {
        console.error(e);
        return { success: false, message: 'Could not sign up.' };
    }
}

export async function submitVolunteer(volunteer: any) {
    try {
        const name = `${volunteer.firstName} ${volunteer.lastName}`;
        const dob = new Date(`${volunteer.birthYear}-${volunteer.birthMonth}-${volunteer.birthDay}`);

        await prisma.volunteer.create({
            data: {
                name,
                email: volunteer.email,
                dob,
                dphsStudent: volunteer.dphsStudent,
            },
        });

        return { success: true };
    } catch (e: any) {
        console.error(e);
        return { success: false, message: 'Could not sign up.' };
    }
}
