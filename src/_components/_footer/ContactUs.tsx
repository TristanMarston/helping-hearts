'use client';

import { Fredoka, Jua, Nunito, Sour_Gummy } from 'next/font/google';
import { useEffect, useRef, useState } from 'react';
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

    useEffect(() => {
        if (formData.message === '') {
            if (messageRef.current) {
                messageRef.current.style.height = 'auto';
                messageRef.current.style.height = `${messageRef.current.scrollHeight + 8}px`;
            }
        }
    }, [formData]);

    return (
        <div className='mx-4 w-full mid-tablet:grid mid-tablet:grid-cols-[2fr_3fr] max-w-[1280px] gap-10 justify-center' id='contact-us'>
            <div className='flex flex-col gap-5 mb-5'>
                <h1 className={`${sourGummySemibold.className} text-background text-4xl text-center mid-tablet:text-left`}>have any questions?</h1>
                <h4 className={`${fredokaLight.className} text-white text-base mablet:text-lg text-center mid-tablet:text-left flex flex-col gap-y-3`}>
                    <p className=''>
                        Contact us <span className='inline-block mid-tablet:hidden'>below</span>
                        <span className='hidden mid-tablet:inline-block'>at right</span> (preferred), or email{' '}
                        <a className='underline' href='mailto:dphsmedicalclub@gmail.com'>
                            dphsmedicalclub@gmail.com
                        </a>
                    </p>

                    <p>Our team will try our best to respond within 24 hours. If you do not receive a reply promptly, please send another message or email.</p>
                </h4>
            </div>
            <div className='w-full flex flex-col items-center'>
                <h1 className={`${sourGummySemibold.className} text-background text-4xl mb-3`}>contact us</h1>
                <form className='my-4 tablet:my-0 w-full grid grid-rows-[72px_72px_72px_72px_1fr] two-column:grid-rows-[72px_72px_1fr] grid-cols-2 items-center justify-center gap-y-4 gap-x-4'>
                    {Object.keys(formData).map((key, index) => (
                        <div key={key + index} className={`flex flex-col ${key === 'message' ? 'col-span-2 row-span-1' : 'row-span-1 col-span-2 two-column:col-span-1'}`}>
                            <label className={`${sourGummySemibold.className} text-background text-2xl`}>
                                {key
                                    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
                                    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1 $2')
                                    .toLowerCase()}
                            </label>
                            {key === 'message' ? (
                                <textarea
                                    rows={1}
                                    className={`${fredokaLight.className} bg-primary rounded-none resize-none h-10 max-h-full align-bottom pt-2 flex focus:border-b-primary-dark w-full border-b border-b-background mt-0 outline-none text-background pl-2 transition-all`}
                                    hidden
                                    value={formData[key as keyof typeof formData]}
                                    onChange={(e) => setFormData({ ...formData, [key as keyof typeof formData]: e.target.value })}
                                    onChangeCapture={() => {
                                        if (messageRef.current) {
                                            messageRef.current.style.height = 'auto';
                                            messageRef.current.style.height = `${messageRef.current.scrollHeight + 8}px`;
                                        }
                                    }}
                                    ref={messageRef}
                                ></textarea>
                            ) : (
                                <input
                                    type='text'
                                    value={formData[key as keyof typeof formData]}
                                    onChange={(e) => setFormData({ ...formData, [key as keyof typeof formData]: e.target.value })}
                                    className={`${fredokaLight.className} bg-primary rounded-none h-10 flex focus:border-b-primary-dark w-full border-b border-b-background outline-none text-background pl-2 transition-all`}
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
            </div>
        </div>
    );
};

export default ContactUs;
