import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Nunito } from 'next/font/google';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const nunitoLight = Nunito({ weight: '400', subsets: ['latin'] });
const nunitoBold = Nunito({ weight: '800', subsets: ['latin'] });

const volunteerSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    birthYear: z.string().optional(),
    birthMonth: z.string().optional(),
    birthDay: z.string().optional(),
});

type VolunteerMapArray = {
    name: 'firstName' | 'lastName' | 'email' | 'birthYear' | 'birthMonth' | 'birthDay';
    label: string;
    ref?: any;
    selections?: string[];
    state?: string;
    setState?: React.Dispatch<React.SetStateAction<string>>;
};

const VolunteerSignUp = () => {
    const [date, setDate] = useState<Date>();
    const [birthYear, setBirthYear] = useState<string>('2027');
    const [birthMonth, setBirthMonth] = useState<string>('August');
    const [birthDay, setBirthDay] = useState<string>('');

    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);

    const currentYear = new Date().getFullYear();
    const yearsArray: string[] = [];
    for (let year = currentYear; year >= 1960; year--) yearsArray.push(year.toString());
    const monthsArray: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const form = useForm<z.infer<typeof volunteerSchema>>({
        resolver: zodResolver(volunteerSchema),
    });

    async function onSubmit(values: z.infer<typeof volunteerSchema>) {
        const info = values;
        info.birthYear = birthYear;
        info.birthMonth = birthMonth;
        info.birthDay = birthDay;

        const isValid =
            info.firstName?.trim() != '' &&
            info.lastName?.trim() != '' &&
            info.email?.trim() != '' &&
            /\S+@\S+\.\S+/.test(info.email != undefined ? info.email : '') &&
            info.birthYear.trim() != '' &&
            info.birthYear.trim() != '2027' &&
            info.birthMonth.trim() != '' &&
            info.birthDay.trim() != '';

        if (isValid) {
            try {
                const response = await fetch('http://localhost:8000/volunteers', {
                    body: JSON.stringify(info),
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    createToast('Unable to send data.', false, 4000);
                    throw new Error('Failed to send data.');
                } else {
                    createToast('Welcome to the team!', true, 4000);
                    form.reset();
                    setBirthYear('2027');
                    setBirthMonth('August');
                    setBirthDay('');
                    volunteerMapArray.forEach((data) => (data.ref.current.value = ''));
                }
            } catch (error) {
                createToast('Unable to send data.', false, 4000);
                console.error('Error sending data: ', error);
            }
        } else {
            createToast('Invalid form info.', false, 4000);
        }
    }

    const volunteerMapArray: VolunteerMapArray[] = [
        { name: 'firstName', label: 'First Name', ref: firstNameRef },
        { name: 'lastName', label: 'Last Name', ref: lastNameRef },
        { name: 'email', label: 'Email', ref: emailRef },
    ];

    const birthDateInputMapArray: VolunteerMapArray[] = [
        { name: 'birthYear', label: 'Year', selections: yearsArray, state: birthYear, setState: setBirthYear },
        { name: 'birthMonth', label: 'Month', selections: monthsArray, state: birthMonth, setState: setBirthMonth },
        { name: 'birthDay', label: 'Day' },
    ];

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

    useEffect(() => {
        if (date != undefined) {
            setBirthDay(format(date, 'd'));
        }
    }, [date]);

    return (
        <>
            <div>
                <div className='flex gap-2 items-center mt-5'>
                    <h1 className={`${nunitoBold.className} text-2xl`}>Volunteer</h1>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='w-full flex flex-col'>
                        <div className='rounded-lg border p-4 mt-2 flex flex-col gap-4'>
                            <h2 className={`${nunitoBold.className} text-xl`}>Contact Info</h2>
                            {volunteerMapArray.map((data, index) => (
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
                                                        ref={data.ref}
                                                        type='text'
                                                        className={`${nunitoLight.className} px-4 pt-3 pb-2 w-full h-11 text-lg bg-background appearance-none rounded-md border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] focus:outline-none focus:ring-0 focus:border-primary-light peer`}
                                                        autoComplete='off'
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
                            <div className='grid grid-rows-2 grid-cols-[1fr_2fr_1fr] gap-x-2'>
                                <h2 className={`${nunitoBold.className} text-xl row-span-1 col-span-3`}>Birth Date</h2>
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
                                                                        {data.name == 'birthYear' && data.state != '2027' ? data.state : data.name == 'birthYear' ? 'Year' : ''}
                                                                        {data.name == 'birthMonth' && data.state != 'August' && birthYear != '2027'
                                                                            ? data.state
                                                                            : data.name == 'birthMonth'
                                                                            ? 'Month'
                                                                            : ''}
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
                                                                            {date && birthDay != '' ? (
                                                                                format(new Date(0, 0, parseInt(birthDay), 0, 0, 0), 'do')
                                                                            ) : (
                                                                                <span className='text-gray-500 overflow-ellipsis'>Day</span>
                                                                            )}
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
                        </div>
                        <Button
                            type='submit'
                            className={`${nunitoBold.className} w-56 h-10 mt-5 self-center text-lg border resize-none overflow-y-hidden min-h-10 border-background bg-primary hover:bg-primary-light text-white rounded-full flex items-center gap-2 justify-center tracking-wide shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.1)]`}
                        >
                            Submit
                        </Button>
                    </form>
                </Form>
            </div>
        </>
    );
};

export default VolunteerSignUp;
