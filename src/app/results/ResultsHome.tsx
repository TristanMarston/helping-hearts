'use client';

import { getPublicResults } from '@/app/actions/results';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { isAfter } from 'date-fns';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { get4x100Results } from '../actions/heats';
import { RelayTeam } from '@prisma/client';

type Result = {
    id: string;
    athleteId: string;
    athleteName: string;
    name: string;
    performance: string | null;
    unit: string | null;
    dob: Date;
    year: number;
    position?: number;
};

export type YouthAthlete = {
    id: string;
    name: string;
    dob: Date;
    events: Result[];
    year: number;
};

type CommunityAthlete = {
    id: string;
    name: string;
    dob: Date;
    race: Result;
    year: number;
};

type YouthResults = {
    '2025': {
        [K in EventKeys]: Result[];
    };
    '2026': {
        [K in EventKeys]: Result[];
    };
};

type CommunityResults = {
    '2025': Result[];
    '2026': Result[];
};

type EventKeys = '100m' | '400m' | '800m' | '1600m' | '4x100m' | 'softball-throw' | 'long-jump' | 'shot-put';

const getEventKey = (event: string) => {
    if (event.indexOf(' meters') !== -1) return event.replace(' meters', 'm');
    if (event === '4x100 meter relay') return '4x100m';
    return event.replaceAll(' ', '-');
};

const ResultsContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isDatePast = isAfter(new Date(), new Date('2026-03-15T05:00:00'));

    const [raceType, setRaceType] = useState<'youth' | 'community'>((searchParams.get('race') as 'youth' | 'community') || 'youth');
    const [sortBy, setSortBy] = useState<'performance' | 'age'>((searchParams.get('sort') as 'performance' | 'age') || 'performance');
    const [year, setYear] = useState(searchParams.get('year') || (isDatePast ? '2026' : '2025'));
    const [query, setQuery] = useState('');

    const youthAthletes = useRef<YouthAthlete[]>([]);
    const communityAthletes = useRef<CommunityAthlete[]>([]);

    const [filteredYouthResults, setFilteredYouthResults] = useState<YouthResults | null>(null);
    const [sortedYouthResults, setSortedYouthResults] = useState<YouthResults | null>(null);

    const [filteredCommunityResults, setFilteredCommunityResults] = useState<CommunityResults | null>(null);
    const [sortedCommunityResults, setSortedCommunityResults] = useState<CommunityResults | null>(null);

    const [response, setResponse] = useState<'loading' | 'success' | 'failed'>('loading');

    const [eventView, setEventView] = useState('all events');
    const events = ['100 meters', '400 meters', '800 meters', '1600 meters', '4x100 meter relay', 'softball throw', 'shot put', 'long jump'];

    const adjustSearchParams = (race: 'youth' | 'community', sort: 'performance' | 'age', year: string, event: string) => {
        const createQueryString = (names: string[], values: string[]) => {
            const params = new URLSearchParams(searchParams.toString());
            names.forEach((name, index) => {
                params.set(name, values[index]);
            });
            return params.toString();
        };
        const newQueryString = createQueryString(['race', 'sort', 'year', 'event'], [race, sort, year, event.replaceAll('all events', 'all')]);
        if (newQueryString !== searchParams.toString()) {
            router.push(`?${newQueryString}`);
        }
    };

    const sortYouthResults = useCallback(
        (passedAthletes?: YouthAthlete[], relayResults?: RelayTeam[]) => {
            let athletes = [...youthAthletes.current];
            if (passedAthletes && passedAthletes.length > youthAthletes.current.length) {
                athletes = [...passedAthletes];
            }

            const allEvents: Result[] = athletes
                .filter((athlete: YouthAthlete) => athlete.year.toString() === year)
                .reduce(
                    (total: Result[], athlete: YouthAthlete) =>
                        total.concat(
                            athlete.events.map((event) => ({
                                id: event.id,
                                athleteId: event.athleteId,
                                athleteName: event.athleteName,
                                dob: event.dob,
                                name: event.name,
                                performance: event.performance,
                                unit: event.unit,
                                year: event.year,
                            })),
                        ),
                    [],
                );

            const filteredResults: YouthResults = {
                '2025': {
                    '100m': [],
                    '400m': [],
                    '800m': [],
                    '1600m': [],
                    '4x100m': [],
                    'softball-throw': [],
                    'long-jump': [],
                    'shot-put': [],
                },
                '2026': {
                    '100m': [],
                    '400m': [],
                    '800m': [],
                    '4x100m': [],
                    '1600m': [],
                    'softball-throw': [],
                    'long-jump': [],
                    'shot-put': [],
                },
            };

            allEvents.forEach((event: Result) => filteredResults[event.year.toString() as keyof YouthResults][getEventKey(event.name) as EventKeys].push(event));

            Object.keys(filteredResults).forEach((year) =>
                Object.keys(filteredResults[year as keyof YouthResults]).forEach((event) => {
                    const yearKey = year as keyof YouthResults;
                    const eventKey = event as EventKeys;
                    filteredResults[yearKey][eventKey] = filteredResults[yearKey][eventKey]
                        .sort((a, b) => {
                            const scoreA = Number(a.performance);
                            const scoreB = Number(b.performance);
                            if (sortBy === 'age') {
                                const ageDifference = new Date(a.dob).getTime() - new Date(b.dob).getTime();
                                if (ageDifference !== 0) return ageDifference;
                                return scoreA - scoreB;
                            } else {
                                const performanceDifference = a.unit === 'seconds' ? scoreA - scoreB : scoreB - scoreA;
                                if (performanceDifference !== 0) return performanceDifference;
                                return new Date(a.dob).getTime() - new Date(b.dob).getTime();
                            }
                        })
                        .map((item, index) => ({ ...item, position: index + 1 }));
                }),
            );

            if (relayResults) {
                const relayFilteredResults: Result[] = relayResults
                    .filter((team) => team.performance)
                    .sort((a, b) => parseFloat(a.performance) - parseFloat(b.performance))
                    .map((team, index) => ({
                        id: team.id,
                        athleteId: '',
                        athleteName: team.name,
                        name: '4x100 meter relay',
                        performance: team.performance,
                        unit: team.unit,
                        dob: new Date(),
                        year: 2026,
                        position: index + 1,
                    }));

                filteredResults['2026']['4x100m'] = [...relayFilteredResults];
            }

            setFilteredYouthResults(filteredResults);
            setSortedYouthResults(filteredResults);
        },
        [sortBy, year, youthAthletes],
    );

    const sortCommunityResults = useCallback(
        (passedAthletes?: CommunityAthlete[]) => {
            let athletes = [...communityAthletes.current];
            if (passedAthletes && passedAthletes.length > communityAthletes.current.length) {
                athletes = [...passedAthletes];
            }
            const allRaces: Result[] = athletes.map((athlete) => athlete.race);
            const filteredRaces = {
                '2025': allRaces
                    .filter((race) => race.year === 2025)
                    .sort((a, b) => {
                        const scoreA = Number(a.performance);
                        const scoreB = Number(b.performance);
                        if (sortBy === 'age') {
                            const ageDiff = new Date(a.dob).getTime() - new Date(b.dob).getTime();
                            return ageDiff !== 0 ? ageDiff : scoreA - scoreB;
                        } else {
                            const perfDiff = scoreA - scoreB;
                            return perfDiff !== 0 ? perfDiff : new Date(a.dob).getTime() - new Date(b.dob).getTime();
                        }
                    })
                    .map((race, index) => ({ ...race, position: index + 1 })),
                '2026': allRaces
                    .filter((race) => race.year === 2026)
                    .sort((a, b) => {
                        const scoreA = Number(a.performance);
                        const scoreB = Number(b.performance);
                        if (sortBy === 'age') {
                            const ageDiff = new Date(a.dob).getTime() - new Date(b.dob).getTime();
                            return ageDiff !== 0 ? ageDiff : scoreA - scoreB;
                        } else {
                            const perfDiff = scoreA - scoreB;
                            return perfDiff !== 0 ? perfDiff : new Date(a.dob).getTime() - new Date(b.dob).getTime();
                        }
                    })
                    .map((race, index) => ({ ...race, position: index + 1 })),
            };

            setFilteredCommunityResults(filteredRaces);
            setSortedCommunityResults(filteredRaces);
        },
        [sortBy, year, communityAthletes],
    );

    const getYouthResults = async () => {
        try {
            const res = await getPublicResults('youth');
            if (res.success) {
                setResponse('success');
                const formattedAthletes: YouthAthlete[] = (res.data || []).map((athlete: any) => ({
                    id: athlete.id,
                    name: athlete.name,
                    year: athlete.year,
                    dob: athlete.dob,
                    events: athlete.events.map((result: any) => ({
                        id: result.id,
                        name: result.name,
                        dob: athlete.dob,
                        performance: result.performance,
                        unit: result.unit,
                        year: result.year,
                        athleteId: result.athleteId,
                        athleteName: athlete.name,
                    })),
                }));

                return formattedAthletes;
            } else {
                setResponse('failed');
                console.error('[ResultsContent] getPublicResults("youth") failed:', res.message);
                return null;
            }
        } catch (error) {
            console.error('[ResultsContent] getPublicResults("youth") caught exception:', error);
            setResponse('failed');
            return null;
        }
    };

    const getCommunityResults = async (): Promise<CommunityAthlete[] | null> => {
        try {
            const res = await getPublicResults('community');
            if (res.success) {
                setResponse('success');
                const formattedAthletes: CommunityAthlete[] = (res.data || []).map((athlete: any) => ({
                    id: athlete.id,
                    name: athlete.name,
                    year: athlete.year,
                    dob: athlete.dob,
                    race: {
                        name: athlete.race.name,
                        year: athlete.race.year,
                        id: athlete.race.id,
                        athleteId: athlete.id,
                        athleteName: athlete.name,
                        performance: athlete.race.performance,
                        unit: athlete.race.unit,
                        dob: athlete.dob,
                    },
                }));

                return formattedAthletes;
            } else {
                setResponse('failed');
                console.error('[ResultsContent] getPublicResults("community") failed:', res.message);
                return null;
            }
        } catch (error) {
            console.error('[ResultsContent] getPublicResults("community") caught exception:', error);
            setResponse('failed');
            return null;
        }
    };

    useEffect(() => {
        if (query.trim() === '') {
            if (raceType === 'youth') setFilteredYouthResults(sortedYouthResults);
            else setFilteredCommunityResults(sortedCommunityResults);
            return;
        } else {
            if (raceType === 'youth' && sortedYouthResults) {
                const filtered: YouthResults = JSON.parse(JSON.stringify(sortedYouthResults));
                Object.keys(filtered).forEach((year) =>
                    Object.keys(filtered[year as keyof YouthResults]).forEach((event) => {
                        filtered[year as keyof YouthResults][event as EventKeys] = filtered[year as keyof YouthResults][event as EventKeys].filter((athlete) =>
                            athlete.athleteName.toLowerCase().includes(query.toLowerCase()),
                        );
                    }),
                );
                setFilteredYouthResults(filtered);
            } else if (sortedCommunityResults) {
                const filtered: CommunityResults = JSON.parse(JSON.stringify(sortedCommunityResults));
                Object.keys(filtered).forEach((year) => {
                    filtered[year as keyof CommunityResults] = filtered[year as keyof CommunityResults].filter((athlete) =>
                        athlete.athleteName.toLowerCase().includes(query.toLowerCase()),
                    );
                });
                setFilteredCommunityResults(filtered);
            }
        }
    }, [query, sortedYouthResults, sortedCommunityResults]);

    useEffect(() => {
        if (youthAthletes.current.length > 0 || communityAthletes.current.length > 0) {
            sortCommunityResults();
            sortYouthResults();
        }
    }, [sortBy, year, raceType, eventView]);

    useEffect(() => {
        if (youthAthletes.current.length === 0 && communityAthletes.current.length === 0) return;

        const fetchResults = async () => {
            setResponse('loading');
            if (raceType === 'youth') {
                const res = await getYouthResults();
                const relayResults = await get4x100Results();
                if (res) {
                    youthAthletes.current = res;
                    sortYouthResults(undefined, relayResults.results);
                }
            } else if (raceType === 'community') {
                const res = await getCommunityResults();
                if (res) {
                    communityAthletes.current = res;
                    sortCommunityResults();
                }
            }
        };

        fetchResults();
    }, [raceType]);

    useEffect(() => {
        const fetchInitialData = async () => {
            let race = searchParams.get('race');
            if (race === 'youth' || race === 'community') {
                setRaceType(race);
            } else race = 'youth';

            let sort = searchParams.get('sort');
            if (sort === 'performance' || sort === 'age') {
                setSortBy(sort);
            } else sort = 'performance';

            let event = searchParams.get('event')?.replaceAll('00m', '00 meters').replaceAll('all', 'all events');
            if (event === 'all events' || events.includes(event || '')) {
                setEventView(event || 'all events');
            }

            if (race === 'youth') {
                const results = await getYouthResults();
                const relayResults = await get4x100Results();
                if (results) {
                    youthAthletes.current = [...results];
                    sortYouthResults([...results], relayResults.results);
                }
            } else if (race === 'community') {
                const results = await getCommunityResults();
                if (results) {
                    communityAthletes.current = [...results];
                    sortCommunityResults([...results]);
                }
            }
        };

        fetchInitialData();
    }, []);

    const titleText = isDatePast
        ? 'On March 15th, 2026, we hosted our fourth annual track & field event fundraiser. Here were the results:'
        : `On March 1st, 2025, we hosted our third annual track & field event fundraiser. Stay tuned for the 2026 results! Check out last year's results:`;

    return (
        <div className='w-full flex flex-col items-center mt-16 mid-mobile:mt-20'>
            <div className='w-full max-w-[1280px] flex flex-col px-5 my-8'>
                <h1 className={`font-sour-gummy font-extrabold text-black text-left text-4xl mb-2`}>Results</h1>
                {response !== 'failed' ? (
                    <div className={`font-fredoka font-normal w-full`}>
                        <p>{titleText}</p>
                        <div className='w-full rounded-full flex mt-4 bg-background shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] p-1'>
                            {['youth', 'community'].map((tab) => (
                                <button
                                    key={tab}
                                    className={`relative cursor-pointer flex-1 font-fredoka font-semibold rounded-full flex justify-center items-center text-sm mid-mobile:text-base p-1.5 transition-colors duration-300 z-10 transition-all ${
                                        raceType === tab ? 'text-white' : 'text-primary hover:text-primary-dark hover:bg-background-secondary'
                                    }`}
                                    onClick={() => {
                                        adjustSearchParams(tab as 'youth' | 'community', sortBy, year, eventView);
                                        setRaceType(tab as 'youth' | 'community');
                                    }}
                                >
                                    {raceType === tab && (
                                        <motion.div
                                            layoutId='activeTab'
                                            className='absolute inset-0 bg-primary rounded-full -z-10'
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <span className='capitalize'>{tab}</span>
                                </button>
                            ))}
                        </div>
                        <span className='flex relative mt-4'>
                            <input
                                placeholder={'Athlete Name'}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className={`placeholder:text-gray-500 outline-none w-full bg-background text-secondary pl-10 pr-2 py-2 rounded-xl border border-gray-100 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                            />
                            <Search className={cn('absolute left-3 top-3 opacity-80 w-5 h-5', query.trim().length > 0 ? 'text-black' : 'text-gray-500')} />
                        </span>
                        <hr className='mt-3 mb-1 text-gray-200' />
                        {raceType === 'youth' && (
                            <Select
                                onValueChange={(value) => {
                                    setEventView(value);
                                }}
                                defaultValue={searchParams.get('event')?.replaceAll('all', 'all events').replaceAll('00m', '00 meters') || 'all events'}
                            >
                                <SelectTrigger
                                    className={`font-fredoka font-normal ${
                                        eventView !== '' ? 'text-black' : 'text-gray-500'
                                    } mt-2 px-4 py-3 ring-0 w-full h-11 text-base bg-background hover:bg-background-secondary transition-all cursor-pointer appearance-none rounded-[10px] border border-gray-100 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                                >
                                    <SelectValue placeholder='all events' className={`overflow-ellipsis text-gray-400`}>
                                        {eventView !== '' ? eventView : <span>all events</span>}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent
                                    className={`font-fredoka font-normal bg-background rounded-[13px] border border-gray-100 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                                >
                                    <SelectGroup>
                                        {['all events', ...events].map((event, index) => (
                                            <SelectItem key={event + index} value={event} className={`px-7 cursor-pointer hover:bg-background-light transition-all text-base`}>
                                                {event}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}

                        <Select
                            onValueChange={(value) => {
                                setSortBy(value === 'performance' || value === 'age' ? (value as 'performance' | 'age') : 'performance');
                            }}
                            defaultValue={searchParams.get('sort') || 'performance'}
                        >
                            <SelectTrigger
                                className={`font-fredoka font-normal text-black mt-2 px-4 py-3 ring-0 w-full h-11 text-base bg-background hover:bg-background-secondary transition-all cursor-pointer appearance-none rounded-[10px] border border-gray-100 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                            >
                                <SelectValue placeholder='Events' className={`overflow-ellipsis text-gray-400`}>
                                    sort by {sortBy}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent
                                className={`font-fredoka font-normal bg-background rounded-[13px] border border-gray-100 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                            >
                                <SelectGroup>
                                    {['performance', 'age'].map((event, index) => (
                                        <SelectItem key={event + index} value={event} className={`px-7 cursor-pointer hover:bg-background-light transition-all text-base`}>
                                            sort by {event}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select
                            onValueChange={(value: string) => {
                                setYear(value);
                            }}
                            defaultValue={searchParams.get('year') || 'year'}
                        >
                            <SelectTrigger
                                className={`font-fredoka font-normal text-black mt-2 px-4 py-3 ring-0 w-full h-11 text-base bg-background hover:bg-background-secondary transition-all cursor-pointer appearance-none rounded-[10px] border border-gray-100 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                            >
                                <SelectValue placeholder='Year' className={`overflow-ellipsis text-gray-400`}>
                                    {year}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent
                                className={`font-fredoka font-normal bg-background rounded-[13px] border border-gray-100 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                            >
                                <SelectGroup>
                                    {['2025', '2026'].map((event, index) => (
                                        <SelectItem key={event + index} value={event} className={`px-7 cursor-pointer hover:bg-background-light transition-all text-base`}>
                                            {event}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <div
                            className={cn(
                                'gap-2 p-3 mt-4 rounded-[18px] shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]',
                                response === 'success' && ((raceType === 'community' && filteredCommunityResults) || (raceType === 'youth' && filteredYouthResults))
                                    ? raceType === 'community' ||
                                      eventView !== 'all events' ||
                                      (raceType === 'youth' &&
                                          filteredYouthResults &&
                                          Object.keys(filteredYouthResults[year as keyof YouthResults]).reduce(
                                              (acc, event) => (filteredYouthResults[year as keyof YouthResults][event as EventKeys].length > 0 ? acc + 1 : acc),
                                              0,
                                          )) === 1
                                        ? 'tablet:grid grid-cols-1'
                                        : 'tablet:grid grid-cols-2'
                                    : 'flex flex-col',
                            )}
                        >
                            {response === 'success' ? (
                                raceType === 'community' && filteredCommunityResults ? (
                                    filteredCommunityResults[year as keyof CommunityResults].reduce((acc, result) => acc + (result.performance ? 1 : 0), 0) > 0 ? (
                                        <>
                                            <div className='px-2 py-1 phone:text-lg uppercase font-bold border-b-primary border-b-2 text-primary w-full'>1 MILE RACE</div>
                                            {filteredCommunityResults &&
                                                filteredCommunityResults[year as keyof CommunityResults].map((result, index) => (
                                                    <CommunityAthleteCard key={result.athleteId} index={index} {...result} />
                                                ))}
                                        </>
                                    ) : (
                                        <div className='px-2 py-1 text-gray-600'>No results have been posted yet for {year}. Please check later!</div>
                                    )
                                ) : filteredYouthResults ? (
                                    Object.keys(filteredYouthResults[year as keyof YouthResults]).reduce(
                                        (acc, event) =>
                                            acc + filteredYouthResults[year as keyof YouthResults][event as EventKeys].filter((result) => result.performance !== null).length,
                                        0,
                                    ) > 0 ? (
                                        events
                                            .filter((event) => (eventView === 'all events' ? true : event === eventView))
                                            .map((event) =>
                                                filteredYouthResults[year as keyof YouthResults][getEventKey(event) as EventKeys].length > 0 ? (
                                                    <div key={event} className='w-full flex flex-col gap-1'>
                                                        <div className='px-2 py-1 phone:text-lg uppercase font-bold border-b-primary border-b-2 text-primary w-full'>{event}</div>
                                                        {filteredYouthResults[year as keyof YouthResults][getEventKey(event) as EventKeys]
                                                            .sort((a, b) => (a.position || 0) - (b.position || 0))
                                                            .map((result, index) => (
                                                                <YouthAthleteCard key={result.id} index={index} {...result} />
                                                            ))}
                                                    </div>
                                                ) : (
                                                    eventView !== 'all events' && (
                                                        <div className='w-full flex flex-col gap-1'>
                                                            <div className='px-2 py-1 phone:text-lg uppercase font-bold border-b-primary border-b-2 text-primary w-full'>
                                                                {eventView}
                                                            </div>
                                                            <div className='px-2 py-1 text-gray-600'>No results found</div>
                                                        </div>
                                                    )
                                                ),
                                            )
                                    ) : (
                                        <div className='px-2 py-1 text-gray-600'>No results have been posted yet for {year}. Please check later!</div>
                                    )
                                ) : (
                                    <></>
                                )
                            ) : (
                                response === 'loading' && (
                                    <div className='w-full grid place-items-center p-4'>
                                        <div className='loader w-12 h-12'></div>
                                    </div>
                                )
                            )}
                        </div>

                        {/* <div
                            key={raceType}
                            className={`${
                                response === 'success' &&
                                `tablet:grid ${
                                    eventView !== 'all events' ||
                                    raceType === 'community' ||
                                    (raceType === 'youth' && filteredYouthResults.every((result) => result.event === filteredYouthResults[0]?.event))
                                        ? 'grid-cols-1'
                                        : 'grid-cols-2'
                                }`
                            } flex flex-col gap-2 mt-4 p-2 rounded-lg border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                        >
                            {response === 'success' ? (
                                raceType === 'youth' ? (
                                    filteredYouthResults.length > 0 ? (
                                        events
                                            .filter((event) => (eventView === 'all events' ? true : event === eventView))
                                            .map((event) =>
                                                filteredYouthResults.filter((result) => result.event === event).length > 0 ? (
                                                    <div key={event} className='w-full flex flex-col gap-1'>
                                                        <div className='px-2 py-1 phone:text-lg uppercase font-bold border-b-primary border-b-2 text-primary w-full'>{event}</div>
                                                        {filteredYouthResults
                                                            .filter((result) => result.event === event)
                                                            .sort((a, b) => (a.position || 0) - (b.position || 0))
                                                            .map((result, index) => (
                                                                <YouthAthleteCard key={result.athleteID} index={index} {...result} />
                                                            ))}
                                                    </div>
                                                ) : (
                                                    filteredYouthResults.length === 0 && <div className='w-full grid place-items-center p-4'>No results available.</div>
                                                ),
                                            )
                                    ) : (
                                        <div className='w-full grid place-items-center p-4'>No results available.</div>
                                    )
                                ) : (
                                    <div className='w-full flex flex-col gap-1'>
                                        {filteredCommunityResults.length > 0 ? (
                                            <>
                                                <div className='px-2 py-1 phone:text-lg uppercase font-bold border-b-primary border-b-2 text-primary w-full'>1 MILE RACE</div>
                                                {filteredCommunityResults.map((result, index) => (
                                                    <CommunityAthleteCard key={result.athleteID} index={index} {...result} />
                                                ))}
                                            </>
                                        ) : (
                                            <div className='w-full grid place-items-center p-4'>No results available.</div>
                                        )}
                                    </div>
                                )
                            ) : response === 'failed' ? (
                                <div className='w-full grid place-items-center p-4'>Could not load results. Please reload the page.</div>
                            ) : (
                                response === 'loading' && (
                                    <div className='w-full grid place-items-center p-4'>
                                        <div className='loader w-12 h-12'></div>
                                    </div>
                                )
                            )}
                        </div> */}
                    </div>
                ) : (
                    <div className={`font-fredoka font-normal text-wrap w-full flex flex-col gap-1`}>
                        <p className='font-bold text-lg'>Results are not available at this time.</p>
                        <p>Please refresh the page and try again. If the issue persists, please contact us below.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);

    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }

    return age;
};

const CommunityAthleteCard = ({ name, athleteName, performance, dob, index, position }: Result & { index: number }) => {
    let score = Number(performance);
    let performanceString = performance;
    performanceString = `${Math.floor(score / 60)}:${String(score % 60).padStart(2, '0')}`;

    return (
        <div
            className={`${
                index % 2 === 0 ? 'bg-background' : 'bg-background-secondary'
            } grid grid-cols-[15%_3%_59%_3%_20%] mid-phone-wide:grid-cols-[10%_3%_69%_3%_15%] tablet:grid-cols-[15%_3%_59%_3%_20%] mid-tablet-wide:grid-cols-[10%_3%_69%_3%_15%] p-2 rounded-lg text-sm hover:scale-[1.02] transition-all`}
        >
            <span
                className={`${
                    index % 2 === 0 ? 'bg-primary' : 'bg-primary-light'
                } h-full shadow-lg rounded-lg text-white text-base mid-phone-wide:text-lg tablet:text-base mid-tablet-wide:text-lg w-full flex items-center justify-center`}
            >
                {position}
            </span>
            <span></span>
            <span className='h-full w-full flex flex-col gap-0.5 justify-start'>
                <span className='font-semibold text-base mid-phone-wide:text-[17px] tablet:text-base mid-tablet-wide:text-[17px] overflow-hidden text-nowrap text-ellipsis'>
                    {athleteName}
                </span>
                <span className='text-gray-600 text-xs mid-phone-wide:text-sm tablet:text-xs mid-tablet-wide:text-sm'>Age {calculateAge(dob)}</span>
            </span>
            <span></span>
            <span
                className={`${
                    index % 2 === 0 ? 'bg-primary' : 'bg-primary-light'
                } h-full shadow-lg w-full text-base tablet:text-sm mid-tablet-wide:text-[15px] two-column:text-base rounded-lg text-white px-2 py-1 grid place-items-center`}
            >
                {performanceString}
            </span>
        </div>
    );
};

const YouthAthleteCard = ({ name, athleteName, performance, unit, dob, index, position }: Result & { index: number }) => {
    let score = Number(performance);
    let performanceString = performance;
    if (unit === 'seconds') performanceString = `${Math.floor(score / 60)}:${String(score % 60).padStart(2, '0')}`;
    if (unit === 'inches') performanceString = `${Math.floor(score / 12)}' ${Math.round(score % 12)}"`;
    if (unit === 'meters') {
        let inches = score * 39.3701;
        performanceString = `${Math.floor(inches / 12)}' ${Math.floor(inches % 12)}"`;
    }

    return (
        <div
            className={`${
                index % 2 === 0 ? 'bg-background' : 'bg-background-secondary'
            } grid grid-cols-[15%_3%_59%_3%_20%] mid-phone-wide:grid-cols-[10%_3%_69%_3%_15%] tablet:grid-cols-[15%_3%_59%_3%_20%] mid-tablet-wide:grid-cols-[10%_3%_69%_3%_15%] p-2 rounded-lg text-sm hover:scale-[1.02] transition-all`}
        >
            <span
                className={`${
                    index % 2 === 0 ? 'bg-primary' : 'bg-primary-light'
                } h-full shadow-lg rounded-lg text-white text-base mid-phone-wide:text-lg tablet:text-base mid-tablet-wide:text-lg w-full flex items-center justify-center`}
            >
                {position}
            </span>
            <span></span>
            <span className='h-full w-full flex flex-col gap-0.5 justify-start'>
                <span className='font-semibold text-base mid-phone-wide:text-[17px] tablet:text-base mid-tablet-wide:text-[17px] overflow-hidden text-nowrap text-ellipsis'>
                    {athleteName.replaceAll('_', ' ')}
                </span>
                <span className='text-gray-600 text-xs mid-phone-wide:text-sm tablet:text-xs mid-tablet-wide:text-sm'>
                    {calculateAge(dob) !== 0 ? `Age ${calculateAge(dob)}` : 'Relay Team'}
                </span>
            </span>
            <span></span>
            <span
                className={`${
                    index % 2 === 0 ? 'bg-primary' : 'bg-primary-light'
                } h-full shadow-lg w-full text-[11px] mobile:text-xs phone:text-sm tablet:text-xs mid-column:text-sm two-column:text-base rounded-lg text-white px-2 py-1 grid place-items-center`}
            >
                {performanceString}
            </span>
        </div>
    );
};

const Fallback = () => {
    return <div>placeholder</div>;
};

const ResultsHome = () => {
    return (
        <Suspense fallback={<Fallback />}>
            <ResultsContent />
        </Suspense>
    );
};

export default ResultsHome;
