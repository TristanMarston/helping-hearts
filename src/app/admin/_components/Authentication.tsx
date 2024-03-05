'use client';

import { useContext, useRef, useState } from 'react';
import { AuthenticationContext } from '@/app/admin/page';
import { Nunito } from 'next/font/google';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const nunitoBold = Nunito({ weight: '800', subsets: ['latin'] });
const nunitoLight = Nunito({ weight: '400', subsets: ['latin'] });

const signInSchema = z.object({
    username: z.string().optional(),
    password: z.string().optional(),
});

type MapArray = {
    type: 'username' | 'password';
    ref?: React.MutableRefObject<HTMLInputElement>;
};

const Authentication = () => {
    const [showPassword, setShowPassword] = useState(false);
    const usernameRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const passwordRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const context = useContext(AuthenticationContext);

    if (context === undefined) {
        throw new Error('useContext(AuthenticationContext) must be used within a AuthenticationContext.Provider');
    }

    const { signedIn, setSignedIn } = context;

    async function onSubmit(values: z.infer<typeof signInSchema>) {
        console.log(values);

        const toastId = toast.loading('Fetching...', {
            position: 'top-center',
            className: `${nunitoBold.className} text-white`,
            style: {
                background: '#FFFDF5',
            },
        });

        fetch(`${process.env.NEXT_PUBLIC_DB_HOST}/users`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                const correctAuth = data[0];
                const usernameIsAccurate = correctAuth.username.trim() == values['username']?.trim();
                const passwordIsAccurate = correctAuth.password.trim() == values['password']?.trim();
                if (usernameIsAccurate && passwordIsAccurate) {
                    createToast('Successfully signed in!', true, 4000, toastId);
                    setSignedIn(true);
                } else {
                    createToast('Invalid username or password!', false, 4000, toastId);
                    setSignedIn(false);
                }
                usernameRef.current.value = '';
                passwordRef.current.value = '';
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
    });

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

    const mapArray: MapArray[] = [
        { type: 'username', ref: usernameRef },
        { type: 'password', ref: passwordRef },
    ];

    return (
        <div className='w-full h-full mt-10 flex justify-center items-center'>
            <div className='bg-background w-[40rem] max-w-[1280px] mx-6 min-h-48 p-6 rounded-md shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
                <h1 className={`${nunitoBold.className} text-2xl tablet:text-3xl mb-4`}>Sign in to admin</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-y-4'>
                        {mapArray.map((data, index) => (
                            <FormField
                                key={data.type + index}
                                control={form.control}
                                name={data.type}
                                render={({ field }) => (
                                    <FormItem className='relative flex'>
                                        <>
                                            <FormControl>
                                                <>
                                                    <Input
                                                        {...field}
                                                        ref={data.ref}
                                                        type={data.type == 'username' ? 'text' : `${showPassword ? 'text' : 'password'}`}
                                                        className={`${nunitoLight.className} px-4 pt-3 pb-2 w-full h-11 text-lg bg-background appearance-none rounded-md border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] focus:outline-none focus:ring-0 focus:border-primary-light peer`}
                                                        autoComplete='off'
                                                        placeholder=''
                                                    />
                                                    {showPassword ? (
                                                        <Eye
                                                            onClick={() => setShowPassword((prev) => !prev)}
                                                            className={`${data.type == 'username' && 'hidden'} absolute right-4 text-primary`}
                                                        />
                                                    ) : (
                                                        <EyeOff
                                                            onClick={() => setShowPassword((prev) => !prev)}
                                                            className={`${data.type == 'username' && 'hidden'} absolute right-4 text-primary`}
                                                        />
                                                    )}
                                                </>
                                            </FormControl>
                                            <FormLabel
                                                className={`${nunitoLight.className} absolute select-none text-base text-gray-500 duration-300 transform -translate-y-5 scale-75 top-0 z-10 origin-[0] bg-background px-2 peer-focus:px-2 peer-focus:text-primary-light peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-7 rtl:peer-focus:translate-x-1/2 rtl:peer-focus:left-auto start-1`}
                                            >
                                                {data.type[0].toUpperCase()}
                                                {data.type.substring(1, data.type.length)}
                                            </FormLabel>
                                        </>
                                    </FormItem>
                                )}
                            />
                        ))}
                        <Button type='submit' className={`${nunitoBold.className} bg-primary transition-all mt-2 hover:bg-primary-light text-white h-10 rounded-md text-base`}>
                            Submit
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default Authentication;
