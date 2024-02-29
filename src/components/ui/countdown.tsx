import { AnimatePresence, motion } from 'framer-motion';
import { Nunito } from 'next/font/google';
import { useEffect, useRef, useState } from 'react';

const nunitoBold = Nunito({ weight: '800', subsets: ['latin'] });

const COUNTDOWN_FROM = 'March 16, 2024 8:00:00';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const ShiftingCountdown = () => {
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const [remaining, setRemaining] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        intervalRef.current = setInterval(handleCountdown, 1000);

        return () => clearInterval(intervalRef.current || undefined);
    }, []);

    const handleCountdown = () => {
        const end = new Date(COUNTDOWN_FROM);

        const now = new Date();

        const distance = +end - +now;

        const days = Math.floor(distance / DAY);
        const hours = Math.floor((distance % DAY) / HOUR);
        const minutes = Math.floor((distance % HOUR) / MINUTE);
        const seconds = Math.floor((distance % MINUTE) / SECOND);

        setRemaining({
            days,
            hours,
            minutes,
            seconds,
        });
    };

    return (
        <div className='p-4 bg-gradient-to-br from-primary to-primary-pink  w-full rounded-lg'>
            <div className='w-full mx-auto flex items-center bg-background-light rounded-lg border-none'>
                <CountdownItem num={remaining.days} text='days' />
                <CountdownItem num={remaining.hours} text='hours' />
                <CountdownItem num={remaining.minutes} text='minutes' />
                <CountdownItem num={remaining.seconds} text='seconds' />
            </div>
        </div>
    );
};

const CountdownItem = ({ num, text }: { num: number; text: string }) => {
    return (
        <div
            className={`${nunitoBold.className} font-mono w-1/4 h-24 md:h-36 flex flex-col gap-1 md:gap-2 items-center justify-center ${
                text == 'seconds' ? 'border-none' : 'border-r-[1px]'
            } border-slate-200`}
        >
            <div className='w-full text-center relative overflow-hidden'>
                <AnimatePresence mode='popLayout'>
                    <motion.span
                        key={num}
                        initial={{ y: '100%' }}
                        animate={{ y: '0%' }}
                        exit={{ y: '-100%' }}
                        transition={{ ease: 'backIn', duration: 0.75 }}
                        className='block text-2xl tablet:text-3xl laptop:text-4xl text-black font-medium'
                    >
                        {num}
                    </motion.span>
                </AnimatePresence>
            </div>
            <span className='text-xs md:text-sm lg:text-base font-light text-slate-500'>{text}</span>
        </div>
    );
};

export default ShiftingCountdown;
