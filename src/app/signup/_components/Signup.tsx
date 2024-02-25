'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { ZodString, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Jua, Nunito } from 'next/font/google';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import BirthDatePicker from './BirthDatePicker';

const jua = Jua({ weight: '400', subsets: ['latin'] });
const nunitoLight = Nunito({ weight: '400', subsets: ['latin'] });
const nunitoBold = Nunito({ weight: '800', subsets: ['latin'] });

const signUpSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    birthSelector: z.string().optional(),
});

type FormMapArray = {
    name: 'firstName' | 'lastName' | 'birthSelector';
    label?: string;
};

const Signup = () => {
    const [isVolunteer, setIsVolunteer] = useState(false);

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
    });

    const formMapArray: FormMapArray[] = [{ name: 'firstName', label: 'First Name' }, { name: 'lastName', label: 'Last Name' }, { name: 'birthSelector' }];

    const onSubmit = (values: z.infer<typeof signUpSchema>) => {
        console.log(values);
    };

    return (
        <div className='w-full flex justify-center'>
            <div className='w-full max-w-[1280px] flex flex-col mx-6 my-10'>
                <h1 className={`${jua.className} text-4xl`}>Register Today!</h1>
                <div></div>
                <div className='mt-5'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='my-4 w-full h-full flex flex-col gap-4'>
                            {formMapArray.map((data, index) => (
                                <FormField
                                    key={data.name + index}
                                    control={form.control}
                                    name={data.name}
                                    render={({ field }) => (
                                        <FormItem className='relative'>
                                            {data.name != 'birthSelector' ? (
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
                                            ) : (
                                                <>
                                                    <FormControl>
                                                        <BirthDatePicker />
                                                    </FormControl>
                                                </>
                                            )}
                                        </FormItem>
                                    )}
                                />
                            ))}
                            <Button
                                type='submit'
                                className={`${nunitoBold.className} w-56 h-10 text-lg border resize-none overflow-y-hidden min-h-10 border-background bg-primary hover:bg-primary-light text-white rounded-full flex items-center gap-2 justify-center tracking-wide shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.1)]`}
                            >
                                Submit
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
