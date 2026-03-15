'use client';

import { getCollection, submitYouthResults } from '@/app/actions/admin';

import { useEffect, useRef, useState } from 'react';
import SearchBar from './SearchBar';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Home, PlusCircle, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Heat } from '../1600m-heats/1600Heats';
import { findCommunityAthletesFromBib, findYouthAthletesFromBib, getHeats, publish1600Results } from '@/app/actions/heats';

export type AthleteData = {
    id: string;
    name: string;
    bibNumber: string;
    minutes: string;
    seconds: string;
};

const PublishResultsScreen = () => {
    const [communityHeats, setCommunityHeats] = useState<Heat[]>([]);
    const [youthHeats, setYouthHeats] = useState<Heat[]>([]);
    const [selectedHeat, setSelectedHeat] = useState<Heat | null>(null);
    const stopwatchRef = useRef<any>(null);

    const fetchHeats = async () => {
        const res = await Promise.all([getHeats('1600 meters', 'community'), getHeats('1600 meters', 'youth')]);
        if (res[0].success && res[1].success) {
            setCommunityHeats(
                res[0].heats.map((heat) => ({
                    id: heat.id,
                    eventName: heat.eventName,
                    number: heat.number,
                    type: heat.type,
                    // @ts-ignore
                    events: heat.events.map((e) => ({ id: e.id, name: e.name, youthAthlete: null, communityAthlete: e.communityAthlete || null, lane: e.lane })),
                    open: true,
                })),
            );
            setYouthHeats(
                res[1].heats.map((heat) => ({
                    id: heat.id,
                    eventName: heat.eventName,
                    number: heat.number,
                    type: heat.type,
                    // @ts-ignore
                    events: heat.events.map((e) => ({ id: e.id, name: e.name, youthAthlete: e.youthAthlete || null, communityAthlete: null, lane: e.lane })),
                    open: true,
                })),
            );
        } else {
            toast.error('Failed to fetch heats', {
                className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
                position: 'top-center',
            });
        }
    };

    useEffect(() => {
        fetchHeats();
    }, []);

    const [athleteEvents, setAthleteEvents] = useState<AthleteData[]>([]);
    const [stopwatchTime, setStopwatchTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (isRunning) {
            stopwatchRef.current = setInterval(() => {
                setStopwatchTime((prev) => prev + 10);
            }, 10);
        } else {
            clearInterval(stopwatchRef.current);
        }
    }, [isRunning]);

    const autofillNames = async () => {
        if (!selectedHeat) {
            toast.error('Select a heat');
            return;
        }

        const toastID = toast.loading('Fetching athletes...', {
            className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
            position: 'top-center',
        });

        if (selectedHeat.type === 'community') {
            const bibs = athleteEvents.filter((event) => event.id === '' && event.bibNumber !== '').map((event) => parseInt(event.bibNumber));
            const athletesWithBibs = await findCommunityAthletesFromBib(bibs);
            if (!athletesWithBibs.success || !athletesWithBibs.athletes) toast.error('Failed to get athletes');

            if (athletesWithBibs.athletes) {
                let newAthleteEvents = [...athleteEvents];
                athletesWithBibs.athletes.forEach((athlete) => {
                    newAthleteEvents = newAthleteEvents.map((event) =>
                        parseInt(event.bibNumber) === athlete.bibNumber ? { ...event, name: athlete.name, id: athlete.id } : { ...event },
                    );
                });

                setAthleteEvents([...newAthleteEvents]);

                toast.success('Successfully fetched athletes', { id: toastID, duration: 0 });
                return;
            }
        } else if (selectedHeat.type === 'youth') {
            const bibs = athleteEvents.filter((event) => event.id === '' && event.bibNumber !== '').map((event) => parseInt(event.bibNumber));
            const athletesWithBibs = await findYouthAthletesFromBib(bibs);
            if (!athletesWithBibs.success || !athletesWithBibs.athletes) toast.error('Failed to get athletes');

            if (athletesWithBibs.athletes) {
                let newAthleteEvents = [...athleteEvents];
                athletesWithBibs.athletes.forEach((athlete) => {
                    newAthleteEvents = newAthleteEvents.map((event) =>
                        parseInt(event.bibNumber) === athlete.bibNumber ? { ...event, name: athlete.name, id: athlete.id } : { ...event },
                    );
                });

                setAthleteEvents([...newAthleteEvents]);

                toast.success('Successfully fetched athletes', { id: toastID, duration: 0 });
                return;
            }
        }

        toast.error('Could not fetch athletes', { id: toastID, duration: 0 });
    };

    // const [athleteData, setAthleteData] = useState<AthleteData[]>([{ firstName: '', lastName: '', athleteID: '', score: '' }]);
    // const [response, setResponse] = useState<any[]>([]);
    // const events = ['1600 meters', '800 meters', '400 meters', '100 meters', 'softball throw', 'long jump'];
    // const [chosenEvent, setChosenEvent] = useState('');
    // const [chosenUnit, setChosenUnit] = useState<EventUnits | undefined>();
    // const [chosenAthlete, setChosenAthlete] = useState<{ firstName: string; lastName: string }[]>([]);

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     const toastID = toast.loading('Publishing results...', {
    //         className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
    //         position: 'top-center',
    //     });

    //     const sendData: AthleteDataSend[] = [];
    //     athleteData.forEach((athlete) => {
    //         if (athlete.athleteID !== '') {
    //             sendData.push({
    //                 athleteID: athlete.athleteID,
    //                 event: chosenEvent,
    //                 score:
    //                     chosenUnit === 'minutes & seconds'
    //                         ? String(Number(athlete.score) + Number(athlete.minutes !== undefined ? athlete.minutes : '0') * 60)
    //                         : chosenUnit === 'feet & inches'
    //                           ? String(Number(athlete.score) + Number(athlete.feet !== undefined ? athlete.feet : '0') * 12)
    //                           : chosenUnit === 'meters'
    //                             ? String(Number(athlete.score) * 39.37)
    //                             : '0',
    //                 unit: chosenUnit === 'minutes & seconds' ? 'seconds' : chosenUnit === 'feet & inches' ? 'inches' : chosenUnit === 'meters' ? 'inches' : 'error',
    //             });
    //         }
    //     });

    //     const res = await submitYouthResults(sendData);
    //     if (res.success) {
    //         toast.success('Successfully published results!', {
    //             id: toastID,
    //             duration: 4000,
    //         });

    //         setAthleteData([{ firstName: '', lastName: '', minutes: '', feet: '', athleteID: '', score: '' }]);
    //         setChosenAthlete([]);
    //         setChosenEvent('');
    //         setChosenUnit(undefined);
    //     } else {
    //         toast.error(res.message, {
    //             id: toastID,
    //             duration: 4000,
    //         });
    //     }
    // };

    const handleSubmit = async () => {
        if (!selectedHeat) {
            toast.error('Select a heat');
            return;
        }

        const toastID = toast.loading('Publishing results...', {
            className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
            position: 'top-center',
        });

        const sendData: { id: string; seconds: number }[] = athleteEvents
            .filter((event) => event.id && event.minutes !== '' && event.seconds !== '')
            .map((event) => ({ id: event.id, seconds: parseInt(event.minutes) * 60 + parseInt(event.seconds) }));

        const res = await publish1600Results(sendData, selectedHeat.type);
        if (res.success) {
            toast.success('Successfully published results.', { id: toastID, duration: 6000 });
        } else {
            toast.error('Could not publish results.', { id: toastID, duration: 6000 });
        }
    };

    return (
        <div className='w-full flex justify-center mt-16 mid-mobile:mt-20'>
            <div className='w-full max-w-[1000px] flex flex-col mx-6 mt-8 mb-36'>
                <h1 className={`font-sour-gummy font-extrabold text-black text-3xl wide:text-4xl mid-tablet:text-5xl mb-4`}>1600m Results Publishing Interface</h1>

                <section className={`font-fredoka font-normal w-full h-full flex flex-col gap-4`}>
                    <span className='flex items-center gap-4'>
                        <span className={`text-black font-bold text-lg wide:text-xl mid-tablet:text-2xl`}>Heat:</span>
                        <Select
                            onValueChange={(value) => {
                                if (value === 'Community Heat 1') {
                                    setSelectedHeat(communityHeats[0]);
                                } else if (value === 'Youth Heat 1') {
                                    setSelectedHeat(youthHeats.find((heat) => heat.number === 1) || youthHeats[0]);
                                } else if (value === 'Youth Heat 2') {
                                    setSelectedHeat(youthHeats.find((heat) => heat.number === 2) || youthHeats[1]);
                                }
                            }}
                        >
                            <SelectTrigger
                                className={`font-fredoka font-normal ${
                                    selectedHeat ? 'text-black' : 'text-gray-500'
                                } px-4 py-3 ring-0 w-full h-11 text-base bg-background hover:bg-background-secondary transition-all appearance-none rounded-lg border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                            >
                                <SelectValue placeholder='Heats' className={`overflow-ellipsis text-gray-400`}>
                                    {selectedHeat ? selectedHeat.type === 'community' ? 'Community Heat 1' : `Youth Heat ${selectedHeat.number}` : <span>Heat</span>}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent className={`font-fredoka font-normal bg-background p-1.5`}>
                                <SelectGroup>
                                    {['Community Heat 1', 'Youth Heat 1', 'Youth Heat 2'].map((event, index) => (
                                        <SelectItem key={event + index} value={event} className={`px-7 cursor-pointer hover:bg-background-light transition-all text-base`}>
                                            {event}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </span>
                    <div className='rounded-[18px] border border-gray-400 px-8 py-16 flex justify-center items-center relative'>
                        <span className='font-nunito font-black tracking-widest text-[90px]'>{`${String(Math.floor(stopwatchTime / 3600000)).padStart(2, '0')}:${String(Math.floor(stopwatchTime / 60000) % 60).padStart(2, '0')}:${String(Math.floor(stopwatchTime / 1000) % 60).padStart(2, '0')}.${String(stopwatchTime % 1000).padStart(3, '0')}`}</span>
                        <div className='flex items-center gap-3 justify-center absolute bottom-3'>
                            <button
                                onClick={() => {
                                    if (!isRunning) {
                                        setStopwatchTime(0);
                                    } else setIsRunning(false);
                                }}
                                className='font-fredoka font-semibold text-primary border border-primary rounded-[14px] px-5 py-2 text-lg cursor-pointer hover:bg-background-light transition-all'
                            >
                                {isRunning ? 'Cancel' : 'Reset'}
                            </button>
                            <button
                                onClick={() => setIsRunning(true)}
                                className='font-fredoka font-semibold text-primary border border-primary rounded-[14px] px-5 py-2 text-lg cursor-pointer hover:bg-background-light transition-all'
                            >
                                Start
                            </button>
                            <button
                                onClick={() => {
                                    setAthleteEvents((prev) => [
                                        ...prev,
                                        {
                                            id: '',
                                            bibNumber: '',
                                            name: '',
                                            minutes: String(Math.floor(stopwatchTime / 60000) % 60),
                                            seconds: String(Math.floor(stopwatchTime / 1000) % 60),
                                        },
                                    ]);
                                }}
                                className='font-fredoka font-semibold bg-primary text-white text-xl shadow-md shadow-primary-dark rounded-[18px] py-2 px-12 hover:bg-primary-light transition-all cursor-pointer'
                            >
                                Lap
                            </button>
                        </div>
                    </div>
                    {/* STOPWATCH */}

                    {/* {chosenUnit !== undefined && chosenUnit !== 'minutes & seconds' && (
                        <span className='flex items-center gap-4'>
                            <span className={`text-black font-bold text-lg wide:text-xl mid-tablet:text-2xl`}>Unit:</span>
                            <Select
                                onValueChange={(value) => {
                                    setChosenUnit(value as EventUnits);
                                }}
                                defaultValue='feet & inches'
                            >
                                <SelectTrigger
                                    className={`font-fredoka font-normal px-4 py-3 ring-0 w-full h-11 text-base bg-background hover:bg-background-secondary transition-all appearance-none rounded-lg border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                                >
                                    <SelectValue placeholder='Unit' className={`overflow-ellipsis text-gray-400`}>
                                        {chosenUnit}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className={`font-fredoka font-normal bg-background p-1.5`}>
                                    <SelectGroup>
                                        {['feet & inches', 'meters'].map((unit, index) => (
                                            <SelectItem key={unit + index} value={unit} className={`px-7 cursor-pointer hover:bg-background-light transition-all text-base`}>
                                                {unit}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </span>
                    )} */}
                    <div className='bg-background p-2 rounded-lg border border-gray-200 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] h-full flex flex-col gap-4'>
                        <div>
                            <div className={`grid grid-rows-1 grid-cols-[15%_7.5%_35%_21.25%_21.25%]`}>
                                <span className='border-b-2 border-r border-gray-400 grid place-items-center p-2 relative'>
                                    <span>Bib #</span>
                                    {athleteEvents.some((event) => event.id === '' && event.bibNumber) && (
                                        <Search onClick={autofillNames} className='text-gray-400 absolute left-2 w-5 h-5 hover:text-gray-600 transition-all cursor-pointer' />
                                    )}
                                </span>
                                <span className='border-b-2 border-r border-gray-400 grid place-items-center p-2'>Valid</span>
                                <span className='border-b-2 border-r border-gray-400 grid place-items-center p-2'>Athlete Name</span>
                                <span className='border-b-2 border-r border-gray-400 grid place-items-center p-2'>Minutes</span>
                                <span className='border-b-2 border-gray-400 grid place-items-center p-2'>Seconds</span>
                            </div>
                            {athleteEvents.map((athlete, index) => (
                                <div key={athlete.id + index} className={`grid grid-rows-1 grid-cols-[15%_7.5%_35%_21.25%_21.25%]`}>
                                    <input
                                        className='font-fredoka font-normal p-2 w-full text-base caret-black text-black placeholder:text-gray-500 bg-background outline-none border-b border-r border-gray-400 text-center appearance-none'
                                        type='text'
                                        autoComplete='off'
                                        value={athlete.bibNumber}
                                        onChange={(e) => {
                                            setAthleteEvents((prev) => {
                                                const newAthleteData = [...prev];
                                                newAthleteData[index] = { ...newAthleteData[index], bibNumber: e.target.value };
                                                return newAthleteData;
                                            });
                                        }}
                                    />
                                    <span className='border-b border-r border-gray-400 grid place-items-center p-2'>
                                        {athlete.id && athlete.minutes !== '' && athlete.seconds !== '' ? (
                                            <Check className='rounded-full bg-green-400 text-white p-1 w-6 h-6 shadow-sm' />
                                        ) : (
                                            <X className='rounded-full bg-red-400 text-white p-1 w-6 h-6 shadow-sm' />
                                        )}
                                    </span>
                                    <input
                                        type='text'
                                        className={`font-fredoka font-normal p-2 w-full text-base caret-black text-black placeholder:text-gray-500 bg-background outline-none border-b border-r border-gray-400 text-center appearance-none`}
                                        autoComplete='off'
                                        onChange={(e) =>
                                            setAthleteEvents((prev) => {
                                                const newAthleteData = [...prev];
                                                newAthleteData[index] = { ...newAthleteData[index], name: e.target.value };
                                                return newAthleteData;
                                            })
                                        }
                                        value={athlete.name}
                                        placeholder=' '
                                    />
                                    <input
                                        type='text'
                                        className={`font-fredoka font-normal p-2 w-full text-base caret-black text-black placeholder:text-gray-500 bg-background outline-none border-b border-r border-gray-400 text-center appearance-none`}
                                        autoComplete='off'
                                        onChange={(e) =>
                                            setAthleteEvents((prev) => {
                                                const newAthleteData = [...prev];
                                                newAthleteData[index] = { ...newAthleteData[index], minutes: e.target.value };
                                                return newAthleteData;
                                            })
                                        }
                                        value={athlete.minutes}
                                        placeholder=' '
                                    />
                                    <input
                                        type='text'
                                        className={`font-fredoka font-normal p-2 w-full text-base caret-black text-black placeholder:text-gray-500 bg-background outline-none border-b border-r border-gray-400 text-center appearance-none`}
                                        autoComplete='off'
                                        onChange={(e) =>
                                            setAthleteEvents((prev) => {
                                                const newAthleteData = [...prev];
                                                newAthleteData[index] = { ...newAthleteData[index], seconds: e.target.value };
                                                return newAthleteData;
                                            })
                                        }
                                        value={athlete.seconds}
                                        placeholder=' '
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div
                        onClick={() => {
                            setAthleteEvents((prev) => [...prev, { name: '', id: '', bibNumber: '', minutes: '', seconds: '' }]);
                        }}
                        className={`font-fredoka font-semibold bg-background flex justify-center items-center gap-2 text-primary py-2 px-3 wide:py-2.5 wide:text-lg tracking-wider w-full text-center rounded-xl shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] cursor-pointer transition-all hover:brightness-110`}
                    >
                        <PlusCircle strokeWidth={2.5} />
                        Add Athlete
                    </div>
                    <Link
                        href='/admin'
                        className={`font-fredoka font-semibold bg-background flex justify-center items-center gap-2 text-primary py-2 px-3 wide:py-2.5 wide:text-lg tracking-wider w-full text-center rounded-xl shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] cursor-pointer transition-all hover:brightness-110`}
                    >
                        <Home strokeWidth={2.5} />
                        Admin Homepage
                    </Link>
                    <button
                        type='submit'
                        onClick={handleSubmit}
                        className={`font-fredoka font-semibold bg-primary py-2 px-3 wide:py-2.5 wide:text-lg tracking-wider text-white w-full text-center rounded-xl shadow-lg cursor-pointer transition-all hover:brightness-110`}
                    >
                        Submit
                    </button>
                </section>
            </div>
        </div>
    );
};

export default PublishResultsScreen;
