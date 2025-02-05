'use client';

import { Check, HelpCircle, PlusCircle } from 'lucide-react';
import { Fredoka } from 'next/font/google';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BirthDateSelector from '../BirthDateSelector';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import SubmitModal from '../SubmitModal';
import toast from 'react-hot-toast';
import axios from 'axios';

const fredokaBold = Fredoka({ weight: '600', subsets: ['latin'] });
const fredokaLight = Fredoka({ weight: '400', subsets: ['latin'] });

type TrackEvent = '1600 meters' | '800 meters' | '400 meters' | '100 meters';

type ParticipantInfo = {
    firstName: string;
    lastName: string;
    birthYear: string;
    birthMonth: string;
    birthDay: string;
    gradeLevel: string;
    events: TrackEvent[];
};

const months = {
    january: '01',
    february: '02',
    march: '03',
    april: '04',
    may: '05',
    june: '06',
    july: '07',
    august: '08',
    september: '09',
    october: '10',
    november: '11',
    december: '12',
};

const calculateAge = (
    birthYear: string | number,
    birthMonth: 'january' | 'february' | 'march' | 'april' | 'may' | 'june' | 'july' | 'august' | 'september' | 'october' | 'november' | 'december',
    birthDay: string | number
) => {
    return Math.floor((new Date().getTime() - new Date(`${birthYear}-${months[birthMonth]}-${birthDay}`).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
};

const SignUpForm = ({
    participantInfo,
    setParticipantInfo,
    i,
}: {
    participantInfo: ParticipantInfo[];
    setParticipantInfo: React.Dispatch<React.SetStateAction<ParticipantInfo[]>>;
    i: number;
}) => {
    const gradeLevelsArray: string[] = useMemo(() => ['8th Grade', '7th Grade', '6th Grade', '5th Grade', '4th Grade', '3rd Grade', '2nd Grade', '1st Grade', 'Kindergarten'], []);
    const eventsMapArray: { event: TrackEvent; conversion?: string }[] = useMemo(
        () => [
            { event: '1600 meters', conversion: '~1 mile' },
            { event: '800 meters', conversion: '~0.5 miles' },
            { event: '400 meters', conversion: '~0.25 miles' },
            { event: '100 meters', conversion: '~0.06 miles' },
        ],
        []
    );
    const index = i;

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
            const updatedInfo = [...participantInfo];
            updatedInfo[index] = {
                ...updatedInfo[index],
                [key]: e.target.value,
            };
            setParticipantInfo(updatedInfo);
        },
        [participantInfo, index, setParticipantInfo]
    );

    return (
        <form className='flex flex-col gap-4 px-6 py-4'>
            <h1 className={`${fredokaBold.className} text-[22px]`}>Participant #{index + 1}</h1>
            {Object.keys(participantInfo[index]).map(
                (key) =>
                    (key === 'firstName' || key === 'lastName') && (
                        <div key={key} className='relative'>
                            <input
                                type='text'
                                className={`${fredokaLight.className} px-4 pt-3 pb-2 w-full h-11 text-lg bg-background appearance-none rounded-md border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] focus:outline-none focus:ring-0 focus:border-primary-light peer`}
                                autoComplete='off'
                                onChange={(e) => handleInputChange(e, key)}
                                value={participantInfo[index][key]}
                                placeholder=''
                            />
                            <label
                                className={`${fredokaLight.className} absolute pointer-events-none capitalize text-base text-gray-500 duration-300 transform translate-x-[2px] translate-y-[-12.5px] scale-75 top-0 z-10 origin-[0] bg-background px-2 peer-focus:px-2 peer-focus:text-primary-light peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-focus:top-3.5 peer-focus:scale-75 peer-focus:-translate-y-7 rtl:peer-focus:translate-x-1/2 rtl:peer-focus:left-auto start-1`}
                            >
                                {key
                                    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
                                    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1 $2')
                                    .toLowerCase()}
                            </label>
                        </div>
                    )
            )}
            <div className='flex flex-col gap-4'>
                <h2 className={`${fredokaBold.className} text-xl`}>Grade Level</h2>

                <Select
                    onValueChange={(value) => {
                        setParticipantInfo((prev) => {
                            const updatedInfo = [...prev];
                            updatedInfo[index] = {
                                ...updatedInfo[index],
                                gradeLevel: value,
                            };
                            return updatedInfo;
                        });
                    }}
                >
                    <SelectTrigger
                        className={`${fredokaLight.className} ${
                            participantInfo[index].gradeLevel !== '' ? 'text-black' : 'text-gray-500'
                        } px-4 py-3 ring-0 w-full h-11 text-base bg-background hover:bg-background-secondary transition-all  appearance-none rounded-md border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                    >
                        <SelectValue placeholder='Grade Level' className={`overflow-ellipsis text-gray-400`}>
                            {participantInfo[index].gradeLevel !== '' ? participantInfo[index].gradeLevel : <span>Grade Level</span>}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent className='bg-background'>
                        <SelectGroup>
                            {gradeLevelsArray.map((gradeLevel, index) => (
                                <SelectItem key={gradeLevel + index} value={gradeLevel} className='hover:bg-background-dark'>
                                    {gradeLevel}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className='flex flex-col gap-2'>
                <h2 className={`${fredokaBold.className} text-xl`}>Event(s)</h2>

                {eventsMapArray.map(({ event, conversion }) => (
                    <div key={event} className='flex items-center gap-1'>
                        <div
                            className={`${
                                participantInfo[index].events.includes(event)
                                    ? 'bg-primary border-none shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'
                                    : 'bg-background border-2'
                            } w-5 h-5 flex justify-center items-center rounded-md cursor-pointer transition-all`}
                            onClick={() => {
                                setParticipantInfo((prev) => {
                                    const updatedInfo = prev.map((info, idx) => {
                                        if (idx !== index) return info;
                                        const events = info.events.includes(event) ? info.events.filter((e) => e !== event) : [...info.events, event];
                                        return { ...info, events };
                                    });
                                    return updatedInfo;
                                });
                            }}
                        >
                            {participantInfo[index].events.includes(event) && <Check color='white' strokeWidth={3} width={14} height={14} />}
                        </div>
                        <label
                            className={`${
                                participantInfo[index].events.includes(event) ? `${fredokaBold.className} text-black` : `${fredokaLight.className} text-gray-400`
                            }  margin-top-0 text-md transition-all select-none flex items-center gap-x-1.5`}
                        >
                            {event}
                            {conversion !== null && (
                                <Popover>
                                    <PopoverTrigger>
                                        <HelpCircle width={17} height={17} className='text-gray-500' />
                                    </PopoverTrigger>
                                    <PopoverContent side='top' className={`${fredokaLight.className} w-full h-full p-2 bg-background text-gray-500 text-sm`}>
                                        {conversion}
                                    </PopoverContent>
                                </Popover>
                            )}
                        </label>
                    </div>
                ))}
            </div>
            <BirthDateSelector
                birthDate={{ day: participantInfo[index].birthDay, month: participantInfo[index].birthMonth, year: participantInfo[index].birthYear }}
                changeBirthDay={(day: string) => {
                    setParticipantInfo((prev) => {
                        const updatedInfo = [...prev];
                        updatedInfo[index] = {
                            ...updatedInfo[index],
                            birthDay: day,
                        };
                        return updatedInfo;
                    });
                }}
                changeBirthMonth={(month: string) => {
                    setParticipantInfo((prev) => {
                        const updatedInfo = [...prev];
                        updatedInfo[index] = {
                            ...updatedInfo[index],
                            birthMonth: month,
                        };
                        return updatedInfo;
                    });
                }}
                changeBirthYear={(year: string) => {
                    setParticipantInfo((prev) => {
                        const updatedInfo = [...prev];
                        updatedInfo[index] = {
                            ...updatedInfo[index],
                            birthYear: year,
                        };
                        return updatedInfo;
                    });
                }}
            />
        </form>
    );
};

const YouthSignUp = () => {
    const [participantInfo, setParticipantInfo] = useState<ParticipantInfo[]>([
        {
            firstName: '',
            lastName: '',
            birthYear: '',
            birthMonth: '',
            birthDay: '',
            gradeLevel: '',
            events: [],
        },
    ]);
    const [submitModalOpen, setSubmitModalOpen] = useState(false);

    const handleSubmit = useCallback(() => {
        let error = false;
        const sendObject: any = [];

        participantInfo.forEach((participant) => {
            const obj: any = {};
            Object.keys(participant).forEach((k) => {
                let key = k as keyof ParticipantInfo;
                if (participant[key] && participant[key].toString().length > 0) obj[key] = key !== 'birthDay' && key !== 'birthYear' ? participant[key] : parseInt(participant[key]);
            });

            if (!obj.firstName || !obj.lastName || !obj.gradeLevel || !obj.events || !obj.birthYear || !obj.birthMonth || !obj.birthDay) {
                // toastMessage('Please fill out all fields.', false, 2000, 'signupError');
                toast.error('Please fill out all the fields', { className: `${fredokaBold.className} !bg-background !text-black`, position: 'bottom-right', duration: 4000 });

                error = true;
                return;
            }

            obj.age = calculateAge(obj.birthYear, obj.birthMonth.toLowerCase(), obj.birthDay);
            sendObject.push(obj);
        });

        if (error) return;

        const toastID = toast.loading('Signing up...', { className: `${fredokaBold.className} !bg-background !text-black`, position: 'bottom-right' });

        axios
            .post(`/api/admin/post/dpi-youth-participants`, sendObject)
            .then((res) => {
                if (res.status === 200) {
                    toast.success('Successfully signed up!', {
                        id: toastID,
                        duration: 4000,
                    });

                    setParticipantInfo([
                        {
                            firstName: '',
                            lastName: '',
                            birthYear: '',
                            birthMonth: '',
                            birthDay: '',
                            gradeLevel: '',
                            events: [],
                        },
                    ]);
                }
            })
            .catch((err) => {
                toast.error(`Couldn't sign up. Please try again.`, {
                    id: toastID,
                    duration: 4000,
                });
            });
    }, [participantInfo]);

    return (
        <>
            <div className='mt-5 flex flex-col gap-5'>
                <div>
                    <div className='flex gap-2 items-center'>
                        <h1 className={`${fredokaBold.className} text-2xl`}>Participant(s)</h1>
                        <PlusCircle
                            size={20}
                            strokeWidth={3}
                            onClick={() =>
                                setParticipantInfo((prev) => [
                                    ...prev,
                                    {
                                        firstName: '',
                                        lastName: '',
                                        birthYear: '',
                                        birthMonth: '',
                                        birthDay: '',
                                        gradeLevel: '',
                                        events: [],
                                    },
                                ])
                            }
                            className='transition-all hover:scale-110 cursor-pointer'
                        />
                    </div>
                    {participantInfo.map((_, index) => (
                        <div key={index} className='rounded-lg border mt-2'>
                            <SignUpForm participantInfo={participantInfo} setParticipantInfo={setParticipantInfo} i={index} />
                        </div>
                    ))}
                    <div className='w-full flex justify-center mt-6'>
                        <button
                            onClick={() => setSubmitModalOpen(true)}
                            className={`${fredokaBold.className} bg-primary text-white text-lg shadow-xl rounded-full py-2 px-16 hover:brightness-[1.1] transition-all`}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
            <SubmitModal open={submitModalOpen} setOpen={setSubmitModalOpen} handleSubmit={handleSubmit} signUpView='youth' />
        </>
    );
};

export default YouthSignUp;
