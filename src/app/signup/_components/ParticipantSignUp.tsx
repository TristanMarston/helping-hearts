'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Jua, Nunito } from 'next/font/google';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, PlusCircle } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import toast from 'react-hot-toast';

const nunitoLight = Nunito({ weight: '400', subsets: ['latin'] });
const nunitoBold = Nunito({ weight: '800', subsets: ['latin'] });

const ParticipantSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    phoneNumber: z.string().optional(),
    birthYear: z.string().optional(),
    birthMonth: z.string().optional(),
    birthDay: z.string().optional(),
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
    parentId: string;
    isParent: boolean;
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
};

type FormMapArray = {
    name: 'firstName' | 'lastName' | 'email' | 'phoneNumber' | 'birthYear' | 'birthMonth' | 'birthDay' | 'gradeLevel';
    label?: string;
    selections?: string[];
    state?: string;
    setState?: React.Dispatch<React.SetStateAction<string>>;
    ref?: any;
};

type ParticipantFormProps = {
    participantsNumber?: number;
    setInfo: React.Dispatch<React.SetStateAction<ParticipantFields[]>> | React.Dispatch<React.SetStateAction<ParentFields>>;
    onChange: (data: any) => void;
    isParent: boolean;
    handleSubmit?: () => void;
    updateState?: number;
    setUpdateState?: React.Dispatch<React.SetStateAction<number>>;
};

const ParticipantSignUp = () => {
    const [participants, setParticipants] = useState<number>(1);
    const [participantInfo, setParticipantInfo] = useState<ParticipantFields[]>([]);
    const [parentInfo, setParentInfo] = useState<ParentFields>({ firstName: '', lastName: '', email: '', phoneNumber: '', birthYear: '', birthMonth: '', birthDay: '', isParent: true });
    const [updateState, setUpdateState] = useState<number>(0);
    let blockSubmitHandle: number = 0;

    async function handleSubmit() {
        if (blockSubmitHandle == 0) {
            console.log(participantInfo);
            console.log(parentInfo);

            let participantIsValid;
            participantInfo.forEach((participant) => {
                participantIsValid =
                    participant.firstName.trim() != '' &&
                    participant.lastName.trim() != '' &&
                    participant.birthYear.trim() != '' &&
                    participant.birthMonth.trim() != '' &&
                    participant.birthDay.trim() != '' &&
                    participant.gradeLevel.trim() != '' &&
                    participant.isParent == false;
            });

            const parentIsValid =
                parentInfo.firstName.trim() != '' &&
                parentInfo.lastName.trim() != '' &&
                parentInfo.email.trim() != '' &&
                parentInfo.phoneNumber.trim() != '' &&
                parentInfo.birthYear.trim() != '' &&
                parentInfo.birthMonth.trim() != '' &&
                parentInfo.birthDay.trim() != '' &&
                parentInfo.isParent == true;

            if (parentIsValid && participantIsValid) {
                blockSubmitHandle++;
                try {
                    const response = await fetch('http://localhost:8000/participants', {
                        body: JSON.stringify(parentInfo),
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        createToast('Unable to send data.', false, 4000);
                        throw new Error('Failed to send data.');
                    } else {
                        const responseData = await response.json();
                        const createdObjectId = responseData.insertedId;
                        createToast(`Successfully signed up parent with ID ${createdObjectId}`, true, 4000);
                        participantInfo.forEach(async (participant, index) => {
                            const athlete = participant;
                            athlete.parentId = createdObjectId;
                            try {
                                const response = await fetch('http://localhost:8000/participants', {
                                    body: JSON.stringify(athlete),
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                });

                                if (!response.ok) {
                                    createToast('Unable to send data.', false, 4000);
                                    throw new Error('Failed to send data.');
                                }
                            } catch (error) {
                                createToast('Unable to send data.', false, 4000);
                                console.error('Error sending data: ', error);
                            }
                        });
                    }
                } catch (error) {
                    createToast('Unable to send data.', false, 4000);
                    console.error('Error sending data: ', error);
                }
            } else {
                createToast('Invalid parent/guardian info.', false, 4000);
            }
        }
    }

    const createToast = (text: string, status: boolean, duration: number) => {
        if (status) {
            toast.success(text, {
                duration: duration,
                position: 'top-center',
                className: `${nunitoBold.className} text-white`,
                style: {
                    background: '#FFFDF5',
                },
            });
        } else {
            toast.error(text, {
                duration: duration,
                position: 'top-center',
                className: `${nunitoBold.className} text-white`,
                style: {
                    background: '#FFFDF5',
                },
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
                    />
                </div>
            </div>
            <Button
                type='submit'
                onClick={() => setUpdateState(5)}
                className={`${nunitoBold.className} w-56 h-10 text-lg border resize-none overflow-y-hidden min-h-10 border-background bg-primary hover:bg-primary-light text-white rounded-full flex items-center gap-2 justify-center tracking-wide shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.1)]`}
            >
                Submit
            </Button>
        </div>
    );
};

const ParticipantForm = ({ isParent, updateState, setUpdateState, ...props }: ParticipantFormProps) => {
    const [date, setDate] = useState<Date>();
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
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
    for (let year = currentYear; year >= 2000; year--) yearsArray.push(year.toString());
    const monthsArray: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const gradeLevelsArray: string[] = ['8th Grade', '7th Grade', '6th Grade', '5th Grade', '4th Grade', '3rd Grade', '2nd Grade', '1st Grade', 'Kindergarten'];

    const nameInputMapArray: FormMapArray[] = [
        { name: 'firstName', label: 'First Name', state: firstName, setState: setFirstName, ref: firstNameRef },
        { name: 'lastName', label: 'Last Name', state: lastName, setState: setLastName, ref: lastNameRef },
        { name: 'email', label: `${isParent ? 'Email' : 'Email (not required)'}`, state: email, setState: setEmail, ref: emailRef },
    ];

    if (isParent) nameInputMapArray.push({ name: 'phoneNumber', label: 'Phone Number -> 123-456-7890', state: phoneNumber, setState: setPhoneNumber, ref: phoneNumberRef });

    const birthDateInputMapArray: FormMapArray[] = [
        { name: 'birthYear', label: 'Year', selections: yearsArray, state: birthYear, setState: setBirthYear },
        { name: 'birthMonth', label: 'Month', selections: monthsArray, state: birthMonth, setState: setBirthMonth },
        { name: 'birthDay', label: 'Day' },
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
            console.log('updated state');

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
                    parentId: '',
                    isParent: isParent,
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
                };
            }
            props.onChange(data);
        }
    }, [updateState]);

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
                <div className='grid grid-rows-2 grid-cols-[1fr_2fr_1fr] gap-x-2'>
                    <h2 className={`${nunitoBold.className} text-xl row-span-1 col-span-3`}>Date of Birth</h2>
                    {birthDateInputMapArray.map((data, index) => (
                        <FormField
                            key={data.name + index}
                            control={form.control}
                            name={data.name}
                            render={({ field }) => (
                                <FormItem className='relative'>
                                    <>
                                        <FormControl>
                                            {data.name != 'birthDay' ? (
                                                <Select onValueChange={(value) => data.setState != undefined && data.setState(value)}>
                                                    <SelectTrigger
                                                        className={`${nunitoLight.className} px-4 py-3 w-full h-11 text-base bg-background hover:bg-background-secondary transition-all text-gray-500 appearance-none rounded-md border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                                                    >
                                                        <SelectValue {...field} placeholder={data.label} className='text-black overflow-ellipsis'>
                                                            {data.state}
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent className='bg-background'>
                                                        <SelectGroup>
                                                            {data.selections != undefined &&
                                                                data.selections.map((timeMeasure, index) => (
                                                                    <SelectItem key={timeMeasure + index} value={timeMeasure} className='hover:bg-background-dark'>
                                                                        {timeMeasure}
                                                                    </SelectItem>
                                                                ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <FormControl>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant={'outline'}
                                                                className={cn(
                                                                    `${nunitoLight.className} px-4 py-3 w-full h-11 text-base flex justify-start bg-background hover:bg-background-secondary transition-all text-gray-500 appearance-none rounded-md border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`,
                                                                    !date && 'text-muted-foreground'
                                                                )}
                                                            >
                                                                <CalendarIcon className='mr-2 h-4 w-4 text-gray-500' />
                                                                {date ? format(date, 'do') : <span className='text-gray-500 overflow-ellipsis'>Day</span>}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className='w-auto p-0'>
                                                            <Calendar
                                                                mode='single'
                                                                showYear={birthYear}
                                                                showMonth={birthMonth}
                                                                showArrows={false}
                                                                selected={date}
                                                                onSelect={setDate}
                                                                showOutsideDays={false}
                                                                className='bg-background'
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </FormControl>
                                            )}
                                        </FormControl>
                                    </>
                                </FormItem>
                            )}
                        />
                    ))}
                </div>
                {!isParent && (
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
                                                className={`${nunitoLight.className} px-4 py-3 w-full h-11 text-base bg-background hover:bg-background-secondary transition-all text-gray-500 appearance-none rounded-md border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                                            >
                                                <SelectValue {...field} placeholder='Grade Level' className='text-black overflow-ellipsis'>
                                                    {gradeLevel}
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
                )}
            </form>
        </Form>
    );
};

export default ParticipantSignUp;
