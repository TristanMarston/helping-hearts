'use client';

import axios from 'axios';
import { Fredoka, Sour_Gummy } from 'next/font/google';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const sourGummyBold = Sour_Gummy({ weight: '800', subsets: ['latin'] });
const fredokaBold = Fredoka({ weight: '600', subsets: ['latin'] });
const fredokaLight = Fredoka({ weight: '400', subsets: ['latin'] });

type YouthResult = {
    athleteID: string;
    firstName: string;
    lastName: string;
    age: number;
    event: string;
    performance: string;
    unit: string;
    position: number;
    enteredAt: string;
};

type CommunityResult = {
    athleteID: string;
    firstName: string;
    lastName: string;
    age: number;
    position: number;
    performance: string;
};

const ResultsContent = () => {
    // const isDatePast = new Date() > new Date('2025-03-01');

    const searchParams = useSearchParams();
    const router = useRouter();
    const isDatePast = new Date(2025, 2, 1, 0, 1) > new Date('2025-03-01');

    const [raceType, setRaceType] = useState<'youth' | 'community'>('youth');
    const [previousRaceType, setPreviousRaceType] = useState<'youth' | 'community'>('youth');
    const [sortBy, setSortBy] = useState<'performance' | 'age'>('performance');
    const [query, setQuery] = useState('');

    const [youthResults, setYouthResults] = useState<YouthResult[]>([]);
    const [filteredYouthResults, setFilteredYouthResults] = useState<YouthResult[]>([]);
    const [sortedYouthResults, setSortedYouthResults] = useState<YouthResult[]>([]);

    const [communityResults, setCommunityResults] = useState<CommunityResult[]>([]);
    const [filteredCommunityResults, setFilteredCommunityResults] = useState<CommunityResult[]>([]);
    const [sortedCommunityResults, setSortedCommunityResults] = useState<CommunityResult[]>([]);

    const [response, setResponse] = useState<'loading' | 'success' | 'failed'>('loading');

    const [eventView, setEventView] = useState('all events');
    const events = ['100 meters', '400 meters', '800 meters', '1600 meters', 'softball throw', 'long jump'];

    const adjustSearchParams = (race: 'youth' | 'community', sort: 'performance' | 'age', event: string) => {
        const createQueryString = (names: string[], values: string[]) => {
            const params = new URLSearchParams(searchParams.toString());
            names.forEach((name, index) => {
                params.set(name, values[index]);
            });
            return params.toString();
        };
        const newQueryString = createQueryString(['race', 'sort', 'event'], [race, sort, event.replaceAll('all events', 'all')]);
        router.push(`?${newQueryString}`);
    };

    const sortResults = useCallback(
        (passedResults?: YouthResult[] | CommunityResult[], passedSortBy?: 'performance' | 'age', passedRaceType?: 'youth' | 'community') => {
            let formatRaceType = passedRaceType || raceType;
            let resultsToSort: YouthResult[] | CommunityResult[] = passedResults || (formatRaceType === 'youth' ? youthResults : communityResults);
            let sortResultsBy = passedSortBy || sortBy;

            if (sortResultsBy === 'performance') {
                const sorted: YouthResult[] | CommunityResult[] = [...resultsToSort].sort((a, b) => {
                    const performanceDifference = Number(a.performance) - Number(b.performance);
                    if (performanceDifference !== 0) {
                        return performanceDifference;
                    }
                    return a.age - b.age;
                });

                if (formatRaceType === 'youth') setSortedYouthResults(sorted as YouthResult[]);
                else setSortedCommunityResults(sorted as CommunityResult[]);
            } else if (sortResultsBy === 'age') {
                const sorted: YouthResult[] | CommunityResult[] = [...resultsToSort].sort((a, b) => {
                    const ageDifference = a.age - b.age;
                    if (ageDifference !== 0) {
                        return ageDifference;
                    }
                    return Number(a.performance) - Number(b.performance);
                });

                if (formatRaceType === 'youth') setSortedYouthResults(sorted as YouthResult[]);
                else setSortedCommunityResults(sorted as CommunityResult[]);
            }
        },
        [sortBy, sortedYouthResults, youthResults]
    );

    const getYouthResults = (sort: 'age' | 'performance') => {
        axios
            .get(`/api/admin/get/dpi-youth-participants`)
            .then((res) => {
                if (res.status === 200) {
                    setResponse('success');
                    const formattedResults = res.data.data
                        .filter((athlete: any) => athlete.results.length > 0)
                        .map((athlete: any) =>
                            athlete.results.map((result: any) => ({
                                athleteID: athlete._id,
                                firstName: athlete.firstName,
                                lastName: athlete.lastName,
                                age: athlete.age,
                                event: result.event,
                                performance: result.performance,
                                unit: result.unit,
                                enteredAt: result.enteredAt,
                            }))
                        )
                        .flat();

                    const resultsByEvent = formattedResults.reduce((acc: any, result: any) => {
                        if (!acc[result.event]) acc[result.event] = [];
                        acc[result.event].push(result);
                        return acc;
                    }, {});

                    Object.keys(resultsByEvent).forEach((event) => {
                        resultsByEvent[event]
                            .sort((a: YouthResult, b: YouthResult) => {
                                const performanceDifference = Number(a.performance) - Number(b.performance);
                                if (performanceDifference !== 0) {
                                    return performanceDifference;
                                }
                                return a.age - b.age;
                            })
                            .forEach((result: any, index: number) => {
                                result.position = index + 1;
                            });
                    });

                    formattedResults.forEach((result: any) => {
                        result.position = resultsByEvent[result.event].find((r: any) => r.athleteID === result.athleteID && r.performance === result.performance).position;
                    });

                    sortResults(formattedResults, sort as 'performance' | 'age', 'youth');
                    setYouthResults(formattedResults);
                    setFilteredYouthResults(formattedResults);
                } else setResponse('failed');
            })
            .catch((err) => {
                setResponse('failed');
                console.error(err);
            });
    };

    const getCommunityResults = (sort: 'age' | 'performance') => {
        axios
            .get(`/api/admin/get/dpi-community-participants`)
            .then((res) => {
                if (res.status === 200) {
                    setResponse('success');
                    const formattedResults = res.data.data
                        .filter((athlete: any) => athlete.result !== '' && athlete.result !== null && athlete.result !== undefined)
                        .map((athlete: any) => ({
                            athleteID: athlete._id,
                            firstName: athlete.firstName,
                            lastName: athlete.lastName,
                            age: athlete.age,
                            performance: athlete.result,
                        }))
                        .flat();

                    formattedResults.sort((a: CommunityResult, b: CommunityResult) => Number(a.performance) - Number(b.performance));
                    formattedResults.forEach((result: CommunityResult, index: number) => {
                        result.position = index + 1;
                    });

                    console.log(formattedResults);

                    sortResults(formattedResults, sort as 'performance' | 'age', 'community');
                    setCommunityResults(formattedResults);
                    setFilteredCommunityResults(formattedResults);
                } else setResponse('failed');
            })
            .catch((err) => {
                setResponse('failed');
                console.error(err);
            });
    };

    useEffect(() => {
        if (query.trim() === '') {
            if (raceType === 'youth') setFilteredYouthResults(sortedYouthResults);
            else setFilteredCommunityResults(sortedCommunityResults);
            return;
        } else {
            if (raceType === 'youth')
                setFilteredYouthResults(sortedYouthResults.filter((athlete) => `${athlete.firstName} ${athlete.lastName}`.toLowerCase().includes(query.toLowerCase())));
            else setFilteredCommunityResults(sortedCommunityResults.filter((athlete) => `${athlete.firstName} ${athlete.lastName}`.toLowerCase().includes(query.toLowerCase())));
        }
    }, [query, sortedYouthResults, sortedCommunityResults]);

    useEffect(() => {
        adjustSearchParams(raceType, sortBy, eventView);
        sortResults(undefined, sortBy);
    }, [sortBy]);

    useEffect(() => {
        adjustSearchParams(raceType, sortBy, eventView.replaceAll(' meters', 'm').replaceAll(' events', ''));
    }, [eventView]);

    useEffect(() => {
        if (raceType === 'youth' && previousRaceType !== 'youth') {
            setResponse('loading');
            getYouthResults(sortBy);
        } else if (raceType === 'community' && previousRaceType !== 'community') {
            setResponse('loading');
            getCommunityResults(sortBy);
        }

        setPreviousRaceType(raceType);
    }, [raceType]);

    useEffect(() => {
        let race = searchParams.get('race');
        if (race === 'youth' || race === 'community') {
            setRaceType(race || 'youth');
            setPreviousRaceType(race || 'youth');
        } else race = 'youth';

        let sort = searchParams.get('sort');
        if (sort === 'performance' || sort === 'age') {
            setSortBy(sort || 'performance');
        } else sort = 'performance';

        let event = searchParams.get('event')?.replaceAll('00m', '00 meters').replaceAll('all', 'all events');
        if (event === 'all events' || events.includes(event || '')) {
            setEventView(event || 'all events');
        }

        if (race === 'youth') {
            setResponse('loading');
            getYouthResults(sort as 'performance' | 'age');
        } else if (race === 'community') {
            setResponse('loading');
            getCommunityResults(sort as 'performance' | 'age');
        }
    }, []);

    return (
        <div className='w-full flex flex-col items-center mt-16 mid-mobile:mt-20'>
            <div className='w-full max-w-[1280px] flex flex-col px-5 my-8'>
                <h1 className={`${sourGummyBold.className} text-black text-left text-4xl mb-2`}>Results</h1>
                {isDatePast ? (
                    <div className={`${fredokaLight.className} w-full`}>
                        <p>On March 1st, 2025, we hosted our annual youth track & field event. Here were the results:</p>
                        <div className='w-full rounded-full grid grid-cols-2 mt-4 bg-background shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
                            <button
                                className={`${fredokaBold.className} ${
                                    raceType === 'youth' ? 'bg-primary text-white' : ' bg-background text-primary hover:bg-background-secondary'
                                } rounded-full flex justify-center items-center text-sm mid-mobile:text-base p-1.5`}
                                onClick={() => {
                                    adjustSearchParams('youth', sortBy, eventView);
                                    setRaceType('youth');
                                }}
                            >
                                Youth
                            </button>
                            <button
                                className={`${fredokaBold.className} ${
                                    raceType === 'community' ? 'bg-primary text-white' : ' bg-background text-primary hover:bg-background-secondary'
                                } rounded-full flex justify-center items-center text-sm mid-mobile:text-base p-1.5`}
                                onClick={() => {
                                    adjustSearchParams('community', sortBy, eventView);
                                    setRaceType('community');
                                }}
                            >
                                Community
                            </button>
                        </div>
                        <span className='flex relative mt-4'>
                            <input
                                placeholder={'Athlete Name'}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className={`placeholder:text-gray-500 outline-none w-full bg-background text-secondary pl-10 pr-2 py-2 rounded-xl border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                            />
                            <Search className='absolute left-3 top-3 opacity-80 w-5 h-5' />
                        </span>
                        {raceType === 'youth' && (
                            <Select
                                onValueChange={(value) => {
                                    setEventView(value);
                                }}
                                defaultValue={searchParams.get('event')?.replaceAll('all', 'all events').replaceAll('00m', '00 meters') || 'all events'}
                            >
                                <SelectTrigger
                                    className={`${fredokaLight.className} ${
                                        eventView !== '' ? 'text-black' : 'text-gray-500'
                                    } mt-2 px-4 py-3 ring-0 w-full h-11 text-base bg-background hover:bg-background-secondary transition-all appearance-none rounded-lg border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                                >
                                    <SelectValue placeholder='all events' className={`overflow-ellipsis text-gray-400`}>
                                        {eventView !== '' ? eventView : <span>all events</span>}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className={`${fredokaLight.className} bg-background p-1.5`}>
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
                                className={`${fredokaLight.className} text-black mt-2 px-4 py-3 ring-0 w-full h-11 text-base bg-background hover:bg-background-secondary transition-all appearance-none rounded-lg border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                            >
                                <SelectValue placeholder='Events' className={`overflow-ellipsis text-gray-400`}>
                                    {sortBy}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent className={`${fredokaLight.className} bg-background p-1.5`}>
                                <SelectGroup>
                                    {['performance', 'age'].map((event, index) => (
                                        <SelectItem key={event + index} value={event} className={`px-7 cursor-pointer hover:bg-background-light transition-all text-base`}>
                                            {event}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <div
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
                                    events
                                        .filter((event) => (eventView === 'all events' ? true : event === eventView))
                                        .map(
                                            (event) =>
                                                filteredYouthResults.filter((result) => result.event === event).length > 0 && (
                                                    <div key={event} className='w-full flex flex-col gap-1'>
                                                        <div className='px-2 py-1 phone:text-lg uppercase font-bold border-b-primary border-b-2 text-primary w-full'>{event}</div>
                                                        {filteredYouthResults
                                                            .filter((result) => result.event === event)
                                                            .map((result, index) => (
                                                                <YouthAthleteCard key={result.athleteID} index={index} {...result} />
                                                            ))}
                                                    </div>
                                                )
                                        )
                                ) : (
                                    <div className='w-full flex flex-col gap-1'>
                                        <div className='px-2 py-1 phone:text-lg uppercase font-bold border-b-primary border-b-2 text-primary w-full'>1 MILE RACE</div>
                                        {filteredCommunityResults.map((result, index) => (
                                            <CommunityAthleteCard key={result.athleteID} index={index} {...result} />
                                        ))}
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
                        </div>
                    </div>
                ) : (
                    <div className={`${fredokaLight.className} text-wrap w-full flex flex-col gap-1`}>
                        <p className='font-bold text-lg'>Results are not available at this time.</p>
                        <p>When the event has concluded, check back here to see the results of the races!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const CommunityAthleteCard = ({ firstName, lastName, performance, age, index, position }: CommunityResult & { index: number }) => {
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
                    {firstName} {lastName}
                </span>
                <span className='text-gray-600 text-xs mid-phone-wide:text-sm tablet:text-xs mid-tablet-wide:text-sm'>Age {age}</span>
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

const YouthAthleteCard = ({ firstName, lastName, performance, unit, age, index, position }: YouthResult & { index: number }) => {
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
                    {firstName} {lastName}
                </span>
                <span className='text-gray-600 text-xs mid-phone-wide:text-sm tablet:text-xs mid-tablet-wide:text-sm'>Age {age}</span>
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
