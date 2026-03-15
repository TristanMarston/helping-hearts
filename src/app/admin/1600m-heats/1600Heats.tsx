'use client';

import { generate1600Heats, getHeats } from '@/app/actions/heats';
import { cn } from '@/lib/utils';
import { ChevronDown, Home, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export type Heat = {
    id: string;
    eventName: string;
    events: Event[];
    number: number;
    type: 'community' | 'youth';
    open: boolean;
};

export type Event = {
    id: string;
    name: string;
    youthAthlete: any | null;
    communityAthlete: any | null;
    lane: number | null;
};

const Heats = () => {
    const [communityHeats, setCommunityHeats] = useState<Heat[]>([]);
    const [youthHeats, setYouthHeats] = useState<Heat[]>([]);

    const fetchHeats = async () => {
        const res = await Promise.all([getHeats('1600 meters', 'community'), getHeats('1600 meters', 'youth')]);
        if (res[0].success && res[1].success) {
            setCommunityHeats(
                res[0].heats.map((heat) => ({
                    id: heat.id,
                    eventName: heat.eventName,
                    number: heat.number,
                    type: heat.type,
                    // @ts-ignore
                    events: heat.events.map((e) => ({ id: e.id, name: e.name, youthAthlete: null, communityAthlete: e.communityAthlete || null, lane: e.lane })),
                    open: true,
                })),
            );
            setYouthHeats(
                res[1].heats.map((heat) => ({
                    id: heat.id,
                    eventName: heat.eventName,
                    number: heat.number,
                    type: heat.type,
                    // @ts-ignore
                    events: heat.events.map((e) => ({ id: e.id, name: e.name, youthAthlete: e.youthAthlete || null, communityAthlete: null, lane: e.lane })),
                    open: true,
                })),
            );
        } else {
            toast.error('Failed to fetch heats', {
                className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
                position: 'top-center',
            });
        }
    };

    useEffect(() => {
        fetchHeats();
    }, []);

    const handleGenerateCommunity = async () => {
        const toastID = toast.loading('Generating heats...', {
            className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
            position: 'top-center',
        });

        const res = await generate1600Heats('community');
        if (res.success) {
            toast.success('Successfully generated heats', {
                id: toastID,
                duration: 6000,
            });

            setCommunityHeats(
                res.heats.map((heat) => ({
                    id: heat.id,
                    eventName: heat.eventName,
                    number: heat.number,
                    type: heat.type,
                    // @ts-ignore
                    events: heat.events.map((e) => ({ id: e.id, name: e.name, youthAthlete: null, communityAthlete: e.communityAthlete, lane: e.lane })),
                    open: true,
                })),
            );
        } else {
            toast.error(res.error, {
                id: toastID,
                duration: 6000,
            });
        }
    };

    const handleGenerateYouth = async () => {
        const toastID = toast.loading('Generating heats...', {
            className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
            position: 'top-center',
        });

        const res = await generate1600Heats('youth');
        if (res.success) {
            toast.success('Successfully generated heats', {
                id: toastID,
                duration: 6000,
            });

            setYouthHeats(
                res.heats.map((heat) => ({
                    id: heat.id,
                    eventName: heat.eventName,
                    number: heat.number,
                    type: heat.type,
                    // @ts-ignore
                    events: heat.events.map((e) => ({ id: e.id, name: e.name, youthAthlete: e.youthAthlete, communityAthlete: null, lane: e.lane })),
                    open: true,
                })),
            );
        } else {
            toast.error(res.error, {
                id: toastID,
                duration: 6000,
            });
        }
    };

    return (
        <div className='mt-28 pb-16 w-full flex flex-col justify-center items-center px-3 phone:px-6 max-w-[1400px] font-fredoka'>
            <div className='w-full flex flex-col gap-4 max-w-[1240px]'>
                <h1
                    className={`font-sour-gummy font-extrabold text-black leading-none text-center text-[40px] mid-mobile:text-[44px] min-[500px]:text-left min-[500px]:text-5xl uppercase`}
                >
                    1600m Heats
                </h1>
                <Link
                    href='/admin'
                    className='bg-background-very-light font-fredoka font-bold text-primary rounded-full shadow-[0_4px_30px_rgba(0,0,0,.15)] tracking-wider action-bar-expand:w-fit px-4 py-2 uppercase flex items-center justify-center gap-2 w-full cursor-pointer transition-all hover:brightness-110'
                >
                    <Home className='w-5 h-5' strokeWidth={2.5} />
                    DASHBOARD
                </Link>
                <section className='mt-2'>
                    <div className='flex items-center gap-3'>
                        <h3 className='font-fredoka font-bold text-black text-3xl uppercase'>Community</h3>
                        <button
                            onClick={handleGenerateCommunity}
                            className='bg-background-light p-2 rounded-full border border-primary shadow-sm cursor-pointer hover:bg-background-very-light'
                        >
                            <RefreshCcw className='text-primary' strokeWidth={2.5} />
                        </button>
                    </div>
                    <div className='mt-2 space-y-3'>
                        {communityHeats.map((heat) => (
                            <div className='space-y-2' key={heat.id}>
                                <span className='font-bold tracking-wide text-lg text-black uppercase flex items-center gap-2'>
                                    <span>Heat #{heat.number}</span>
                                    <motion.button
                                        variants={{
                                            open: { rotate: 180, transition: { duration: 0.05, ease: 'linear' } },
                                            closed: { rotate: 0, transition: { duration: 0.05, ease: 'linear' } },
                                        }}
                                        animate={heat.open ? 'open' : 'closed'}
                                        className='bg-background-light rounded-full p-0.5 border border-primary text-primary hover:bg-background-very-light transition-all cursor-pointer'
                                        onClick={() => setCommunityHeats(communityHeats.map((h) => (h.id === heat.id ? { ...h, open: !h.open } : h)))}
                                    >
                                        <ChevronDown />
                                    </motion.button>
                                </span>
                                <div className='border border-gray-200 rounded-[14px] flex flex-col gap-2'>
                                    {heat.open ? (
                                        heat.events
                                            .sort((a, b) => (a.lane ? a.lane : 100) - (b.lane ? b.lane : 100))
                                            .map((event, i) => (
                                                <div key={event.id} className={cn('p-3', i !== heat.events.length - 1 ? 'border-b-2 border-gray-800' : '')}>
                                                    <div className='flex items-center justify-between'>
                                                        <div className='flex items-center gap-2'>
                                                            <div className='rounded-full border border-primary p-1 w-8 h-8 aspect-square flex items-center justify-center bg-primary-light text-white'>
                                                                {event.lane}
                                                            </div>
                                                            <div className='flex items-center gap-2'>
                                                                <span className='font-bold text-black uppercase'>{event.communityAthlete?.name}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='flex items-center justify-center px-4 py-6 border border-gray-200 mt-2 rounded-[10px] hover:bg-background-secondary cursor-pointer transition-all'>
                                                        <span className='font-nunito font-black tracking-wider text-5xl'>
                                                            {event.communityAthlete?.bibNumber ? event.communityAthlete.bibNumber : 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                    ) : (
                                        <span className='text-center p-2 font-bold tracking-widest'>...</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                <section className='mt-4'>
                    <div className='flex items-center gap-3'>
                        <h3 className='font-fredoka font-bold text-black text-3xl uppercase'>Youth</h3>
                        <button
                            onClick={handleGenerateYouth}
                            className='bg-background-light p-2 rounded-full border border-primary shadow-sm cursor-pointer hover:bg-background-very-light'
                        >
                            <RefreshCcw className='text-primary' strokeWidth={2.5} />
                        </button>
                    </div>
                    <div className='mt-2 space-y-3'>
                        {youthHeats.map((heat) => (
                            <div className='space-y-2' key={heat.id}>
                                <span className='font-bold tracking-wide text-lg text-black uppercase flex items-center gap-2'>
                                    <span>Heat #{heat.number}</span>
                                    <motion.button
                                        variants={{
                                            open: { rotate: 180, transition: { duration: 0.05, ease: 'linear' } },
                                            closed: { rotate: 0, transition: { duration: 0.05, ease: 'linear' } },
                                        }}
                                        animate={heat.open ? 'open' : 'closed'}
                                        className='bg-background-light rounded-full p-0.5 border border-primary text-primary hover:bg-background-very-light transition-all cursor-pointer'
                                        onClick={() => setYouthHeats(youthHeats.map((h) => (h.id === heat.id ? { ...h, open: !h.open } : h)))}
                                    >
                                        <ChevronDown />
                                    </motion.button>
                                </span>
                                <div className='border border-gray-200 rounded-[14px] flex flex-col gap-2'>
                                    {heat.open ? (
                                        heat.events
                                            .sort((a, b) => (a.lane ? a.lane : 100) - (b.lane ? b.lane : 100))
                                            .map((event, i) => (
                                                <div key={event.id} className={cn('p-3', i !== heat.events.length - 1 ? 'border-b-2 border-gray-800' : '')}>
                                                    <div className='flex items-center justify-between'>
                                                        <div className='flex items-center gap-2'>
                                                            <div className='rounded-full border border-primary p-1 w-8 h-8 aspect-square flex items-center justify-center bg-primary-light text-white'>
                                                                {event.lane}
                                                            </div>
                                                            <div className='flex items-center gap-2'>
                                                                <span className='font-bold text-black uppercase'>{event.youthAthlete?.name}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='flex items-center relative justify-center px-4 py-6 border border-gray-200 mt-2 rounded-[10px] hover:bg-background-secondary cursor-pointer transition-all'>
                                                        <span className='font-nunito font-black tracking-wider text-5xl'>
                                                            {event.youthAthlete?.bibNumber ? event.youthAthlete.bibNumber : 'N/A'}
                                                        </span>
                                                        <span className='absolute left-1 bottom-0 uppercase text-xs font-semibold '>{event.youthAthlete.grade}</span>
                                                    </div>
                                                </div>
                                            ))
                                    ) : (
                                        <span className='text-center p-2 font-bold tracking-widest'>...</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Heats;
