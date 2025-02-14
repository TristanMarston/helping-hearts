import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Fredoka, Sour_Gummy } from 'next/font/google';
import { useEffect, useState } from 'react';

const sourGummyBold = Sour_Gummy({ weight: '800', subsets: ['latin'] });
const sourGummySemibold = Sour_Gummy({ weight: '700', subsets: ['latin'] });
const fredokaBold = Fredoka({ weight: '600', subsets: ['latin'] });
const fredokaSemibold = Fredoka({ weight: '500', subsets: ['latin'] });
const fredokaLight = Fredoka({ weight: '400', subsets: ['latin'] });

const SubmitModal = ({
    open,
    setOpen,
    handleSubmit,
    signUpView,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleSubmit: () => void;
    signUpView: 'youth' | 'community' | 'volunteer';
}) => {
    const [canSubmit, setCanSubmit] = useState({ waiver: signUpView === 'volunteer', terms: false });

    useEffect(() => {
        if (open) {
            setCanSubmit({ waiver: signUpView === 'volunteer', terms: false });
        }
    }, [open]);

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className='bg-slate-900/20 backdrop-blur p-2 mid-mobile:p-4 mid-phone:p-6 fixed inset-0 z-[100] grid place-items-center overflow-y-scroll cursor-pointer'
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: '12.5deg' }}
                            animate={{ scale: 1, rotate: '0deg' }}
                            exit={{ scale: 0, rotate: '0deg' }}
                            onClick={(e) => e.stopPropagation()}
                            className='bg-background gap-2.5 text-white p-5 mid-phone:p-6 w-full max-w-3xl shadow-xl cursor-default relative overflow-hidden rounded-xl'
                        >
                            <X className='absolute right-4 top-4 cursor-pointer text-primary' onClick={() => setOpen(false)} />
                            <h2 className={`${fredokaBold.className} text-2xl mid-mobile:text-3xl mid-phone:text-4xl text-primary`}>Ready to submit?</h2>
                            <section className='flex flex-col items-start text-left w-full gap-2'>
                                <p className={`${fredokaSemibold.className} text-primary opacity-60 text-xs mid-mobile:text-sm mid-phone:text-base`}>
                                    <span>
                                        REMINDER &ndash; the event will take place on <b>March 1st, 2025</b>.
                                    </span>
                                    {signUpView !== 'volunteer' && <span> Please arrive by 7:30 AM to check in (opens at 7:00 AM).</span>}
                                </p>
                                <div className='flex flex-col gap-2 px-3'>
                                    <span className='flex gap-2 items-center'>
                                        <div
                                            className={`${
                                                canSubmit.terms
                                                    ? 'bg-primary border-none shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'
                                                    : 'bg-background border-2'
                                            } w-5 h-5 min-w-5 flex justify-center items-center rounded-md cursor-pointer transition-all`}
                                            onClick={() => {
                                                setCanSubmit((prev) => {
                                                    return { ...prev, terms: !prev.terms };
                                                });
                                            }}
                                        >
                                            {canSubmit.terms && <Check color='white' strokeWidth={3} width={14} height={14} />}
                                        </div>
                                        <label className={`${fredokaLight.className} text-gray-600`}>
                                            {signUpView === 'volunteer' ? (
                                                <span>
                                                    I understand that I am needed from <b>7:00 AM to 10:30 AM</b> on <b>March 1st, 2025</b> to help with the event.
                                                </span>
                                            ) : signUpView === 'youth' ? (
                                                <span>
                                                    I understand that the event has a <b>$10 participation fee</b>, and will show up to the event with $10 for each participant that I
                                                    plan to bring.
                                                </span>
                                            ) : (
                                                signUpView === 'community' && (
                                                    <span>
                                                        I understand that the event has a <b>$10 participation fee</b>, and will show up to the event with $10.
                                                    </span>
                                                )
                                            )}
                                        </label>
                                    </span>
                                    {signUpView !== 'volunteer' && (
                                        <>
                                            <span className='flex gap-2 items-center'>
                                                <div
                                                    className={`${
                                                        canSubmit.waiver
                                                            ? 'bg-primary border-none shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'
                                                            : 'bg-background border-2'
                                                    } w-5 h-5 flex min-w-5 justify-center items-center rounded-md cursor-pointer transition-all`}
                                                    onClick={() => {
                                                        setCanSubmit((prev) => {
                                                            return { ...prev, waiver: !prev.waiver };
                                                        });
                                                    }}
                                                >
                                                    {canSubmit.waiver && <Check color='white' strokeWidth={3} width={14} height={14} />}
                                                </div>
                                                <label className={`${fredokaLight.className} text-gray-600`}>
                                                    By checking this box, I will acknowledge that I have read and agree to the terms of the waiver below.
                                                </label>
                                            </span>
                                            <div className={`${fredokaLight.className} p-3 w-full rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.1)] overflow-y-scroll h-32 text-gray-600`}>
                                                The Undersigned hereby agrees to defend, indemnify, and hold harmless Helping Hearts and Dos Pueblos High School, its officials,
                                                employers and agents from and against all loss, liability, charges, and expenses (including attorneys' fees) and cases of whatsoever
                                                character may arise by reason of the participation in this year's Helping Hearts Youth Track Event or be connected anyway therewith. The
                                                above-mentioned agencies do not provide accident, medical, liability or workers compensation insurance for program participants.
                                            </div>
                                        </>
                                    )}
                                </div>
                            </section>
                            <div className='flex flex-col gap-2 mid-phone:gap-2.5 mt-4'>
                                <button
                                    onClick={() => {
                                        if (!canSubmit.terms || !canSubmit.waiver) return;
                                        handleSubmit();
                                        setOpen(false);
                                    }}
                                    className={`${fredokaBold.className} ${
                                        canSubmit.terms && canSubmit.waiver ? 'opacity-100 cursor-pointer' : 'opacity-30 cursor-not-allowed'
                                    } bg-primary hover:brightness-125 transition-all text-background w-full p-1 text-base mid-phone:p-1.5 mid-phone:text-lg rounded-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.25)]`}
                                >
                                    Submit
                                </button>
                                <button
                                    onClick={() => setOpen(false)}
                                    className={`${fredokaBold.className} bg-transparent hover:bg-background-secondary transition-all text-primary-light w-full p-1 text-base mid-phone:p-1.5 mid-phone:text-lg rounded-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.25)]`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SubmitModal;
