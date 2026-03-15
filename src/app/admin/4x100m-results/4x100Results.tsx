'use client';

import { get4x100Heats, publish4x100Results } from '@/app/actions/heats';
import { RelayName } from '@prisma/client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Home, PlusCircle, X } from 'lucide-react';
import Link from 'next/link';

type Heat = {
    id: string;
    teams: Team[];
    number: number;
    open: boolean;
};

type Team = {
    id: string;
    name: RelayName;
    performance: string;
    lane: number | null;
    unit: string;
    year: number;
};

type AthleteData = {
    id: string;
    lane: number;
    name: RelayName | null;
    minutes: string;
    seconds: string;
};

const Results = () => {
    const [heats, setHeats] = useState<Heat[]>([]);
    const [selectedHeat, setSelectedHeat] = useState<Heat | null>(null);

    const fetchHeats = async () => {
        const toastID = toast.loading('Fetching heats...', {
            className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
            position: 'top-center',
        });

        const res = await get4x100Heats();
        if (!res.success || !res.heats) toast.error('Unable to fetch heats.', { id: toastID, duration: 6000 });

        if (res.success) {
            setHeats(
                res.heats.map((heat) => ({
                    id: heat.id,
                    teams: heat.relayTeams,
                    number: heat.number,
                    open: true,
                })),
            );
        } else {
            toast.error('Unable to fetch heats.', { id: toastID, duration: 6000 });
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

        heat.teams
            .sort((a, b) => (a.lane ? a.lane : 100) - (b.lane ? b.lane : 100))
            .forEach((team) => {
                newAthleteEvents.push({
                    id: team.id,
                    lane: team.lane || 0,
                    name: team.name,
                    minutes: '',
                    seconds: '',
                });
            });

        setAthleteEvents(newAthleteEvents.sort((a, b) => a.lane - b.lane));
    };

    const handleSubmit = async () => {
        const toastID = toast.loading('Publishing results...', {
            className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
            position: 'top-center',
        });

        const sendData: { id: string; seconds: number }[] = athleteEvents
            .filter((event) => event.id && event.minutes !== '' && event.seconds !== '')
            .map((event) => ({ id: event.id, seconds: parseInt(event.minutes) * 60 + parseFloat(event.seconds) }));

        const res = await publish4x100Results(sendData);
        if (res.success) {
            toast.success('Successfully published results', { id: toastID, duration: 6000 });
        } else {
            toast.error('Failed to publish results.', { id: toastID, duration: 6000 });
        }
    };

    return (
        <div className='w-full flex justify-center mt-16 mid-mobile:mt-20'>
            <div className='w-full max-w-[1000px] flex flex-col mx-6 mt-8 mb-36'>
                <h1 className={`font-sour-gummy font-extrabold text-black text-3xl wide:text-4xl mid-tablet:text-5xl mb-4`}>4x100m Results Publishing Interface</h1>

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
                            <div className={`grid grid-rows-1 grid-cols-[12.5%_7.5%_47.5%_16.25%_16.25%]`}>
                                <span className='border-b-2 border-r border-gray-400 grid place-items-center p-2'>Lane</span>
                                <span className='border-b-2 border-r border-gray-400 grid place-items-center p-2'>Valid</span>
                                <span className='border-b-2 border-r border-gray-400 grid place-items-center p-2'>Team Name</span>
                                <span className='border-b-2 border-r border-gray-400 grid place-items-center p-2 relative'>Minutes</span>
                                <span className='border-b-2 border-gray-400 grid place-items-center p-2'>Seconds</span>
                            </div>
                            {athleteEvents
                                .sort((a, b) => a.lane - b.lane)
                                .map((athlete, index) => (
                                    <div key={athlete.id + index} className={`grid grid-rows-1 grid-cols-[12.5%_7.5%_47.5%_16.25%_16.25%]`}>
                                        <span className='border-b border-r border-gray-400 grid place-items-center p-2'>{athlete.lane}</span>
                                        <span className='border-b border-r border-gray-400 grid place-items-center p-2'>
                                            {athlete.id && athlete.minutes !== '' && athlete.seconds !== '' ? (
                                                <Check className='rounded-full bg-green-400 text-white p-1 w-6 h-6 shadow-sm' />
                                            ) : (
                                                <X className='rounded-full bg-red-400 text-white p-1 w-6 h-6 shadow-sm' />
                                            )}
                                        </span>
                                        <span className='border-b border-r border-gray-400 grid place-items-center p-2'>{athlete.name ? athlete.name.replaceAll('_', ' ') : ''}</span>
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
                            setAthleteEvents((prev) => [...prev, { name: null, lane: athleteEvents.length + 1, id: '', minutes: '', seconds: '' }]);
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
