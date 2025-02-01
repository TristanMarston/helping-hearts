'use client';

import { Fredoka, Jua, Nunito, Sour_Gummy } from 'next/font/google';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ContactFormData } from './Footer';

const jua = Jua({ weight: '400', subsets: ['latin'] });
const nunitoLight = Nunito({ weight: '400', subsets: ['latin'] });
const nunitoBold = Nunito({ weight: '800', subsets: ['latin'] });

const sourGummyBold = Sour_Gummy({ weight: '800', subsets: ['latin'] });
const sourGummySemibold = Sour_Gummy({ weight: '700', subsets: ['latin'] });
const fredokaBold = Fredoka({ weight: '600', subsets: ['latin'] });
const fredokaLight = Fredoka({ weight: '400', subsets: ['latin'] });

type FormMapArray = {
    name: 'firstName' | 'lastName' | 'email' | 'subject' | 'message';
    label: string;
    ref?: React.MutableRefObject<HTMLInputElement>;
    description?: string;
};

const ContactUs = ({
    setConfirmMessageModalOpen,
    formData,
    setFormData,
}: {
    setConfirmMessageModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    formData: ContactFormData;
    setFormData: React.Dispatch<React.SetStateAction<ContactFormData>>;
}) => {
    const messageRef = useRef<HTMLTextAreaElement>(null);
    const [dialogKey, setDialogKey] = useState(0);

    // const disabledInputs = [
    //     {
    //         label: 'name',
    //         value: `${firstNameRef.current != undefined ? firstNameRef.current.value.trim() : ''} ${lastNameRef.current != undefined ? lastNameRef.current.value.trim() : ''}`,
    //     },
    //     { label: 'email', value: `${emailRef.current != undefined ? emailRef.current.value.trim() : ''}` },
    //     { label: 'subject', value: `${subjectRef.current != undefined ? subjectRef.current.value.trim() : ''}` },
    //     { label: 'message', value: `${messageRef.current != undefined ? messageRef.current.value.trim() : ''}` },
    // ];

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

    return (
        <div className='mx-4 w-full mid-tablet:grid mid-tablet:grid-cols-[2fr_3fr] max-w-[1280px] gap-10 justify-center' id='contact-us'>
            <div className='flex flex-col gap-5 mb-5'>
                <h1 className={`${sourGummySemibold.className} text-background text-4xl text-center tablet:text-left`}>have any questions?</h1>
                <h4 className={`${fredokaLight.className} text-white text-base mablet:text-lg text-center tablet:text-left flex flex-col gap-y-3`}>
                    <p className=''>
                        Contact us <span className=' inline-block'>below</span> (preferred), or email{' '}
                        <a className='underline' href='mailto:dphsmedicalclub@gmail.com'>
                            dphsmedicalclub@gmail.com
                        </a>
                    </p>

                    <p>Our team will try our best to respond within 24 hours. If you do not receive a reply promptly, please send another message or email.</p>
                </h4>
            </div>
            <div className='w-full flex flex-col items-center'>
                <h1 className={`${sourGummySemibold.className} text-background text-4xl mb-3`}>contact us</h1>
                <form className='my-4 tablet:my-0 w-full grid grid-rows-[72px_72px_72px_72px_1fr] grid-cols-2 items-center justify-center gap-y-4 gap-x-4'>
                    {Object.keys(formData).map((key, index) => (
                        <div key={key + index} className={`flex flex-col ${key === 'message' ? 'col-span-2 row-span-1' :  'row-span-1 col-span-2 two-column:col-span-1'}`}>
                            <label className={`${sourGummySemibold.className} text-background text-2xl`}>
                                {key
                                    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
                                    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1 $2')
                                    .toLowerCase()}
                            </label>
                            {key === 'message' ? (
                                <textarea
                                    rows={1}
                                    className={`${fredokaLight.className} bg-primary resize-none h-10 max-h-full align-bottom pt-2 flex focus:border-b-primary-dark w-full border-b border-b-background mt-0 outline-none text-background pl-2 transition-all`}
                                    hidden
                                    value={formData[key as keyof typeof formData]}
                                    onChange={(e) => setFormData({ ...formData, [key as keyof typeof formData]: e.target.value })}
                                    onChangeCapture={() => {
                                        if (messageRef.current) {
                                            messageRef.current.style.height = 'auto';
                                            messageRef.current.style.height = `${messageRef.current.scrollHeight + 8}px`;
                                        }
                                        setDialogKey((prev) => prev + 1);
                                    }}
                                    ref={messageRef}
                                ></textarea>
                            ) : (
                                <input
                                    type='text'
                                    value={formData[key as keyof typeof formData]}
                                    onChange={(e) => setFormData({ ...formData, [key as keyof typeof formData]: e.target.value })}
                                    className={`${fredokaLight.className} bg-primary h-10 flex focus:border-b-primary-dark w-full border-b border-b-background outline-none text-background pl-2 transition-all`}
                                />
                            )}
                        </div>
                    ))}
                    <div className='grid place-items-center col-span-2'>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setConfirmMessageModalOpen(true);
                            }}
                            className={`${fredokaBold.className} w-4/5 py-1.5 mt-8 text-lg border min-h-10 border-background bg-primary hover:bg-primary-light transition-all text-white rounded-full flex items-center gap-2 justify-center tracking-wide shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.1)]`}
                        >
                            Submit
                        </button>
                    </div>
                </form>

                {/* <Form {...form}>
                    <form
                        handleSubmit={form.handleSubmit(handleSubmit)}
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
                                        <FormLabel className={`${sourGummySemibold.className} text-background text-2xl`}>{data.label}</FormLabel>
                                        <FormControl>
                                            {data.name != 'message' ? (
                                                <Input
                                                    {...field}
                                                    type='text'
                                                    ref={data.ref}
                                                    className={`${fredokaLight.className} bg-primary h-10 flex focus:border-b-primary-dark w-full border-b border-b-background outline-none text-background pl-2 transition-all`}
                                                    autoComplete='off'
                                                    hidden
                                                    onChangeCapture={() => setDialogKey((prev) => prev + 1)}
                                                />
                                            ) : (
                                                <textarea
                                                    rows={1}
                                                    className={`${fredokaLight.className} bg-primary resize-none h-10 max-h-full align-bottom pt-2 flex focus:border-b-primary-dark w-full border-b border-b-background mt-0 outline-none text-background pl-2 transition-all`}
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
                                        <DialogTitle className={`${nunitoBold.className} text-2xl`}>Ready to submit?</DialogTitle>
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
                                                            } hover:cursor-not-allowed rounded-md text-ellipsis overflow-hidden opacity-50 bg-background min-h-[4.25rem] max-h-32 h-full w-full max-w-[390px] px-2 py-2 border-gray-100 border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                                                            style={{ lineHeight: 'normal' }}
                                                        ></textarea>
                                                    ) : (
                                                        <Input
                                                            disabled
                                                            type='text'
                                                            value={data.value}
                                                            className={`${
                                                                data.label == 'email' && !/\S+@\S+\.\S+/.test(data.value) ? 'border-red-500' : 'border-gray-100'
                                                            } bg-background h-8 w-full rounded-md px-2 py-2 border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogClose
                                        onClick={form.handleSubmit(handleSubmit)}
                                        className={`${nunitoBold.className} bg-primary transition-all mt-2 hover:bg-primary-light text-white h-10 rounded-md text-sm`}
                                    >
                                        Submit
                                    </DialogClose>
                                    <DialogClose className={`${nunitoBold.className} bg-background hover:bg-background-dark h-10 transition-all rounded-md text-sm`}>Cancel</DialogClose>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </form>
                </Form> */}
            </div>
        </div>
    );
};

export default ContactUs;
