'use client';

import { useAnimate } from 'framer-motion';
import { Fredoka, Sour_Gummy } from 'next/font/google';
import { useEffect, useRef, useState } from 'react';

const sourGummyBold = Sour_Gummy({ weight: '800', subsets: ['latin'] });
const fredokaBold = Fredoka({ weight: '600', subsets: ['latin'] });
const fredokaLight = Fredoka({ weight: '400', subsets: ['latin'] });

const COUNTDOWN_FROM = '2025-03-01T07:30:00';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

type Units = 'Day' | 'Hour' | 'Minute' | 'Second';

const ShiftingCountdown = () => {
    return (
        <div className='bg-gradient-to-br from-primary to-primary-light rounded-[40px] p-2.5 mid-phone:p-4 w-full max-w-3xl'>
            <div className='mx-auto flex w-full items-center rounded-[40px] shadow-lg'>
                <CountdownItem unit='Day' text='days' index={0} />
                <CountdownItem unit='Hour' text='hours' index={1} />
                <CountdownItem unit='Minute' text='minutes' index={2} />
                <CountdownItem unit='Second' text='seconds' index={3} />
            </div>
        </div>
    );
};

const CountdownItem = ({ unit, text, index }: { unit: Units; text: string; index: number }) => {
    const { ref, time } = useTimer(unit);

    return (
        <div
            className={`${
                index === 0 ? 'rounded-l-[30px]' : index === 3 ? 'rounded-r-[30px]' : 'rounded-none'
            } flex py-4 mid-phone:py-6 w-1/4 flex-col bg-background-light items-center justify-center gap-1 border-r-[1px] border-slate-200 font-mono md:h-36 md:gap-2`}
        >
            <div className={`${fredokaBold.className} relative w-full overflow-hidden text-center`}>
                <span ref={ref} className='block text-2xl font-medium text-black mid-phone:text-4xl mid-tablet:text-5xl'>
                    {time}
                </span>
            </div>
            <span className={`${fredokaLight.className} text-xs font-light text-slate-500 mid-phone:text-sm mid-tablet:text-base`}>{text}</span>
        </div>
    );
};

export default ShiftingCountdown;

const useTimer = (unit: Units) => {
    const [ref, animate] = useAnimate();

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timeRef = useRef(0);

    const [time, setTime] = useState(0);

    useEffect(() => {
        intervalRef.current = setInterval(handleCountdown, 1000);

        return () => clearInterval(intervalRef.current || undefined);
    }, []);

    const handleCountdown = async () => {
        const end = new Date(COUNTDOWN_FROM);
        const now = new Date();
        const distance = +end - +now;

        let newTime = 0;

        if (unit === 'Day') {
            newTime = Math.floor(distance / DAY);
        } else if (unit === 'Hour') {
            newTime = Math.floor((distance % DAY) / HOUR);
        } else if (unit === 'Minute') {
            newTime = Math.floor((distance % HOUR) / MINUTE);
        } else {
            newTime = Math.floor((distance % MINUTE) / SECOND);
        }

        if (newTime !== timeRef.current) {
            // Exit animation
            await animate(ref.current, { y: ['0%', '-50%'], opacity: [1, 0] }, { duration: 0.35 });

            timeRef.current = newTime;
            setTime(newTime);

            // Enter animation
            await animate(ref.current, { y: ['50%', '0%'], opacity: [0, 1] }, { duration: 0.35 });
        }
    };

    return { ref, time };
};
