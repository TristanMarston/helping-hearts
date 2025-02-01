'use client';

import { Check, HelpCircle, PlusCircle } from 'lucide-react';
import { Fredoka, Sour_Gummy } from 'next/font/google';
import React, { useEffect, useState } from 'react';
import BirthDateSelector from '../BirthDateSelector';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import SubmitModal from '../SubmitModal';
import toast from 'react-hot-toast';
import axios from 'axios';
import { toastMessage } from '../../page';

const sourGummyBold = Sour_Gummy({ weight: '800', subsets: ['latin'] });
const sourGummySemibold = Sour_Gummy({ weight: '700', subsets: ['latin'] });
const fredokaBold = Fredoka({ weight: '600', subsets: ['latin'] });
const fredokaLight = Fredoka({ weight: '400', subsets: ['latin'] });

// type TrackEvent = '1600 meters' | '800 meters' | '400 meters' | '100 meters';

type VolunteerInfo = {
    firstName: string;
    lastName: string;
    email: string;
    birthYear: string;
    birthMonth: string;
    birthDay: string;
};

const SignUpForm = ({ volunteerInfo, setVolunteerInfo }: { volunteerInfo: VolunteerInfo; setVolunteerInfo: React.Dispatch<React.SetStateAction<VolunteerInfo>> }) => {
    return (
        <form className='flex flex-col gap-4 px-4 py-4'>
            <h1 className={`${fredokaBold.className} text-[22px]`}>Volunteer Info</h1>
            {Object.keys(volunteerInfo).map(
                (key) =>
                    (key === 'firstName' || key === 'lastName' || key === 'email') && (
                        <div key={key} className='relative'>
                            <input
                                type='text'
                                className={`${fredokaLight.className} px-4 pt-3 pb-2 w-full h-11 text-lg bg-background appearance-none rounded-md border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] focus:outline-none focus:ring-0 focus:border-primary-light peer`}
                                autoComplete='off'
                                onChange={(e) =>
                                    setVolunteerInfo((prev) => {
                                        return { ...prev, [key]: e.target.value };
                                    })
                                }
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
            {/* <div className='flex flex-col gap-2'>
                <h2 className={`${fredokaBold.className} text-xl`}>Event(s)</h2>

                {eventsMapArray.map(({ event, conversion }) => (
                    <div key={event} className='flex items-center gap-1'>
                        <div
                            className={`${
                                volunteerInfo.events.includes(event)
                                    ? 'bg-primary border-none shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'
                                    : 'bg-background border-2'
                            } w-5 h-5 flex justify-center items-center rounded-md cursor-pointer transition-all`}
                            onClick={() => {
                                setVolunteerInfo((prev) => {
                                    const updatedInfo = prev.map((info, idx) => {
                                        if (idx !== index) return info;
                                        const events = info.events.includes(event) ? info.events.filter((e) => e !== event) : [...info.events, event];
                                        return { ...info, events };
                                    });
                                    return updatedInfo;
                                });
                            }}
                        >
                            {volunteerInfo[index].events.includes(event) && <Check color='white' strokeWidth={3} width={14} height={14} />}
                        </div>
                        <label
                            className={`${
                                volunteerInfo[index].events.includes(event) ? `${fredokaBold.className} text-black` : `${fredokaLight.className} text-gray-400`
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
            </div> */}
            <BirthDateSelector
                birthDate={{ day: volunteerInfo.birthDay, month: volunteerInfo.birthMonth, year: volunteerInfo.birthYear }}
                changeBirthDay={(day: string) => {
                    setVolunteerInfo((prev) => {
                        return {
                            ...prev,
                            birthDay: day,
                        };
                    });
                }}
                changeBirthMonth={(month: string) => {
                    setVolunteerInfo((prev) => {
                        return {
                            ...prev,
                            birthMonth: month,
                        };
                    });
                }}
                changeBirthYear={(year: string) => {
                    setVolunteerInfo((prev) => {
                        return {
                            ...prev,
                            birthYear: year,
                        };
                    });
                }}
            />
        </form>
    );
};

const CommunitySignUp = () => {
    const [volunteerInfo, setVolunteerInfo] = useState<VolunteerInfo>({
        firstName: '',
        lastName: '',
        email: '',
        birthYear: '',
        birthMonth: '',
        birthDay: '',
    });
    const [submitModalOpen, setSubmitModalOpen] = useState(false);

    const handleSubmit = () => {
        console.log(volunteerInfo);
        const sendObject: any = {};
        Object.keys(volunteerInfo).forEach((k) => {
            let key = k as keyof VolunteerInfo;
            if (volunteerInfo[key] && volunteerInfo[key].toString().length > 0)
                sendObject[key] = key !== 'birthDay' && key !== 'birthYear' ? volunteerInfo[key] : parseInt(volunteerInfo[key]);
        });

        if (!sendObject.firstName || !sendObject.lastName || !sendObject.email || !sendObject.birthYear || !sendObject.birthMonth || !sendObject.birthDay) {
            toastMessage('Please fill out all fields.', false, 2000, 'signupError');
            return;
        }

        const months: { [key: string]: string } = {
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

        const age = Math.floor(
            (new Date().getTime() - new Date(`${sendObject.birthYear}-${sendObject.birthMonth ? months[sendObject.birthMonth.toLowerCase()] : ''}-${sendObject.birthDay}`).getTime()) /
                (365.25 * 24 * 60 * 60 * 1000)
        );
        sendObject.age = age;
        console.log(sendObject);

        const toastID = toast.loading('Signing up...', { className: `${fredokaBold.className} !bg-background !text-black`, position: 'bottom-right' });

        axios
            .post(`/api/admin/post/helping-hearts-volunteers`, sendObject)
            .then((res) => {
                if (res.status === 200) {
                    toast.success('Successfully signed up!', {
                        id: toastID,
                        duration: 4000,
                    });

                    setVolunteerInfo({ firstName: '', lastName: '', email: '', birthYear: '', birthMonth: '', birthDay: '' });
                }
            })
            .catch((err) => {
                console.log(err);
                toast.error(`Couldn't sign up. Please try again.`, {
                    id: toastID,
                    duration: 4000,
                });
            });
    };

    return (
        <>
            <div className='flex flex-col gap-5'>
                <div>
                    <SignUpForm volunteerInfo={volunteerInfo} setVolunteerInfo={setVolunteerInfo} />

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
            <SubmitModal open={submitModalOpen} setOpen={setSubmitModalOpen} handleSubmit={handleSubmit} signUpView='volunteer' />
        </>
    );
};

export default CommunitySignUp;
