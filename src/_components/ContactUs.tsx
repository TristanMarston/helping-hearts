'use client';

import { Jua, Nunito } from 'next/font/google';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const jua = Jua({ weight: '400', subsets: ['latin'] });
const nunitoLight = Nunito({ weight: '400', subsets: ['latin'] });
const nunitoBold = Nunito({ weight: '800', subsets: ['latin'] });

const contactUsSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().optional(),
});

type FormMapArray = {
    name: 'firstName' | 'lastName' | 'email' | 'subject' | 'message';
    label: string;
    ref?: React.MutableRefObject<HTMLInputElement>;
    description?: string;
};

const ContactUs = () => {
    const firstNameRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const lastNameRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const emailRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const subjectRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const messageRef = useRef() as React.RefObject<HTMLTextAreaElement>;

    const [textareaValue, setTextareaValue] = useState('');

    const form = useForm<z.infer<typeof contactUsSchema>>({
        resolver: zodResolver(contactUsSchema),
    });

    const formMapArray: FormMapArray[] = [
        { name: 'firstName', label: 'first name', ref: firstNameRef },
        { name: 'lastName', label: 'last name', ref: lastNameRef },
        { name: 'email', label: 'email*', ref: emailRef },
        { name: 'subject', label: 'subject', ref: subjectRef },
        { name: 'message', label: 'message*' },
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

    async function onSubmit(values: z.infer<typeof contactUsSchema>) {
        console.log(values);
        const emailIsValid = values.email && /\S+@\S+\.\S+/.test(values.email);
        const messageIsValid = values.message && values.message.length > 0;
        const incorrectInputClasses = ' border-b-primary-pink border-b-4 border-dotted';

        if (emailIsValid && messageIsValid && messageRef.current != null) {
            if (messageRef.current.className.indexOf(incorrectInputClasses) != -1 && messageIsValid) {
                messageRef.current.className = messageRef.current.className.replace(new RegExp(incorrectInputClasses, 'g'), '');
            }
            if (emailRef.current.className.indexOf(incorrectInputClasses) != -1 && emailIsValid) {
                emailRef.current.className = emailRef.current.className.replace(new RegExp(incorrectInputClasses, 'g'), '');
            }

            try {
                const response = await fetch('http://localhost:8000/messages', {
                    body: JSON.stringify(values),
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    createToast('Unable to send data.', false, 4000);
                    throw new Error('Failed to send data.');
                } else {
                    createToast('Message successfully sent!', true, 4000);
                }

                // formMapArray.forEach((item) => console.log(item.ref.current.value));
                form.reset();
                // formMapArray.forEach((item) => console.log(item.ref.current.value));
            } catch (error) {
                createToast('Unable to send data.', false, 4000);
                console.error('Error sending data: ', error);
            }
        } else if (!emailIsValid && !messageIsValid && messageRef.current != null) {
            createToast('Invalid information, please try again.', false, 4000);
            emailRef.current.className += emailRef.current.className.indexOf(incorrectInputClasses) == -1 ? incorrectInputClasses : '';
            messageRef.current.className += messageRef.current.className.indexOf(incorrectInputClasses) == -1 ? incorrectInputClasses : '';
        } else if (!emailIsValid && messageRef.current != null) {
            createToast('Invalid email address, please try again.', false, 4000);
            emailRef.current.className += emailRef.current.className.indexOf(incorrectInputClasses) == -1 ? incorrectInputClasses : '';
            if (messageRef.current.className.indexOf(incorrectInputClasses) != -1 && messageIsValid) {
                messageRef.current.className = messageRef.current.className.replace(new RegExp(incorrectInputClasses, 'g'), '');
            }
        } else if (!messageIsValid && messageRef.current != null) {
            createToast('Empty message, please try again.', false, 4000);
            messageRef.current.className += messageRef.current.className.indexOf(incorrectInputClasses) == -1 ? incorrectInputClasses : '';
            if (emailRef.current.className.indexOf(incorrectInputClasses) != -1 && emailIsValid) {
                emailRef.current.className = emailRef.current.className.replace(new RegExp(incorrectInputClasses, 'g'), '');
            }
        }
    }

    return (
        <div className='mt-4 mb-12 w-full'>
            <div className={`${jua.className} text-background text-4xl`}>contact us</div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mt-4'>
                    {formMapArray.map((data, index) => (
                        <FormField
                            control={form.control}
                            name={data.name}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={`${jua.className} text-background text-2xl`}>{data.label}</FormLabel>
                                    <FormControl>
                                        {data.name != 'message' ? (
                                            <Input
                                                {...field}
                                                type='text'
                                                ref={data.ref}
                                                className={`${nunitoLight.className} bg-primary h-10 flex focus:border-b-primary-dark w-full border-b border-b-background mt-0 outline-none text-background pl-2 transition-all`}
                                                autoComplete='off'
                                                hidden
                                            />
                                        ) : (
                                            <textarea
                                                rows={1}
                                                className={`${nunitoLight.className} bg-primary h-10 align-bottom pt-2 flex focus:border-b-primary-dark w-full border-b border-b-background mt-0 outline-none text-background pl-2 transition-all`}
                                                hidden
                                                onChangeCapture={() => {
                                                    if (messageRef.current) {
                                                        messageRef.current.style.height = 'auto';
                                                        messageRef.current.style.height = `${messageRef.current.scrollHeight + 8}px`;
                                                    }
                                                }}
                                                {...field}
                                                ref={messageRef}
                                            ></textarea>
                                        )}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                    <div className='flex justify-center'>
                        <Button
                            type='submit'
                            className={`${nunitoBold.className} w-56 h-10 text-lg border resize-none overflow-y-hidden min-h-10 border-background bg-primary hover:bg-primary-light text-white rounded-full flex items-center gap-2 justify-center tracking-wide shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.1)]`}
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default ContactUs;
