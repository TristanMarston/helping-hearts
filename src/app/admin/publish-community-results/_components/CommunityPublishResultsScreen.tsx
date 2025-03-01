'use client';

import axios from 'axios';
import { Fredoka, Sour_Gummy } from 'next/font/google';
import { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Home, PlusCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const sourGummyBold = Sour_Gummy({ weight: '800', subsets: ['latin'] });
const fredokaLight = Fredoka({ weight: '400', subsets: ['latin'] });
const fredokaBold = Fredoka({ weight: '600', subsets: ['latin'] });

export type AthleteData = {
    firstName: string;
    lastName: string;
    minutes?: string;
    athleteID: string;
    score: string;
};

type AthleteDataSend = {
    athleteID: string;
    score: string;
};

type EventUnits = 'minutes & seconds' | 'meters' | 'feet & inches';

const PublishResultsScreen = () => {
    const [athleteData, setAthleteData] = useState<AthleteData[]>([{ firstName: '', lastName: '', athleteID: '', score: '' }]);
    const [response, setResponse] = useState<any[]>([]);
    const [chosenAthlete, setChosenAthlete] = useState<{ firstName: string; lastName: string }[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastID = toast.loading('Publishing results...', {
            className: `${fredokaBold.className} !bg-background !text-black`,
            position: 'bottom-right',
        });

        const sendData: AthleteDataSend[] = [];
        athleteData.forEach((athlete) => {
            if (athlete.athleteID !== '') {
                sendData.push({
                    athleteID: athlete.athleteID,
                    score: String(Number(athlete.minutes) * 60 + Number(athlete.score)),
                });
            }
        });

        axios
            .post(`/api/admin/post-results/dpi-community-participants`, JSON.stringify(sendData))
            .then((res) => {
                if (res.status === 200) {
                    toast.success('Successfully published results!', {
                        id: toastID,
                        duration: 4000,
                    });
                    setAthleteData([{ firstName: '', lastName: '', athleteID: '', minutes: '', score: '' }]);
                    setChosenAthlete([]);
                }
            })
            .catch((err) => {
                toast.error('Could not publish results.', {
                    id: toastID,
                    duration: 4000,
                });
            });

        console.log(sendData);
    };

    const fetchCollection = async () => {
        axios
            .get(`/api/admin/get/dpi-community-participants`)
            .then((res) => {
                if (res.status === 200) {
                    setResponse(res.data.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        fetchCollection();
    }, []);

    return (
        <div className='w-full flex justify-center mt-16 mid-mobile:mt-20'>
            <div className='w-full max-w-[1000px] flex flex-col mx-6 mt-8 mb-36'>
                <h1 className={`${sourGummyBold.className} text-black text-3xl wide:text-4xl mid-tablet:text-5xl mb-4`}>Community Results Publishing Interface</h1>
                <section className={`${fredokaLight.className} w-full h-full flex flex-col gap-4`}>
                    <div className='bg-background p-2 rounded-lg border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] h-full flex flex-col gap-4'>
                        <div>
                            <div className={`grid grid-rows-1 grid-cols-[5%_7.5%_40%_23.75%_23.75%]`}>
                                <span className='border-b-2 border-r border-gray-400 grid place-items-center p-2'>#</span>
                                <span className='border-b-2 border-r border-gray-400 grid place-items-center p-2'>Valid</span>
                                <span className='border-b-2 border-r border-gray-400 grid place-items-center p-2'>Athlete Name</span>
                                <span className='border-b-2 border-r border-gray-400 grid place-items-center p-2'>Minutes</span>
                                <span className='border-b-2 border-r border-gray-400 grid place-items-center p-2'>Seconds</span>
                            </div>
                            {athleteData.map((athlete, index) => (
                                <div key={athlete.athleteID + index} className={`grid grid-rows-1 grid-cols-[5%_7.5%_40%_23.75%_23.75%]`}>
                                    <span className='border-b border-r border-gray-400 grid place-items-center p-2'>{index + 1}</span>
                                    <span className='border-b border-r border-gray-400 grid place-items-center p-2'>
                                        {athlete.athleteID !== '' && athlete.score !== '' && athlete.minutes !== '' ? (
                                            <Check className='rounded-full bg-green-400 text-white p-1 w-8 h-8 shadow-sm' />
                                        ) : (
                                            <X className='rounded-full bg-red-400 text-white p-1 w-8 h-8 shadow-sm' />
                                        )}
                                    </span>
                                    <span className='border-b border-r border-gray-400 grid place-items-center'>
                                        <SearchBar
                                            response={response}
                                            chosenAthlete={chosenAthlete}
                                            setChosenAthlete={setChosenAthlete}
                                            index={index}
                                            onSubmit={(firstName, lastName, events, id) => {
                                                setAthleteData((prev) => {
                                                    const newAthleteData = [...prev];
                                                    newAthleteData[index] = { firstName, lastName, athleteID: id, score: '' };
                                                    console.log(newAthleteData);
                                                    return newAthleteData;
                                                });
                                            }}
                                        />
                                    </span>
                                    <input
                                        type='text'
                                        className={`${fredokaLight.className} p-2 w-full text-base caret-black text-black placeholder:text-gray-500 bg-background outline-none border-b border-r border-gray-400 text-center appearance-none`}
                                        autoComplete='off'
                                        onChange={(e) =>
                                            setAthleteData((prev) => {
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
                                        className={`${fredokaLight.className} p-2 w-full text-base caret-black text-black placeholder:text-gray-500 bg-background outline-none border-b border-r border-gray-400 text-center appearance-none`}
                                        autoComplete='off'
                                        onChange={(e) =>
                                            setAthleteData((prev) => {
                                                const newAthleteData = [...prev];
                                                newAthleteData[index] = { ...newAthleteData[index], score: e.target.value };
                                                return newAthleteData;
                                            })
                                        }
                                        value={athlete.score}
                                        placeholder=' '
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div
                        onClick={() => {
                            setAthleteData((prev) => [...prev, { firstName: '', lastName: '', athleteID: '', score: '' }]);
                        }}
                        className={`${fredokaBold.className} bg-background flex justify-center items-center gap-2 text-primary py-2 px-3 wide:py-2.5 wide:text-lg tracking-wider w-full text-center rounded-xl shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] cursor-pointer transition-all hover:brightness-110`}
                    >
                        <PlusCircle strokeWidth={2.5} />
                        Add Athlete
                    </div>
                    <Link
                        href='/admin'
                        className={`${fredokaBold.className} bg-background flex justify-center items-center gap-2 text-primary py-2 px-3 wide:py-2.5 wide:text-lg tracking-wider w-full text-center rounded-xl shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] cursor-pointer transition-all hover:brightness-110`}
                    >
                        <Home strokeWidth={2.5} />
                        Admin Homepage
                    </Link>
                    <button
                        type='submit'
                        onClick={handleSubmit}
                        className={`${fredokaBold.className} bg-primary py-2 px-3 wide:py-2.5 wide:text-lg tracking-wider text-white w-full text-center rounded-xl shadow-lg cursor-pointer transition-all hover:brightness-110`}
                    >
                        Submit
                    </button>
                </section>
            </div>
        </div>
    );
};

export default PublishResultsScreen;
