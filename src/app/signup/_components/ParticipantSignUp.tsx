'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Nunito } from 'next/font/google';
import { useState, useEffect, useRef } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Check, HelpCircle, PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';

import toast from 'react-hot-toast';
import BirthDateSelector from './BirthDateSelector';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const nunitoLight = Nunito({ weight: '400', subsets: ['latin'] });
const nunitoMedium = Nunito({ weight: '600', subsets: ['latin'] });
const nunitoBold = Nunito({ weight: '800', subsets: ['latin'] });

const ParticipantSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    phoneNumber: z.string().optional(),
    birthYear: z.string().optional(),
    birthMonth: z.string().optional(),
    birthDay: z.string().optional(),
    events: z.string().array().optional(),
    gradeLevel: z.string().optional(),
    isParent: z.boolean().optional(),
});

type ParticipantFields = {
    firstName: string;
    lastName: string;
    email?: string;
    birthYear: string;
    birthMonth: string;
    birthDay: string;
    gradeLevel: string;
    events: Events[];
    parentId: string;
    isParent: boolean;
    dateCreated: string;
};

type ParentFields = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    birthYear: string;
    birthMonth: string;
    birthDay: string;
    isParent: boolean;
    dateCreated: string;
};

type FormMapArray = {
    name: 'firstName' | 'lastName' | 'email' | 'phoneNumber' | 'birthYear' | 'birthMonth' | 'birthDay' | 'events' | 'gradeLevel';
    label?: string;
    selections?: string[];
    state?: string;
    setState?: React.Dispatch<React.SetStateAction<string>>;
    ref?: any;
};

type EventsMapArray = {
    event: string;
    conversion: string;
};

type Events = {
    name: string;
    isSelected: boolean;
};

type ParticipantFormProps = {
    participantsNumber?: number;
    setInfo: React.Dispatch<React.SetStateAction<ParticipantFields[]>> | React.Dispatch<React.SetStateAction<ParentFields>>;
    onChange: (data: any) => void;
    isParent: boolean;
    handleSubmit: () => void;
    updateState: number;
    setUpdateState: React.Dispatch<React.SetStateAction<number>>;
    deleteInfoUpdate: number;
    setDeleteInfoUpdate: React.Dispatch<React.SetStateAction<number>>;
};

const ParticipantSignUp = () => {
    const [participants, setParticipants] = useState<number>(1);
    const [participantInfo, setParticipantInfo] = useState<ParticipantFields[]>([]);
    const [parentInfo, setParentInfo] = useState<ParentFields>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        birthYear: '',
        birthMonth: '',
        birthDay: '',
        isParent: true,
        dateCreated: '',
    });
    const [updateState, setUpdateState] = useState<number>(0);
    const [deleteInfoUpdate, setDeleteInfoUpdate] = useState<number>(0);
    let blockSubmitHandle: number = 0;

    async function handleSubmit() {
        if (blockSubmitHandle == 0) {
            blockSubmitHandle++;

            let participantIsValid;
            participantInfo.forEach((participant) => {
                participantIsValid =
                    participant.firstName.trim() != '' &&
                    participant.lastName.trim() != '' &&
                    participant.birthYear.trim() != '' &&
                    participant.birthMonth.trim() != '' &&
                    participant.birthDay.trim() != '' &&
                    participant.events.some((event) => event.isSelected) &&
                    participant.gradeLevel.trim() != '' &&
                    participant.isParent == false;
            });

            const parentIsValid =
                parentInfo.firstName.trim() != '' &&
                parentInfo.lastName.trim() != '' &&
                parentInfo.email.trim() != '' &&
                /\S+@\S+\.\S+/.test(parentInfo.email != undefined ? parentInfo.email : '') &&
                parentInfo.phoneNumber.trim() != '' &&
                /^\(\d{3}\) \d{3}-\d{4}$/.test(parentInfo.phoneNumber != undefined ? parentInfo.phoneNumber : '') &&
                parentInfo.birthYear.trim() != '' &&
                parentInfo.birthYear.trim() != '2027' &&
                parentInfo.birthMonth.trim() != '' &&
                parentInfo.birthDay.trim() != '' &&
                parentInfo.isParent == true;

            const toastId = toast.loading('Processing...', {
                position: 'top-center',
                className: `${nunitoBold.className} text-white`,
                style: {
                    background: '#FFFDF5',
                },
            });

            if (parentIsValid && participantIsValid) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_DB_HOST}/participants`, {
                        body: JSON.stringify(parentInfo),
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        createToast('Unable to send data.', false, 4000, toastId);
                        throw new Error('Failed to send data.');
                    } else {
                        const responseData = await response.json();
                        const createdObjectId = responseData.insertedId;
                        participantInfo.forEach(async (participant, index) => {
                            const athlete = participant;
                            athlete.parentId = createdObjectId;
                            try {
                                const response = await fetch(`${process.env.NEXT_PUBLIC_DB_HOST}/participants`, {
                                    body: JSON.stringify(athlete),
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                });

                                if (!response.ok) {
                                    createToast('Unable to send data.', false, 4000, toastId);
                                    throw new Error('Failed to send data.');
                                } else {
                                    createToast("You're signed up!", true, 4000, toastId);
                                    setDeleteInfoUpdate((prev) => prev + 1);
                                }
                            } catch (error) {
                                createToast('Unable to send data.', false, 4000, toastId);
                                console.error('Error sending data: ', error);
                            }
                        });
                    }
                } catch (error) {
                    createToast('Unable to send data.', false, 4000, toastId);
                    console.error('Error sending data: ', error);
                }
            } else {
                createToast(
                    `${!parentIsValid && !participantIsValid ? 'Invalid form info.' : !parentIsValid ? 'Invalid parent/guardian info' : 'Invalid participant info.'}`,
                    false,
                    4000,
                    toastId
                );
            }
        }
    }

    const createToast = (text: string, status: boolean, duration: number, toastId: any) => {
        if (status) {
            toast.success(text, {
                duration: duration,
                position: 'top-center',
                className: `${nunitoBold.className} text-white`,
                style: {
                    background: '#FFFDF5',
                },
                id: toastId,
            });
        } else {
            toast.error(text, {
                duration: duration,
                position: 'top-center',
                className: `${nunitoBold.className} text-white`,
                style: {
                    background: '#FFFDF5',
                },
                id: toastId,
            });
        }
    };

    const handleParticipantInfoChange = (index: number, data: ParticipantFields) => {
        setParticipantInfo((prev) => {
            const updatedParticipants = [...prev];
            updatedParticipants[index] = data;
            return updatedParticipants;
        });
    };

    const handleParentInfoChange = (data: ParentFields) => {
        setParentInfo((prev) => {
            let updatedParent = prev;
            updatedParent = data;
            return updatedParent;
        });
    };

    useEffect(() => {
        setUpdateState((prev) => {
            if (prev == 5) handleSubmit();
            return prev + 100;
        });
    }, [participantInfo]);

    return (
        <div className='mt-5 flex flex-col gap-5'>
            <div>
                <div className='flex gap-2 items-center'>
                    <h1 className={`${nunitoBold.className} text-2xl`}>Participant(s)</h1>
                    <PlusCircle size={20} strokeWidth={3} onClick={() => setParticipants((prev) => prev + 1)} className='transition-all hover:scale-110 cursor-pointer' />
                </div>
                {Array.from({ length: participants }).map((_, index) => (
                    <div key={index} className='rounded-lg border px-4 mt-2'>
                        <ParticipantForm
                            handleSubmit={handleSubmit}
                            participantsNumber={index + 1}
                            onChange={(data) => handleParticipantInfoChange(index, data)}
                            setInfo={setParticipantInfo}
                            isParent={false}
                            updateState={updateState}
                            setUpdateState={setUpdateState}
                            deleteInfoUpdate={deleteInfoUpdate}
                            setDeleteInfoUpdate={setDeleteInfoUpdate}
                        />
                    </div>
                ))}
            </div>
            <div>
                <div className='flex gap-2 items-center'>
                    <h1 className={`${nunitoBold.className} text-2xl`}>Parent/Guardian</h1>
                </div>
                <div className='rounded-lg border px-4 mt-2'>
                    <ParticipantForm
                        handleSubmit={handleSubmit}
                        onChange={(data) => handleParentInfoChange(data)}
                        setInfo={setParentInfo}
                        isParent={true}
                        updateState={updateState}
                        setUpdateState={setUpdateState}
                        deleteInfoUpdate={deleteInfoUpdate}
                        setDeleteInfoUpdate={setDeleteInfoUpdate}
                    />
                </div>
            </div>
            <Dialog>
                <DialogTrigger
                    className={`${nunitoBold.className} w-56 h-10 self-center text-lg border resize-none overflow-y-hidden min-h-10 border-background bg-primary hover:bg-primary-light text-white rounded-full flex items-center gap-2 justify-center tracking-wide shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.1)]`}
                >
                    Submit
                </DialogTrigger>
                <DialogContent className='bg-background rounded-md gap-2.5'>
                    <DialogHeader className='flex flex-col items-start'>
                        <DialogTitle className={`${nunitoBold.className} text-2xl`}>Ready to submit?</DialogTitle>
                        <DialogDescription className='flex flex-col items-start text-left w-full gap-2'>
                            <p className={`${nunitoLight.className} text-base`}>
                                ***Each participant <b>costs $10</b> to run. You&#39;re signing up {participants} {participants == 1 ? 'participant' : 'participants'}, so please bring{' '}
                                <b>${participants * 10}.</b>
                            </p>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogClose
                        type='submit'
                        onClick={() => setUpdateState(5)}
                        className={`${nunitoBold.className} bg-primary transition-all mt-2 hover:bg-primary-light text-white h-10 rounded-md text-sm`}
                    >
                        Submit
                    </DialogClose>
                    <DialogClose className={`${nunitoBold.className} bg-background hover:bg-background-dark h-10 transition-all rounded-md text-sm`}>Cancel</DialogClose>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const ParticipantForm = ({ isParent, updateState, setUpdateState, deleteInfoUpdate, setDeleteInfoUpdate, ...props }: ParticipantFormProps) => {
    const [date, setDate] = useState<Date>();
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [events, setEvents] = useState<Events[]>([
        { name: '1600 meters', isSelected: false },
        { name: '400 meters', isSelected: false },
        { name: '100 meters', isSelected: false },
        { name: 'high jump', isSelected: false },
        { name: 'long jump', isSelected: false },
    ]);
    const [birthYear, setBirthYear] = useState<string>('2027');
    const [birthMonth, setBirthMonth] = useState<string>('August');
    const [birthDay, setBirthDay] = useState<string>('');
    const [gradeLevel, setGradeLevel] = useState<string>('');

    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneNumberRef = useRef(null);

    const currentYear = new Date().getFullYear();
    const yearsArray: string[] = [];
    for (let year = currentYear; year >= (isParent ? 1960 : 2000); year--) yearsArray.push(year.toString());
    const monthsArray: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const gradeLevelsArray: string[] = ['8th Grade', '7th Grade', '6th Grade', '5th Grade', '4th Grade', '3rd Grade', '2nd Grade', '1st Grade', 'Kindergarten'];

    const nameInputMapArray: FormMapArray[] = [
        { name: 'firstName', label: 'First Name', state: firstName, setState: setFirstName, ref: firstNameRef },
        { name: 'lastName', label: 'Last Name', state: lastName, setState: setLastName, ref: lastNameRef },
        { name: 'email', label: `${isParent ? 'Email' : 'Email (not required)'}`, state: email, setState: setEmail, ref: emailRef },
    ];

    if (isParent) nameInputMapArray.push({ name: 'phoneNumber', label: 'Phone Number -> (123) 456-7890', state: phoneNumber, setState: setPhoneNumber, ref: phoneNumberRef });

    const birthDateInputMapArray: FormMapArray[] = [
        { name: 'birthYear', label: 'Year', selections: yearsArray, state: birthYear, setState: setBirthYear },
        { name: 'birthMonth', label: 'Month', selections: monthsArray, state: birthMonth, setState: setBirthMonth },
        { name: 'birthDay', label: 'Day' },
    ];

    const eventsMapArray: EventsMapArray[] = [
        { event: '1600 meters', conversion: '~1 mile' },
        { event: '400 meters', conversion: '~0.25 miles' },
        { event: '100 meters', conversion: '~0.06 miles' },
        { event: 'high jump', conversion: '' },
        { event: 'long jump', conversion: '' },
    ];

    const onSubmit = (values: z.infer<typeof ParticipantSchema>) => {};

    const form = useForm<z.infer<typeof ParticipantSchema>>({
        resolver: zodResolver(ParticipantSchema),
    });

    useEffect(() => {
        if (date != undefined) {
            setBirthDay(format(date, 'd'));
        }
    }, [date]);

    useEffect(() => {
        if (updateState == 5) {
            const currentDate = Date();
            let data: ParticipantFields | ParentFields;
            if (!isParent) {
                data = {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: email.trim(),
                    birthYear: birthYear,
                    birthMonth: birthMonth,
                    birthDay: birthDay,
                    gradeLevel: gradeLevel,
                    events: events,
                    parentId: '',
                    isParent: isParent,
                    dateCreated: currentDate,
                };
            } else {
                data = {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: email.trim(),
                    phoneNumber: phoneNumber.trim(),
                    birthYear: birthYear,
                    birthMonth: birthMonth,
                    birthDay: birthDay,
                    isParent: isParent,
                    dateCreated: currentDate,
                };
            }
            props.onChange(data);
        }
    }, [updateState]);

    useEffect(() => {
        nameInputMapArray.forEach((data) => (data.ref.current.value = ''));
        setBirthYear('2027');
        setBirthMonth('August');
        setBirthDay('');
        setEvents((prev) => {
            const events = [...prev];
            events.forEach((event) => (event.isSelected = false));
            return events;
        });
        setGradeLevel('');
    }, [deleteInfoUpdate]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='my-4 w-full h-full flex flex-col gap-4'>
                <div className='flex flex-col gap-4'>
                    {!isParent && <h1 className={`${nunitoBold.className} text-[22px]`}>Participant #{props.participantsNumber}</h1>}
                    <h2 className={`${nunitoBold.className} text-xl`}>{isParent ? 'Contact Info' : 'Name'}</h2>
                    {nameInputMapArray.map((data, index) => (
                        <FormField
                            key={data.name + index}
                            control={form.control}
                            name={data.name}
                            render={({ field }) => (
                                <FormItem className='relative'>
                                    <>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type='text'
                                                className={`${nunitoLight.className} px-4 pt-3 pb-2 w-full h-11 text-lg bg-background appearance-none rounded-md border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] focus:outline-none focus:ring-0 focus:border-primary-light peer`}
                                                autoComplete='off'
                                                ref={data.ref != undefined && data.ref}
                                                onChange={() => data.setState != undefined && data.setState(data.ref.current.value)}
                                                placeholder=''
                                            />
                                        </FormControl>
                                        <FormLabel
                                            className={`${nunitoLight.className} absolute text-base text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 z-10 origin-[0] bg-background px-2 peer-focus:px-2 peer-focus:text-primary-light peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-7 rtl:peer-focus:translate-x-1/2 rtl:peer-focus:left-auto start-1`}
                                        >
                                            {data.label}
                                        </FormLabel>
                                    </>
                                </FormItem>
                            )}
                        />
                    ))}
                </div>
                <BirthDateSelector
                    birthYear={birthYear}
                    setBirthYear={setBirthYear}
                    birthMonth={birthMonth}
                    setBirthMonth={setBirthMonth}
                    birthDay={birthDay}
                    setBirthDay={setBirthDay}
                    date={date}
                    setDate={setDate}
                />
                {!isParent && (
                    <>
                        <div className='flex flex-col gap-4'>
                            <h2 className={`${nunitoBold.className} text-xl`}>Event(s)</h2>
                            {eventsMapArray.map(({ event, conversion }, index) => (
                                <FormField
                                    key={event + index}
                                    control={form.control}
                                    name={'events'}
                                    render={({ field }) => (
                                        <FormItem className='flex gap-2 items-center'>
                                            <>
                                                <FormControl>
                                                    <div
                                                        className={`${
                                                            events[index].isSelected
                                                                ? 'bg-primary border-none shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'
                                                                : 'bg-background border-2'
                                                        } w-5 h-5 flex justify-center items-center rounded-md cursor-pointer transition-all`}
                                                        onClick={(e) => {
                                                            let count = 0;
                                                            e.stopPropagation();
                                                            setEvents((prev) => {
                                                                if (count > 0) {
                                                                    return [...prev];
                                                                }
                                                                let events = [...prev];
                                                                events[index].isSelected = !events[index].isSelected;
                                                                count++;
                                                                return events;
                                                            });
                                                        }}
                                                        id={event}
                                                    >
                                                        {events[index].isSelected && <Check color='white' strokeWidth={3} width={14} height={14} />}
                                                    </div>
                                                </FormControl>
                                                <FormLabel
                                                    className={`${
                                                        events[index].isSelected ? nunitoMedium.className + ' text-black' : nunitoLight.className + ' text-gray-500'
                                                    }  margin-top-0 text-md transition-all select-none flex items-center gap-x-1.5`}
                                                >
                                                    {event}
                                                    {conversion.trim().length > 0 && (
                                                        <Popover>
                                                            <PopoverTrigger>
                                                                <HelpCircle width={17} height={17} className='text-gray-500' />
                                                            </PopoverTrigger>
                                                            <PopoverContent side='top' className={`${nunitoLight.className} w-full h-full p-2 bg-background text-gray-500 text-sm`}>
                                                                {conversion}
                                                            </PopoverContent>
                                                        </Popover>
                                                    )}
                                                </FormLabel>
                                            </>
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                        <div className='flex flex-col gap-4'>
                            <h2 className={`${nunitoBold.className} text-xl`}>Grade Level</h2>
                            <FormField
                                control={form.control}
                                name='gradeLevel'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Select onValueChange={(value) => setGradeLevel(value)}>
                                                <SelectTrigger
                                                    className={`${nunitoLight.className} ${
                                                        gradeLevel != '' ? 'text-black' : 'text-gray-500'
                                                    } px-4 py-3 w-full h-11 text-base bg-background hover:bg-background-secondary transition-all  appearance-none rounded-md border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                                                >
                                                    <SelectValue {...field} placeholder='Grade Level' className={`overflow-ellipsis`}>
                                                        {gradeLevel != '' ? gradeLevel : <span>Grade Level</span>}
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
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </>
                )}
            </form>
        </Form>
    );
};

export default ParticipantSignUp;
