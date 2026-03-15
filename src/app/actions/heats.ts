'use server';

import { prisma } from '@/lib/prisma';
import { Event, Heat, RelayHeat, RelayName, RelayTeam } from '@prisma/client';

export async function getHeats(event: '1600 meters' | '400 meters' | '100 meters' | '4x100 meter relay', type: 'community' | 'youth' = 'youth') {
    try {
        if (event === '1600 meters') {
            if (type === 'community') {
                const heats = await prisma.heat.findMany({ where: { eventName: '1600 meters', type: 'community' }, include: { events: { include: { communityAthlete: true } } } });
                return { success: true, heats: heats.map((heat) => ({ ...heat, events: heat.events.filter((event) => !!event.communityAthlete) })) };
            } else if (type === 'youth') {
                const heats = await prisma.heat.findMany({ where: { eventName: '1600 meters', type: 'youth' }, include: { events: { include: { youthAthlete: true } } } });
                return { success: true, heats: heats.map((heat) => ({ ...heat, events: heat.events.filter((event) => !!event.youthAthlete) })) };
            }
        } else if (event === '400 meters') {
            const heats = await prisma.heat.findMany({ where: { eventName: '400 meters' }, include: { events: { include: { youthAthlete: true } } } });

            return { success: true, heats: heats.map((heat) => ({ ...heat, events: heat.events.filter((event) => !!event.youthAthlete) })) };
        } else if (event === '100 meters') {
            const heats = await prisma.heat.findMany({ where: { eventName: '100 meters' }, include: { events: { include: { youthAthlete: true } } } });

            return { success: true, heats: heats.map((heat) => ({ ...heat, events: heat.events.filter((event) => !!event.youthAthlete) })) };
        } else if (event === '4x100 meter relay') {
            return { success: true, heats: [] };
        }

        return { error: 'Invalid event' };
    } catch (error) {
        console.error(error);
        return { error: 'Error fetching heats' };
    }
}

export async function generate1600Heats(type: 'community' | 'youth') {
    try {
        if (type === 'community') {
            const events = (await prisma.event.findMany({ where: { youthAthleteId: null, year: 2026 }, include: { communityAthlete: true } })).filter(
                (event) => !!event && !!event.communityAthlete,
            );
            if (!events || events.length === 0) return { error: 'No community events found' };

            const heat = await prisma.heat.findFirst({ where: { type: 'community' }, include: { events: true } });
            if (!heat) {
                const updatePromises = events.map((e, i) =>
                    prisma.event.update({
                        where: { id: e.id },
                        data: { lane: i + 1 },
                    }),
                );

                await prisma.$transaction(updatePromises);

                const returnHeat = await prisma.heat.create({
                    data: {
                        eventName: '1600 meters',
                        type: 'community',
                        events: {
                            connect: events.map((e) => ({ id: e.id })),
                        },
                        number: 1,
                    },
                    include: { events: { include: { communityAthlete: true } } },
                });

                return { success: true, heats: [returnHeat] };
            } else {
                const updatePromises = events.map((e, i) =>
                    prisma.event.update({
                        where: { id: e.id },
                        data: { lane: i + 1 },
                    }),
                );

                await prisma.$transaction(updatePromises);

                const returnHeat = await prisma.heat.update({
                    where: { id: heat.id },
                    data: {
                        events: {
                            disconnect: heat.events.map((e) => ({ id: e.id })),
                            connect: events.map((e) => ({ id: e.id })),
                        },
                    },
                    include: { events: { include: { communityAthlete: true } } },
                });

                return { success: true, heats: [returnHeat] };
            }
        } else if (type === 'youth') {
            const events = await prisma.event.findMany({ where: { name: '1600 meters', year: 2026, youthAthleteId: { not: null } }, include: { youthAthlete: true } });

            const heats = await prisma.heat.findMany({ where: { eventName: '1600 meters', type: 'youth' } });
            if (heats.length !== 0) {
                heats.forEach(async (heat) => {
                    await prisma.heat.delete({ where: { id: heat.id } });
                });
            }

            const firstHeatEvents = events.filter((e) => ['5th Grade', '6th Grade', '7th Grade', '8th Grade'].includes(e.youthAthlete?.grade || ''));
            const firstUpdatePromises = firstHeatEvents.map((e, i) =>
                prisma.event.update({
                    where: { id: e.id },
                    data: { lane: i + 1 },
                }),
            );

            await prisma.$transaction(firstUpdatePromises);

            const firstHeat = await prisma.heat.create({
                data: {
                    eventName: '1600 meters',
                    type: 'youth',
                    events: {
                        connect: firstHeatEvents.map((e) => ({ id: e.id })),
                    },
                    number: 1,
                },
                include: { events: { include: { youthAthlete: true } } },
            });

            const secondHeatEvents = events.filter((e) => ['4th Grade', '3rd Grade', '2nd Grade', '1st Grade', 'Kindergarten'].includes(e.youthAthlete?.grade || ''));
            const secondUpdatePromises = secondHeatEvents.map((e, i) =>
                prisma.event.update({
                    where: { id: e.id },
                    data: { lane: i + 1 },
                }),
            );

            await prisma.$transaction(secondUpdatePromises);

            const secondHeat = await prisma.heat.create({
                data: {
                    eventName: '1600 meters',
                    type: 'youth',
                    events: {
                        connect: secondHeatEvents.map((e) => ({ id: e.id })),
                    },
                    number: 2,
                },
                include: { events: { include: { youthAthlete: true } } },
            });

            return { success: true, heats: [firstHeat, secondHeat] };
        }

        return { error: 'Invalid type' };
    } catch (error) {
        console.error(error);
        return { error: 'Error generating heats' };
    }
}

export async function publish1600Results(results: { id: string; seconds: number }[], race: 'community' | 'youth') {
    try {
        if (race === 'community') {
            results.forEach(async (e) => {
                const athlete = await prisma.communityAthlete.findUnique({ where: { id: e.id }, include: { race: true } });
                if (!athlete) return;
                if (!athlete.race) return;

                await prisma.event.update({
                    where: { id: athlete.race.id },
                    data: { performance: e.seconds.toString(), unit: 'seconds' },
                });
            });

            return { success: true };
        } else if (race === 'youth') {
            results.forEach(async (e) => {
                await prisma.event.updateMany({
                    where: { AND: [{ youthAthleteId: e.id }, { name: '1600 meters' }] },
                    data: { performance: e.seconds.toString(), unit: 'seconds' },
                });
            });

            return { success: true };
        }

        return { error: 'Invalid race parameter' };
    } catch (error) {
        console.error(error);
        return { error: 'Error publishing results' };
    }
}

export async function generate100400Heats(which: '400' | '100') {
    try {
        const alreadyExisting = await prisma.heat.findMany({ where: { eventName: which === '400' ? '400 meters' : '100 meters' } });
        alreadyExisting.forEach(async (heat) => {
            await prisma.heat.delete({ where: { id: heat.id } });
        });

        const gradeOrder = {
            '8th Grade': 0,
            '7th Grade': 1,
            '6th Grade': 2,
            '5th Grade': 3,
            '4th Grade': 4,
            '3rd Grade': 5,
            '2nd Grade': 6,
            '1st Grade': 7,
            Kindergarten: 8,
        };
        const allEvents = (
            await prisma.event.findMany({ where: { name: which === '400' ? '400 meters' : '100 meters', youthAthleteId: { not: null }, year: 2026 }, include: { youthAthlete: true } })
        )
            // @ts-ignore
            .sort((a, b) => gradeOrder[a.youthAthlete.grade] - gradeOrder[b.youthAthlete.grade]);

        // @ts-ignore
        const heats: (Event | null)[][] = Array.from({ length: Math.ceil(allEvents.length / 9) }, () => []);
        for (let heatNum = 0; heatNum < Math.ceil(allEvents.length / 9); heatNum++) {
            for (let lane = 0; lane < 9; lane++) {
                const index = heatNum * 9 + lane;
                if (index < allEvents.length && allEvents[index].youthAthlete) heats[heatNum].push(allEvents[index]);
            }
        }

        const organizedHeats: any[] = [];

        heats.forEach(async (heat, index) => {
            heat.filter((e) => e !== null).forEach(
                async (e, i) =>
                    await prisma.event.update({
                        where: { id: e.id },
                        data: { lane: i + 1 },
                    }),
            );

            const createdHeat = await prisma.heat.create({
                data: {
                    eventName: which === '400' ? '400 meters' : '100 meters',
                    type: 'youth',
                    events: {
                        connect: heat.filter((e) => e !== null).map((e) => ({ id: e.id })),
                    },
                    number: index + 1,
                },
                include: { events: { include: { youthAthlete: true } } },
            });

            organizedHeats.push(createdHeat);
        });

        return { success: true, heats: organizedHeats };
    } catch (error) {
        console.error(error);
        return { error: 'Error generating heats.' };
    }
}

export async function deleteLane100400Heats(which: '400' | '100', heatNumber: number, laneNumber: number) {
    try {
        const heats = await prisma.heat.findMany({ where: { eventName: which === '400' ? '400 meters' : '100 meters', number: heatNumber }, include: { events: true } });
        if (heats.length === 0) return { error: 'No heats found' };
        if (heats.length > 1) return { error: 'More than 1 heat found' };
        const heat = heats[0];

        const laneEvent = heat.events.find((e) => e.lane === laneNumber);
        if (!laneEvent) return { error: 'No event found in that lane' };

        await prisma.heat.update({
            where: { id: heat.id },
            data: {
                events: {
                    disconnect: { id: laneEvent.id },
                },
            },
        });

        await prisma.event.update({ where: { id: laneEvent.id }, data: { lane: null } });

        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: 'Error deleting lane' };
    }
}

export async function updateLane100400Heats(which: '400' | '100', heatNumber: number, laneNumber: number, bib: number) {
    try {
        const heats = await prisma.heat.findMany({ where: { eventName: which === '400' ? '400 meters' : '100 meters', number: heatNumber }, include: { events: true } });
        if (heats.length === 0) return { error: 'No heats found' };
        if (heats.length > 1) return { error: 'More than 1 heat found' };
        const heat = heats[0];

        const laneEvent = heat.events.find((e) => e.lane === laneNumber);
        if (laneEvent) return { error: 'Lane already occupied' };

        const athlete = await prisma.youthAthlete.findUnique({ where: { bibNumber: bib } });
        if (!athlete) return { error: 'No athlete with that bib number found' };

        const athleteEvent = await prisma.event.findMany({ where: { youthAthleteId: athlete.id, name: which === '400' ? '400 meters' : '100 meters' }, include: { heat: true } });
        if (athleteEvent.length === 0) return { error: 'No event found for that athlete' };
        if (athleteEvent.length > 1) return { error: 'More than 1 event found for that athlete' };
        const event = athleteEvent[0];
        if (event.heat) {
            await prisma.heat.update({
                where: { id: event.heat.id },
                data: {
                    events: {
                        disconnect: { id: event.id },
                    },
                },
            });
        }

        await prisma.event.update({
            where: { id: event.id },
            data: {
                heat: { connect: { id: heat.id } },
                lane: laneNumber,
            },
        });

        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: 'Error updating lane' };
    }
}

export async function add100400Heat(which: '400' | '100') {
    try {
        const heats = await prisma.heat.findMany({ where: { eventName: which === '400' ? '400 meters' : '100 meters' } });
        const maxHeatNumber = Math.max(...heats.map((h) => h.number));

        await prisma.heat.create({
            data: {
                eventName: which === '400' ? '400 meters' : '100 meters',
                type: 'youth',
                number: maxHeatNumber + 1,
            },
        });

        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: 'Error adding heat' };
    }
}

export async function publish100400Results(which: '400' | '100', results: { id: string; seconds: number }[]) {
    try {
        results.forEach(async (e) => {
            await prisma.event.updateMany({
                where: { AND: [{ youthAthleteId: e.id }, { name: which === '400' ? '400 meters' : '100 meters' }] },
                data: { performance: e.seconds.toString(), unit: 'seconds' },
            });
        });

        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: 'Error publishing results' };
    }
}

export async function findCommunityAthletesFromBib(bibNumbers: number[]) {
    try {
        const athletes = await prisma.communityAthlete.findMany({ where: { bibNumber: { in: bibNumbers } } });

        return { success: true, athletes };
    } catch (error) {
        console.error(error);
        return { error: 'Error finding athlete' };
    }
}

export async function findYouthAthletesFromBib(bibNumbers: number[]) {
    try {
        const athletes = await prisma.youthAthlete.findMany({ where: { bibNumber: { in: bibNumbers } } });

        return { success: true, athletes };
    } catch (error) {
        console.error(error);
        return { error: 'Error finding athlete' };
    }
}

export async function get4x100Heats() {
    try {
        const heats = await prisma.relayHeat.findMany({ include: { relayTeams: true } });

        return { success: true, heats };
    } catch (error) {
        console.error(error);
        return { error: 'Error getting heats' };
    }
}

export async function generate4x100Heats() {
    try {
        const heats = await prisma.relayHeat.findMany({ include: { relayTeams: true } });
        if (heats.length > 0) {
            heats.forEach(async (heat) => {
                await prisma.relayHeat.delete({ where: { id: heat.id } });
            });
        }

        const entries = await prisma.event.findMany({ where: { name: '4x100 meter relay' } });

        const numTeams = Math.ceil(entries.length / 4);
        const numTeamsPerHeat = 7;
        const numHeats = Math.ceil(numTeams / numTeamsPerHeat);

        const teamNames: RelayName[] = [
            'terrific_tigers',
            'great_gazelles',
            'super_starfishes',
            'fast_falcons',
            'dancing_dolphins',
            'bright_bisons',
            'cheerful_cheetahs',
            'brave_bears',
            'lightning_leopards',
            'racing_ravens',
            'turbo_tucans',
            'rampaging_rhinos',
            'golden_geckos',
            'rapid_rabbits',
            'swift_swans',
        ];

        const relayHeats: RelayHeat[] = [];
        const relayTeams: RelayTeam[] = [];

        for (let i = 0; i < numHeats; i++) {
            const heat = await prisma.relayHeat.create({
                data: {
                    number: i + 1,
                },
            });

            relayHeats.push(heat);
        }
        
        for (let i = 0; i < numTeams; i++) {
            const heat = Math.floor(i / 7);

            const team = await prisma.relayTeam.create({
                data: {
                    name: teamNames[i],
                    performance: '',
                    unit: '',
                    lane: (i % 7) + 1,
                    year: 2026,
                    relayHeat: {
                        connect: { id: relayHeats[heat].id },
                    },
                },
            });

            relayTeams.push(team);
        }

        const newRelayHeats = await prisma.relayHeat.findMany({ include: { relayTeams: true } });

        return { success: true, heats: newRelayHeats };
    } catch (error) {
        console.error(error);
        return { error: 'Error generating heats' };
    }
}

export async function update4x100Lane(heatNumber: number, laneNumber: number, name: RelayName) {
    try {
        const heats = await prisma.relayHeat.findMany({ where: { number: heatNumber }, include: { relayTeams: true } });
        if (heats.length === 0) return { error: 'No heats found' };
        if (heats.length > 1) return { error: 'More than 1 heat found' };
        const heat = heats[0];

        const relayTeam = await prisma.relayTeam.findUnique({ where: { name }, include: { relayHeat: true } });
        if (relayTeam) {
            await prisma.relayHeat.update({
                where: { id: relayTeam.relayHeatId || relayTeam.relayHeat?.id },
                data: {
                    relayTeams: {
                        disconnect: { id: relayTeam.id },
                    },
                },
            });

            await prisma.relayTeam.update({
                where: { id: relayTeam.id },
                data: {
                    relayHeat: { connect: { id: heat.id } },
                    lane: laneNumber,
                },
            });
        } else {
            await prisma.relayTeam.create({
                data: {
                    relayHeat: { connect: { id: heat.id } },
                    name,
                    performance: '',
                    unit: '',
                    year: 2026,
                    lane: laneNumber,
                },
            });
        }

        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to update lane' };
    }
}

export async function delete4x100Lane(heatNumber: number, laneNumber: number) {
    try {
        const heats = await prisma.relayHeat.findMany({ where: { number: heatNumber }, include: { relayTeams: true } });
        if (heats.length === 0) return { error: 'No heats found' };
        if (heats.length > 1) return { error: 'More than 1 heat found' };
        const heat = heats[0];

        const teamLane = heat.relayTeams.find((e) => e.lane === laneNumber);
        if (!teamLane) return { error: 'No event found in that lane' };

        await prisma.relayHeat.update({
            where: { id: heat.id },
            data: {
                relayTeams: {
                    disconnect: { id: teamLane.id },
                },
            },
        });

        await prisma.relayTeam.update({ where: { id: teamLane.id }, data: { lane: null } });

        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: 'Error deleting lane' };
    }
}

export async function publish4x100Results(results: { id: string; seconds: number }[]) {
    try {
        results.forEach(async (e) => {
            await prisma.relayTeam.updateMany({
                where: { AND: [{ id: e.id }] },
                data: { performance: e.seconds.toString(), unit: 'seconds' },
            });
        });

        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: 'Error publishing results' };
    }
}

export async function get4x100Results() {
    try {
        const results = await prisma.relayTeam.findMany();

        return { success: true, results };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to get results' };
    }
}
