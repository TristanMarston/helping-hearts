'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Check, Home, PlusCircle, X } from 'lucide-react';
import Link from 'next/link';
import { getCollection, submitFieldResults } from '@/app/actions/admin';
import SearchBar from './SearchBar';
import { cn } from '@/lib/utils';

type AthleteData = {
    id: string;
    name: string;
    feet: string;
    inches: string;
};

const Results = ({ which }: { which: 'softball-throw' | 'long-jump' }) => {
    const [athleteEvents, setAthleteEvents] = useState<AthleteData[]>([]);
    const [youthAthletes, setYouthAthletes] = useState<any[]>([]);
    const [chosenAthlete, setChosenAthlete] = useState<string[]>([]);

    useEffect(() => {
        const fetchYouthAthletes = async () => {
            const res = await getCollection('youth-athletes');
            if (res.success && res.data) {
                setYouthAthletes(res.data);
            }
        };

        fetchYouthAthletes();
    }, []);

    const handleSubmit = async () => {
        const toastID = toast.loading('Publishing results...', {
            className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
            position: 'top-center',
        });

        const sendData: { id: string; feet: number; inches: number }[] = athleteEvents
            .filter((event) => event.id && event.id !== '' && event.feet !== '' && event.inches !== '')
            .map((event) => ({ id: event.id, feet: parseInt(event.feet), inches: parseInt(event.inches) }));

        const res = await submitFieldResults(which, sendData);
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
                    {which === 'softball-throw' ? 'Softball Throw' : 'Long Jump'} Results Publishing Interface
                </h1>

                <section className={`font-fredoka font-normal w-full h-full flex flex-col gap-4`}>
                    <div className='bg-background p-2 rounded-lg border border-gray-200 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] h-full flex flex-col gap-4'>
                        <div>
                            <div className={`grid grid-rows-1 grid-cols-[40%_10%_25%_25%]`}>
                                <span className='border-b-2 border-r border-gray-400 grid place-items-center p-2'>Athlete Name</span>
                                <span className='border-b-2 border-r border-gray-400 grid place-items-center p-2'>Valid</span>
                                <span className='border-b-2 border-r border-gray-400 grid place-items-center p-2'>Feet</span>
                                <span className='border-b-2 border-gray-400 grid place-items-center p-2'>Inches</span>
                            </div>
                            {athleteEvents.map((athlete, index) => (
                                <div key={athlete.id + index} className={`grid grid-rows-1 grid-cols-[40%_10%_25%_25%]`}>
                                    <span className={cn('border-b border-r border-gray-400 flex items-center', athlete.id ? 'pl-3' : '')}>
                                        {athlete.id ? (
                                            `${athlete.name}`
                                        ) : (
                                            <SearchBar
                                                response={youthAthletes}
                                                chosenAthlete={chosenAthlete}
                                                setChosenAthlete={setChosenAthlete}
                                                index={index}
                                                onSubmit={(name, events, id) => {
                                                    setAthleteEvents((prev) => prev.map((athlete, i) => (i === index ? { ...athlete, name, id } : athlete)));
                                                }}
                                            />
                                        )}
                                    </span>
                                    <span className='border-b border-r border-gray-400 grid place-items-center p-2'>
                                        {athlete.id && athlete.id !== '' && athlete.feet !== '' && athlete.inches !== '' ? (
                                            <Check className='rounded-full bg-green-400 text-white p-1 w-6 h-6 shadow-sm' />
                                        ) : (
                                            <X className='rounded-full bg-red-400 text-white p-1 w-6 h-6 shadow-sm' />
                                        )}
                                    </span>
                                    {/* <input
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
                                        /> */}
                                    <input
                                        type='text'
                                        className={`font-fredoka font-normal p-2 w-full text-base caret-black text-black placeholder:text-gray-500 bg-background outline-none border-b border-r border-gray-400 text-center appearance-none`}
                                        autoComplete='off'
                                        onChange={(e) =>
                                            setAthleteEvents((prev) => {
                                                const newAthleteData = [...prev];
                                                newAthleteData[index] = { ...newAthleteData[index], feet: e.target.value };
                                                return newAthleteData;
                                            })
                                        }
                                        value={athlete.feet}
                                        placeholder=' '
                                    />
                                    <input
                                        type='text'
                                        className={`font-fredoka font-normal p-2 w-full text-base caret-black text-black placeholder:text-gray-500 bg-background outline-none border-b border-r border-gray-400 text-center appearance-none`}
                                        autoComplete='off'
                                        onChange={(e) =>
                                            setAthleteEvents((prev) => {
                                                const newAthleteData = [...prev];
                                                newAthleteData[index] = { ...newAthleteData[index], inches: e.target.value };
                                                return newAthleteData;
                                            })
                                        }
                                        value={athlete.inches}
                                        placeholder=' '
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div
                        onClick={() => {
                            setAthleteEvents((prev) => [...prev, { name: '', id: '', feet: '', inches: '' }]);
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
