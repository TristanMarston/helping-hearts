'use client';

import { Jua, Nunito } from 'next/font/google';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ZodString, z } from 'zod';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

    const [dialogKey, setDialogKey] = useState(0);
    const viewMessageRef = useRef(null);

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

    const disabledInputs = [
        {
            label: 'name',
            value: `${firstNameRef.current != undefined ? firstNameRef.current.value.trim() : ''} ${lastNameRef.current != undefined ? lastNameRef.current.value.trim() : ''}`,
        },
        { label: 'email', value: `${emailRef.current != undefined ? emailRef.current.value.trim() : ''}` },
        { label: 'subject', value: `${subjectRef.current != undefined ? subjectRef.current.value.trim() : ''}` },
        { label: 'message', value: `${messageRef.current != undefined ? messageRef.current.value.trim() : ''}` },
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
        values['firstName'] = values['firstName']?.trim();
        values['lastName'] = values['lastName']?.trim();
        values['subject'] = values['subject']?.trim();
        values['email'] = values['email']?.trim();
        values['message'] = values['message']?.trim();

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
                    formMapArray.forEach((item) => (item.ref != undefined ? (item.ref.current.value = '') : ''));
                    messageRef.current.value = '';
                    form.reset();
                    messageRef.current.style.height = `40px`;
                }
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
        <div className='mx-4 w-full tablet:grid grid-cols-[2fr_3fr] max-w-[1280px] gap-10 justify-center' id='contact-us'>
            <div className='hidden tablet:flex flex-col gap-5'>
                <h1 className={`${jua.className} text-background text-4xl`}>have any questions?</h1>
                <h4 className={`${nunitoLight.className} text-white text-lg`}>
                    Contact us at right, or email<br></br>
                    <a className='underline' href='mailto:dphsmedicalclub@gmail.com'>
                        dphsmedicalclub@gmail.com
                    </a>
                    <br></br>
                    <br></br>
                    Our team will try our best<br></br>to respond within 24 hours.
                </h4>
            </div>
            <div className='w-full flex flex-col items-center'>
                <h1 className={`${jua.className} text-background text-4xl`}>contact us</h1>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='my-4 tablet:my-0 w-full grid grid-rows-[72px] grid-cols-1 tablet:grid-rows-[1fr] tablet:grid-cols-2 tablet:gap-x-5 laptop:grid-rows-[1fr]'
                    >
                        {formMapArray.map((data, index) => (
                            <FormField
                                key={data.label + index}
                                control={form.control}
                                name={data.name}
                                render={({ field }) => (
                                    <FormItem
                                        className={`${
                                            data.label == 'first name' || data.label == 'last name'
                                                ? 'row-span-1 col-span-2 tablet:col-span-1'
                                                : data.label == 'email*' || data.label == 'subject'
                                                ? 'row-span-1 col-span-2 laptop:col-span-1'
                                                : 'row-span-1 col-span-2'
                                        } ${data.label != 'first name' ? 'mt-8' : 'mt-0 tablet:mt-8'} ${data.label != 'message*' ? 'max-h-[72px]' : 'max-h-full'}`}
                                    >
                                        <FormLabel className={`${jua.className} text-background text-2xl`}>{data.label}</FormLabel>
                                        <FormControl>
                                            {data.name != 'message' ? (
                                                <Input
                                                    {...field}
                                                    type='text'
                                                    ref={data.ref}
                                                    className={`${nunitoLight.className} bg-primary h-10 flex focus:border-b-primary-dark w-full border-b border-b-background outline-none text-background pl-2 transition-all`}
                                                    autoComplete='off'
                                                    hidden
                                                    onChangeCapture={() => setDialogKey((prev) => prev + 1)}
                                                />
                                            ) : (
                                                <textarea
                                                    rows={1}
                                                    className={`${nunitoLight.className} bg-primary resize-none h-10 max-h-full align-bottom pt-2 flex focus:border-b-primary-dark w-full border-b border-b-background mt-0 outline-none text-background pl-2 transition-all`}
                                                    hidden
                                                    onChangeCapture={() => {
                                                        if (messageRef.current) {
                                                            messageRef.current.style.height = 'auto';
                                                            messageRef.current.style.height = `${messageRef.current.scrollHeight + 8}px`;
                                                        }
                                                        setDialogKey((prev) => prev + 1);
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
                        <div className='flex justify-center col-span-2'>
                            <Dialog>
                                <DialogTrigger
                                    className={`${nunitoBold.className} w-56 h-10 mt-8 text-lg border min-h-10 border-background bg-primary hover:bg-primary-light transition-all text-white rounded-full flex items-center gap-2 justify-center tracking-wide shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.1)]`}
                                >
                                    Submit
                                </DialogTrigger>
                                <DialogContent className='bg-background rounded-md gap-2.5' key={dialogKey}>
                                    <DialogHeader className='flex flex-col items-start'>
                                        <DialogTitle className='text-2xl'>Ready to submit?</DialogTitle>
                                        <DialogDescription className='flex flex-col items-start text-left w-full gap-2'>
                                            <p>Please confirm your message. Our team will try our best to respond via email within 24 hours.</p>
                                            {disabledInputs.map((data, index) => (
                                                <div className='flex gap-3 items-center w-full' key={data.value}>
                                                    <Label htmlFor='name' className='min-w-[3.75rem] flex justify-end'>
                                                        {data.label}
                                                    </Label>
                                                    {data.label == 'message' ? (
                                                        <textarea
                                                            ref={viewMessageRef}
                                                            rows={1}
                                                            disabled
                                                            value={data.value}
                                                            className={`${
                                                                data.value.length > 0 ? 'border-gray-100' : 'border-red-500'
                                                            } hover:cursor-not-allowed text-ellipsis overflow-hidden opacity-50 bg-background rounded-md min-h-[4.25rem] h-full w-full max-w-[390px] px-2 py-2 border-gray-100 border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                                                            style={{ lineHeight: 'normal' }}
                                                        ></textarea>
                                                    ) : (
                                                        <Input
                                                            disabled
                                                            type='text'
                                                            value={data.value}
                                                            className={`${
                                                                data.label == 'email' && !/\S+@\S+\.\S+/.test(data.value) ? 'border-red-500' : 'border-gray-100'
                                                            } bg-background rounded-md h-8 w-full px-2 py-2 border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogClose
                                        onClick={form.handleSubmit(onSubmit)}
                                        className='bg-primary transition-all mt-2 hover:bg-primary-light text-white h-10 rounded-md text-sm'
                                    >
                                        Submit
                                    </DialogClose>
                                    <DialogClose className='bg-background hover:bg-background-dark h-10 transition-all rounded-md text-sm'>Cancel</DialogClose>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default ContactUs;
