'use client';

import { add100400Heat, deleteLane100400Heats, generate100400Heats, getHeats, updateLane100400Heats } from '@/app/actions/heats';
import { cn } from '@/lib/utils';
import { AlertTriangle, ChevronDown, Home, PlusCircle, RefreshCcw, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import UpdateBibModal from './UpdateBibModal';

type Heat = {
    id: string;
    eventName: string;
    events: Event[];
    number: number;
    type: 'community' | 'youth';
    open: boolean;
};

type Event = {
    id: string;
    name: string;
    youthAthlete: any | null;
    lane: number | null;
};

const Heats = ({ which }: { which: '400' | '100' }) => {
    const [heats, setHeats] = useState<Heat[]>([]);
    const [updateBibModal, setUpdateBibModal] = useState<{ heatNumber: number; laneNumber: number } | null>(null);

    const handleGenerateHeats = async () => {
        const toastID = toast.loading('Generating heats...', {
            className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
            position: 'top-center',
        });

        const res = await generate100400Heats(which);

        if (!res.success || !res.heats) toast.error('Unable to generate heats.', { id: toastID, duration: 6000 });

        if (res.heats) {
            setHeats(
                res.heats.map((heat) => ({
                    id: heat.id,
                    eventName: heat.eventName,
                    number: heat.number,
                    type: heat.type,
                    open: false,
                    events: heat.events.map((event: any) => ({
                        id: event.id,
                        name: event.name,
                        // @ts-ignore
                        youthAthlete: event.youthAthlete,
                        lane: event.lane,
                    })),
                })),
            );

            toast.success('Successfully generated heats', { id: toastID, duration: 6000 });
        }
    };

    const handleFetchHeats = async (openArray?: boolean[]) => {
        const toastID = toast.loading('Fetching heats...', {
            className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
            position: 'top-center',
        });

        let res = null;

        if (which === '400') res = await getHeats('400 meters');
        else res = await getHeats('100 meters');

        if (!res.success || !res.heats) toast.error('Unable to fetch heats.', { id: toastID, duration: 6000 });

        if (res.heats) {
            setHeats(
                res.heats.map((heat, index) => ({
                    id: heat.id,
                    eventName: heat.eventName,
                    number: heat.number,
                    type: heat.type,
                    open: openArray && index < res.heats.length ? openArray[index] : false,
                    events: heat.events.map((event) => ({
                        id: event.id,
                        name: event.name,
                        // @ts-ignore
                        youthAthlete: event.youthAthlete,
                        lane: event.lane,
                    })),
                })),
            );
        }

        toast.dismiss(toastID);
    };

    const handleRemoveLane = async (heatNumber: number, laneNumber: number) => {
        const toastID = toast.loading('Deleting lane...', {
            className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
            position: 'top-center',
        });

        const res = await deleteLane100400Heats(which, heatNumber, laneNumber);
        if (res.success) {
            handleFetchHeats(heats.map((h) => h.open));
            toast.success('Successfully deleted lane', { id: toastID, duration: 6000 });
        } else {
            toast.error('Failed to delete lane', { id: toastID, duration: 6000 });
        }
    };

    const handleUpdateLane = async (heatNumber: number, laneNumber: number, bib: number) => {
        const toastID = toast.loading('Updating lane...', {
            className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
            position: 'top-center',
        });

        const res = await updateLane100400Heats(which, heatNumber, laneNumber, bib);
        if (res.success) {
            handleFetchHeats(heats.map((h) => h.open));
            toast.success('Successfully updated lane', { id: toastID, duration: 6000 });
        } else {
            toast.error('Failed to update lane', { id: toastID, duration: 6000 });
        }
    };

    const handleAddHeat = async () => {
        const toastID = toast.loading('Adding heat...', {
            className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
            position: 'top-center',
        });

        const res = await add100400Heat(which);
        if (res.success) {
            handleFetchHeats(heats.map((h) => h.open));
            toast.success('Successfully added heat', { id: toastID, duration: 6000 });
        } else {
            toast.error('Failed to add heat', { id: toastID, duration: 6000 });
        }
    };

    useEffect(() => {
        handleFetchHeats();
    }, []);

    return (
        <>
            <div className='mt-28 pb-16 w-full flex flex-col justify-center items-center px-3 phone:px-6 max-w-[1400px] font-fredoka'>
                <div className='w-full flex flex-col gap-4 max-w-[1240px]'>
                    <h1
                        className={`font-sour-gummy font-extrabold text-black leading-none text-center text-[40px] mid-mobile:text-[44px] min-[500px]:text-left min-[500px]:text-5xl uppercase`}
                    >
                        {which === '400' ? '400m' : '100m'} Heats
                    </h1>
                    <Link
                        href='/admin'
                        className='bg-background-very-light font-fredoka font-bold text-primary rounded-full shadow-[0_4px_30px_rgba(0,0,0,.15)] tracking-wider action-bar-expand:w-fit px-4 py-2 uppercase flex items-center justify-center gap-2 w-full cursor-pointer transition-all hover:brightness-110'
                    >
                        <Home className='w-5 h-5' strokeWidth={2.5} />
                        DASHBOARD
                    </Link>
                    <section className='mt-4'>
                        <div className='flex items-center gap-3'>
                            <h3 className='font-fredoka font-bold text-black text-3xl uppercase flex items-center gap-2'>
                                <AlertTriangle className='w-7 h-7 text-red-500' strokeWidth={2.5} />
                                <span>Generate</span>
                            </h3>
                            <button
                                onClick={handleGenerateHeats}
                                className='bg-background-light p-2 rounded-full border border-primary shadow-sm cursor-pointer hover:bg-background-very-light'
                            >
                                <RefreshCcw className='text-primary' strokeWidth={2.5} />
                            </button>
                        </div>
                        <div className='mt-2 space-y-3'>
                            {heats.map((heat) => (
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
                                            onClick={() => setHeats(heats.map((h) => (h.id === heat.id ? { ...h, open: !h.open } : h)))}
                                        >
                                            <ChevronDown />
                                        </motion.button>
                                    </span>
                                    <div className='border border-gray-200 rounded-[14px] flex flex-col gap-2'>
                                        {heat.open ? (
                                            Array.from({ length: 9 }, (_, i) => i + 1).map((lane, i) => {
                                                const event =
                                                    heat.events.find((e) => e.lane === lane) || heat.events.sort((a, b) => (a.lane ? a.lane : 100) - (b.lane ? b.lane : 100))[i];
                                                const laneDeleted = !event || event.lane !== lane;

                                                return (
                                                    <div
                                                        key={laneDeleted ? `lane ${lane} heat ${heat.id}` : event.id}
                                                        className={cn('p-3', i !== 8 ? 'border-b-2 border-gray-800' : '')}
                                                    >
                                                        <div className='flex items-center justify-between'>
                                                            <div className='flex items-center gap-2 min-w-0'>
                                                                <div className='rounded-full border border-primary p-1 w-8 h-8 aspect-square flex items-center justify-center bg-primary-light text-white'>
                                                                    {laneDeleted ? lane : event.lane}
                                                                </div>
                                                                <div className='flex items-center gap-2 min-w-0'>
                                                                    <span className='font-bold text-black uppercase truncate'>{laneDeleted ? 'Empty' : event.youthAthlete?.name}</span>
                                                                </div>
                                                            </div>
                                                            {!laneDeleted && (
                                                                <Trash2
                                                                    onClick={() => handleRemoveLane(heat.number, lane)}
                                                                    className='text-red-500 hover:text-red-400 transition-all min-w-5 h-5 mr-2 cursor-pointer'
                                                                />
                                                            )}
                                                        </div>
                                                        <button
                                                            type='button'
                                                            disabled={!laneDeleted}
                                                            onClick={() => setUpdateBibModal({ heatNumber: heat.number, laneNumber: lane })}
                                                            className='flex items-center w-full disabled:pointer-events-none relative justify-center px-4 py-6 border border-gray-200 mt-2 rounded-[10px] hover:bg-background-secondary cursor-pointer transition-all'
                                                        >
                                                            <span className='font-nunito font-black tracking-wider text-5xl'>
                                                                {laneDeleted ? 'X' : event.youthAthlete?.bibNumber ? event.youthAthlete.bibNumber : 'N/A'}
                                                            </span>
                                                            {!laneDeleted && (
                                                                <span className='absolute left-1 bottom-0 uppercase text-xs font-semibold '>{event.youthAthlete.grade}</span>
                                                            )}
                                                        </button>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <span className='text-center p-2 font-bold tracking-widest'>...</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => handleAddHeat()}
                                className='rounded-[14px] border w-full px-2 py-2 text-primary text-lg border-primary flex justify-center items-center font-fredoka gap-2 font-semibold bg-background hover:bg-background-light transition-all cursor-pointer'
                            >
                                <PlusCircle className='w-6 h-6' />
                                <span>Add Heat</span>
                            </button>
                        </div>
                    </section>
                </div>
            </div>
            {updateBibModal !== null && (
                <UpdateBibModal
                    isOpen={!!updateBibModal}
                    onClose={() => setUpdateBibModal(null)}
                    onSubmit={(bib) => {
                        setUpdateBibModal(null);
                        handleUpdateLane(updateBibModal.heatNumber, updateBibModal.laneNumber, bib);
                    }}
                />
            )}
        </>
    );
};

export default Heats;
