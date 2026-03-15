'use client';

import { findYouthAthletesFromBib, getHeats, publish100400Results } from '@/app/actions/heats';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Home, PlusCircle, Search, X } from 'lucide-react';
import Link from 'next/link';

type Heat = {
    id: string;
    eventName: string;
    events: Event[];
    number: number;
    type: 'community' | 'youth';
};

type Event = {
    id: string;
    name: string;
    youthAthlete: any | null;
    lane: number | null;
};

type AthleteData = {
    id: string;
    lane: number;
    name: string;
    bibNumber: string;
    minutes: string;
    seconds: string;
};

const Results = ({ which }: { which: '400' | '100' }) => {
    const [heats, setHeats] = useState<Heat[]>([]);
    const [selectedHeat, setSelectedHeat] = useState<Heat | null>(null);

    const fetchHeats = async () => {
        const toastID = toast.loading('Fetching heats...', {
            className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
            position: 'top-center',
        });

        let res = null;

        if (which === '400') res = await getHeats('400 meters');
        else res = await getHeats('100 meters');

        if (!res.success || !res.heats) toast.error('Unable to fetch heats.', { id: toastID, duration: 6000 });

        if (res.heats) {
            setHeats(
                res.heats.map((heat, index) => ({
                    id: heat.id,
                    eventName: heat.eventName,
                    number: heat.number,
                    type: heat.type,
                    events: heat.events.map((event) => ({
                        id: event.id,
                        name: event.name,
                        // @ts-ignore
                        youthAthlete: event.youthAthlete,
                        lane: event.lane,
                    })),
                })),
            );
        }

        toast.dismiss(toastID);
    };

    useEffect(() => {
        fetchHeats();
    }, []);

    const [athleteEvents, setAthleteEvents] = useState<AthleteData[]>([]);

    const autofillFromHeat = (heat: Heat | null) => {
        if (!heat) return;

        const newAthleteEvents: AthleteData[] = [];

        heat.events
            .sort((a, b) => (a.lane ? a.lane : 100) - (b.lane ? b.lane : 100))
            .forEach((event) => {
                newAthleteEvents.push({
                    id: event.youthAthlete.id,
                    lane: event.lane || 0,
                    name: event.youthAthlete.name,
                    bibNumber: event.youthAthlete.bibNumber,
                    minutes: '',
                    seconds: '',
                });
            });

        setAthleteEvents(newAthleteEvents.sort((a, b) => a.lane - b.lane));
    };

    const autofillNames = async () => {
        const toastID = toast.loading('Fetching athletes...', {
            className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
            position: 'top-center',
        });

        const bibs = athleteEvents.filter((event) => event.id === '' && event.bibNumber !== '').map((event) => parseInt(event.bibNumber));
        const athletesWithBibs = await findYouthAthletesFromBib(bibs);
        if (!athletesWithBibs.success || !athletesWithBibs.athletes) toast.error('Failed to get athletes');

        if (athletesWithBibs.athletes) {
            let newAthleteEvents = [...athleteEvents];
            athletesWithBibs.athletes.forEach((athlete) => {
                newAthleteEvents = newAthleteEvents.map((event) => (parseInt(event.bibNumber) === athlete.bibNumber ? { ...event, name: athlete.name, id: athlete.id } : { ...event }));
            });

            setAthleteEvents([...newAthleteEvents]);

            toast.success('Successfully fetched athletes', { id: toastID, duration: 0 });
            return;
        }

        toast.error('Failed to update athletes', { id: toastID, duration: 6000 });
    };

    const fillMinutes = () => {
        setAthleteEvents((prev) => prev.map((e) => ({ ...e, minutes: which === '400' ? '1' : '0' })));
    };

    const handleSubmit = async () => {
        const toastID = toast.loading('Publishing results...', {
            className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
            position: 'top-center',
        });

        const sendData: { id: string; seconds: number }[] = athleteEvents
            .filter((event) => event.id && event.minutes !== '' && event.seconds !== '')
            .map((event) => ({ id: event.id, seconds: parseInt(event.minutes) * 60 + parseFloat(event.seconds) }));

        const res = await publish100400Results(which, sendData);
        if (res.success) {
            toast.success('Successfully published results', { id: toastID, duration: 6000 });
        } else {
            toast.error('Failed to publish results.', { id: toastID, duration: 6000 });
        }
    };

    return (
        <div className='w-full flex justify-center mt-16 mid-mobile:mt-20'>
            <div className='w-full max-w-[1000px] flex flex-col mx-6 mt-8 mb-36'>
                <h1 className={`font-sour-gummy font-extrabold text-black text-3xl wide:text-4xl mid-tablet:text-5xl mb-4`}>
                    {which === '400' ? '400m' : '100m'} Results Publishing Interface
                </h1>

                <section className={`font-fredoka font-normal w-full h-full flex flex-col gap-4`}>
                    <span className='flex items-center gap-4'>
                        <span className={`text-black font-bold text-lg wide:text-xl mid-tablet:text-2xl`}>Heat:</span>
                        <Select
                            onValueChange={(value) => {
                                setSelectedHeat(heats.find((h) => h.id === value) || null);
                                autofillFromHeat(heats.find((h) => h.id === value) || null);
                            }}
                        >
                            <SelectTrigger
                                className={`font-fredoka font-normal ${
                                    selectedHeat ? 'text-black' : 'text-gray-500'
                                } px-4 py-3 ring-0 w-full h-11 text-base bg-background hover:bg-background-secondary transition-all appearance-none rounded-lg border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                            >
                                <SelectValue placeholder='Heats' className={`overflow-ellipsis text-gray-400`}>
                                    {selectedHeat ? `Heat #${selectedHeat.number}` : <span>Heat</span>}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent className={`font-fredoka font-normal bg-background p-1.5`}>
                                <SelectGroup>
                                    {heats.map((heat) => (
                                        <SelectItem key={heat.id} value={heat.id} className={`px-7 cursor-pointer hover:bg-background-light transition-all text-base`}>
                                            Heat #{heat.number}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </span>
                    <div className='bg-background p-2 rounded-lg border border-gray-200 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] h-full flex flex-col gap-4'>
                        <div>
                            <div className={`grid grid-rows-1 grid-cols-[12.5%_12.5%_7.5%_35%_16.25%_16.25%]`}>
                                <span className='border-b-2 border-r border-gray-400 grid place-items-center p-2'>Lane</span>
                                <span className='border-b-2 border-r border-gray-400 grid place-items-center p-2 relative'>
                                    <span>Bib #</span>
                                    {athleteEvents.some((event) => event.id === '' && event.bibNumber) && (
                                        <Search onClick={autofillNames} className='text-gray-400 absolute left-2 w-5 h-5 hover:text-gray-600 transition-all cursor-pointer' />
                                    )}
                                </span>
                                <span className='border-b-2 border-r border-gray-400 grid place-items-center p-2'>Valid</span>
                                <span className='border-b-2 border-r border-gray-400 grid place-items-center p-2'>Athlete Name</span>
                                <span className='border-b-2 border-r border-gray-400 grid place-items-center p-2 relative'>
                                    <span>Minutes</span>
                                    {athleteEvents.length > 0 && (
                                        <span
                                            onClick={() => fillMinutes()}
                                            className='text-gray-400 absolute left-2 top-1.5 ml-1 w-5 h-5 text-lg cursor-pointer hover:text-gray-500 transition-all'
                                        >
                                            {which === '400' ? '1' : '0'}
                                        </span>
                                    )}
                                </span>
                                <span className='border-b-2 border-gray-400 grid place-items-center p-2'>Seconds</span>
                            </div>
                            {athleteEvents
                                .sort((a, b) => a.lane - b.lane)
                                .map((athlete, index) => (
                                    <div key={athlete.id + index} className={`grid grid-rows-1 grid-cols-[12.5%_12.5%_7.5%_35%_16.25%_16.25%]`}>
                                        <span className='border-b border-r border-gray-400 grid place-items-center p-2'>{athlete.lane}</span>
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
                            setAthleteEvents((prev) => [...prev, { name: '', lane: athleteEvents.length + 1, id: '', bibNumber: '', minutes: '', seconds: '' }]);
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

export default Results;
