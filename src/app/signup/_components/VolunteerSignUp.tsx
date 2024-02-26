import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Nunito } from 'next/font/google';
import { Button } from '@/components/ui/button';

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
    name: 'firstName' | 'lastName' | 'email';
    label: string;
};

const VolunteerSignUp = () => {
    const form = useForm<z.infer<typeof volunteerSchema>>({
        resolver: zodResolver(volunteerSchema),
    });

    async function onSubmit() {}

    const volunteerMapArray: VolunteerMapArray[] = [
        { name: 'firstName', label: 'First Name' },
        { name: 'lastName', label: 'Last Name' },
        { name: 'email', label: 'Email' },
    ];

    return (
        <>
            <div>
                <div className='flex gap-2 items-center mt-5'>
                    <h1 className={`${nunitoBold.className} text-2xl`}>Volunteer</h1>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='w-full flex flex-col'>
                        <div className='rounded-lg border p-4 mt-2 flex flex-col gap-4'>
                            <h2 className={`${nunitoBold.className} text-[22px]`}>Contact Info</h2>
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
                        </div>
                        <Button
                            type='submit'
                            className={`${nunitoBold.className} w-56 h-10 self-center text-lg border resize-none overflow-y-hidden min-h-10 border-background bg-primary hover:bg-primary-light text-white rounded-full flex items-center gap-2 justify-center tracking-wide shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.1)]`}
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
