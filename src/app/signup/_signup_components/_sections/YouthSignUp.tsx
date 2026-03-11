'use client';

import { Check, HelpCircle, PlusCircle, Trash2, TriangleAlert } from 'lucide-react';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BirthDateSelector from '../BirthDateSelector';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import SubmitModal from '../SubmitModal';
import toast from 'react-hot-toast';
import { submitYouthParticipants } from '@/app/actions/signup';
import { cn } from '@/lib/utils';

type TrackEvent = '1600 meters' | '800 meters' | '4x100 meter relay' | '400 meters' | '100 meters' | 'long jump' | 'softball throw' | 'shot put';

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
    birthDay: string | number,
) => {
    return Math.floor((new Date().getTime() - new Date(`${birthYear}-${months[birthMonth]}-${birthDay}`).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
};

const SignUpForm = ({
    participantInfo,
    setParticipantInfo,
    deleteParticipant,
    numParticipants,
    i,
}: {
    participantInfo: ParticipantInfo[];
    setParticipantInfo: React.Dispatch<React.SetStateAction<ParticipantInfo[]>>;
    deleteParticipant: () => void;
    numParticipants: number;
    i: number;
}) => {
    const gradeLevelsArray: string[] = useMemo(() => ['8th Grade', '7th Grade', '6th Grade', '5th Grade', '4th Grade', '3rd Grade', '2nd Grade', '1st Grade', 'Kindergarten'], []);
    const eventsMapArray: { event: TrackEvent; conversion?: string }[] = useMemo(
        () => [
            { event: '1600 meters', conversion: '~1 mile' },
            { event: '400 meters', conversion: '~0.25 miles' },
            { event: '100 meters', conversion: '~0.06 miles' },
            { event: '4x100 meter relay', conversion: '4 athletes run 100 meters each' },
            { event: 'long jump' },
            { event: 'shot put', conversion: 'meant only for kids 5th grade and above' },
            { event: 'softball throw', conversion: 'a safe throwing event for 4th grade and below' },
        ],
        [],
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
        [participantInfo, index, setParticipantInfo],
    );

    return (
        <form className='flex flex-col gap-4 px-6 py-4'>
            <div className='flex justify-between items-center'>
                <h1 className={`font-fredoka font-semibold text-[22px]`}>Participant #{index + 1}</h1>
                {numParticipants > 1 && <Trash2 className='cursor-pointer text-gray-400 hover:text-red-500 transition-all' onClick={deleteParticipant} />}
            </div>
            {Object.keys(participantInfo[index]).map(
                (key) =>
                    (key === 'firstName' || key === 'lastName') && (
                        <div key={key} className='relative'>
                            <input
                                type='text'
                                className={`font-fredoka font-normal px-4 pt-3 pb-2 w-full h-11 text-lg bg-background appearance-none rounded-[10px] border border-gray-100 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] focus:outline-none focus:ring-0 focus:border-primary-light peer`}
                                autoComplete='off'
                                onChange={(e) => handleInputChange(e, key)}
                                value={participantInfo[index][key]}
                                placeholder=''
                            />
                            <label
                                className={`font-fredoka font-normal absolute pointer-events-none capitalize text-base text-gray-500 duration-300 transform translate-x-[2px] translate-y-[-12.5px] scale-75 top-0 z-10 origin-[0] bg-background px-2 peer-focus:px-2 peer-focus:text-primary-light peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-focus:top-3.5 peer-focus:scale-75 peer-focus:-translate-y-7 rtl:peer-focus:translate-x-1/2 rtl:peer-focus:left-auto start-1`}
                            >
                                {key
                                    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
                                    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1 $2')
                                    .toLowerCase()}
                            </label>
                        </div>
                    ),
            )}
            <div className='flex flex-col gap-4'>
                <h2 className={`font-fredoka font-semibold text-xl`}>Grade Level</h2>

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
                        className={`font-fredoka font-normal ${
                            participantInfo[index].gradeLevel !== '' ? 'text-black' : 'text-gray-500'
                        } px-4 py-3 ring-0 w-full h-11 text-base bg-background hover:bg-background-secondary transition-all cursor-pointer appearance-none rounded-[10px] border border-gray-100 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                    >
                        <SelectValue placeholder='Grade Level' className={`overflow-ellipsis text-gray-400`}>
                            {participantInfo[index].gradeLevel !== '' ? participantInfo[index].gradeLevel : <span>Grade Level</span>}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent className='bg-background rounded-[13px] border border-gray-100 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
                        <SelectGroup>
                            {gradeLevelsArray.map((gradeLevel, index) => (
                                <SelectItem key={gradeLevel + index} value={gradeLevel} className='hover:bg-background-dark font-fredoka text-base cursor-pointer'>
                                    {gradeLevel}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className='flex flex-col gap-2'>
                <h2 className={`font-fredoka font-semibold text-xl`}>Event(s)</h2>

                {eventsMapArray.map(({ event, conversion }) => (
                    <div
                        key={event}
                        className={cn(
                            'flex items-center gap-1.5',
                            (event === 'shot put' && participantInfo[index].events.includes('softball throw')) ||
                                (event === 'softball throw' && participantInfo[index].events.includes('shot put'))
                                ? 'opacity-30 cursor-not-allowed'
                                : '',
                        )}
                    >
                        <div
                            className={cn(
                                'w-5 h-5 flex justify-center items-center rounded-md cursor-pointer transition-all',
                                participantInfo[index].events.includes(event)
                                    ? 'bg-primary border-none shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'
                                    : 'bg-background border-2 border-gray-200',
                                (event === 'shot put' && participantInfo[index].events.includes('softball throw')) ||
                                    (event === 'softball throw' && participantInfo[index].events.includes('shot put'))
                                    ? 'pointer-events-none'
                                    : '',
                            )}
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
                            className={cn(
                                'margin-top-0 text-md transition-all select-none flex items-center gap-x-1.5',
                                participantInfo[index].events.includes(event) ? `font-fredoka font-semibold text-black` : `font-fredoka font-normal text-gray-400`,
                                (event === 'shot put' && participantInfo[index].events.includes('softball throw')) ||
                                    (event === 'softball throw' && participantInfo[index].events.includes('shot put'))
                                    ? 'pointer-events-none'
                                    : '',
                            )}
                        >
                            {event}
                            {conversion !== undefined && conversion !== null && (
                                <Popover>
                                    <PopoverTrigger>
                                        {event === 'shot put' ? (
                                            <TriangleAlert width={17} height={17} className='text-primary cursor-pointer' />
                                        ) : (
                                            <HelpCircle width={17} height={17} className='text-gray-500 cursor-pointer' />
                                        )}
                                    </PopoverTrigger>
                                    <PopoverContent side='top' className={`font-fredoka font-normal w-full h-full p-2 bg-background text-gray-500 text-sm`}>
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

    const handleSubmit = useCallback(async () => {
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
                toast.error('Please fill out all the fields', {
                    className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
                    position: 'top-center',
                    duration: 4000,
                });

                error = true;
                return;
            }

            obj.age = calculateAge(obj.birthYear, obj.birthMonth.toLowerCase(), obj.birthDay);
            sendObject.push(obj);
        });

        if (error) return;

        const toastID = toast.loading('Signing up...', { className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`, position: 'top-center' });

        const res = await submitYouthParticipants(sendObject);
        if (res.success) {
            toast.success('Successfully signed up!', {
                id: toastID,
                duration: 10000,
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
        } else {
            toast.error(`Couldn't sign up. Please try again.`, {
                id: toastID,
                duration: 10000,
            });
        }
    }, [participantInfo]);

    return (
        <>
            <div className='mt-5 flex flex-col min-[900px]:flex-row gap-8 items-start'>
                <div className='w-full min-[900px]:w-1/3 order-first min-[900px]:order-last'>
                    <div className='sticky min-[900px]:mt-10 font-fredoka top-24 bg-background rounded-xl p-6 flex flex-col gap-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
                        <h2 className='font-fredoka font-semibold text-xl border-b pb-2'>Registration Summary</h2>
                        <ul className='flex flex-col-reverse gap-3'>
                            {participantInfo.map((p, i) => (
                                <li key={i} className='flex justify-between items-center text-lg'>
                                    <span className='truncate pr-4 font-fredoka'>{p.firstName || p.lastName ? `${p.firstName} ${p.lastName}` : `Participant #${i + 1}`}</span>
                                    <span className='font-semibold text-primary'>
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                        }).format(10)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <div className='border-t pt-4 flex justify-between items-center text-xl font-bold tracking-wide'>
                            <span>Total Due:</span>
                            <span className='text-primary'>
                                {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                }).format(participantInfo.length * 10)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className='flex-1 w-full'>
                    <div className='flex gap-2 items-center'>
                        <h1 className={`font-fredoka font-semibold text-2xl`}>Participant(s)</h1>
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
                            className='transition-all hover:scale-110 cursor-pointer text-primary'
                        />
                    </div>
                    <div className='flex gap-2 flex-col-reverse'>
                        {participantInfo.map((_, index) => (
                            <div
                                key={index}
                                className='rounded-[18px] shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] mt-2'
                            >
                                <SignUpForm
                                    participantInfo={participantInfo}
                                    deleteParticipant={() => setParticipantInfo(participantInfo.filter((_, i) => i !== index))}
                                    numParticipants={participantInfo.length}
                                    setParticipantInfo={setParticipantInfo}
                                    i={index}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='w-full flex justify-center mt-6'>
                <button
                    disabled={
                        !!participantInfo.find(
                            (p) =>
                                p.firstName.length === 0 ||
                                p.lastName.length === 0 ||
                                p.gradeLevel.length === 0 ||
                                p.events.length === 0 ||
                                p.birthYear.length === 0 ||
                                p.birthMonth.length === 0 ||
                                p.birthDay.length === 0,
                        )
                    }
                    onClick={() => setSubmitModalOpen(true)}
                    className={`font-fredoka disabled:opacity-50 disabled:pointer-events-none cursor-pointer font-semibold bg-primary text-white text-xl shadow-md shadow-primary-dark rounded-[18px] py-2 px-24 hover:brightness-[1.1] transition-all`}
                >
                    Submit
                </button>
            </div>
            <SubmitModal open={submitModalOpen} setOpen={setSubmitModalOpen} handleSubmit={handleSubmit} signUpView='youth' />
        </>
    );
};

export default YouthSignUp;
