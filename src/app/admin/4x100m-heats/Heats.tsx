'use client';

import { delete4x100Lane, generate4x100Heats, get4x100Heats, update4x100Lane } from '@/app/actions/heats';
import { cn } from '@/lib/utils';
import { RelayName } from '@prisma/client';
import { AlertTriangle, ChevronDown, Home, PlusCircle, RefreshCcw, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Heat = {
    id: string;
    teams: Team[];
    number: number;
    open: boolean;
};

type Team = {
    id: string;
    name: RelayName;
    performance: string;
    lane: number | null;
    unit: string;
    year: number;
};

const Heats = () => {
    const [heats, setHeats] = useState<Heat[]>([]);
    const [addingTeam, setAddingTeam] = useState<{ heatNumber: number; laneNumber: number } | null>(null);

    const handleGenerateHeats = async () => {
        const toastID = toast.loading('Generating heats...', {
            className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
            position: 'top-center',
        });

        const res = await generate4x100Heats();
        if (res.success) {
            setHeats(
                res.heats.map((heat) => ({
                    id: heat.id,
                    teams: heat.relayTeams,
                    number: heat.number,
                    open: true,
                })),
            );
            toast.success('Successfully generated heats', { id: toastID, duration: 6000 });
        } else toast.error('Error generating heats', { id: toastID, duration: 6000 });
    };

    const fetchHeats = async () => {
        const toastID = toast.loading('Fetching heats...', {
            className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
            position: 'top-center',
        });

        const res = await get4x100Heats();
        if (!res.success || !res.heats) toast.error('Unable to fetch heats.', { id: toastID, duration: 6000 });

        if (res.success) {
            setHeats(
                res.heats.map((heat) => ({
                    id: heat.id,
                    teams: heat.relayTeams,
                    number: heat.number,
                    open: true,
                })),
            );
        } else {
            toast.error('Unable to fetch heats.', { id: toastID, duration: 6000 });
        }

        toast.dismiss(toastID);
    };

    useEffect(() => {
        fetchHeats();
    }, []);

    const handleRemoveLane = async (heatNumber: number, laneNumber: number) => {
        const toastID = toast.loading('Fetching heats...', {
            className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
            position: 'top-center',
        });

        const res = await delete4x100Lane(heatNumber, laneNumber);

        if (res.success) {
            toast.success('Successfully removed lane', { id: toastID, duration: 6000 });
            await fetchHeats();
        } else toast.error('Failed to remove lane', { id: toastID, duration: 6000 });
    };

    const handleAddTeam = async (heatNumber: number, laneNumber: number, name: RelayName) => {
        const toastID = toast.loading('Adding team...', {
            className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
            position: 'top-center',
        });

        const res = await update4x100Lane(heatNumber, laneNumber, name);

        if (res.success) {
            toast.success('Successfully updated lane', { id: toastID, duration: 6000 });
            await fetchHeats();
        } else toast.error('Failed to update lane', { id: toastID, duration: 6000 });
    };

    return (
        <>
            <div className='mt-28 pb-16 w-full flex flex-col justify-center items-center px-3 phone:px-6 max-w-[1400px] font-fredoka'>
                <div className='w-full flex flex-col gap-4 max-w-[1240px]'>
                    <h1
                        className={`font-sour-gummy font-extrabold text-black leading-none text-center text-[40px] mid-mobile:text-[44px] min-[500px]:text-left min-[500px]:text-5xl uppercase`}
                    >
                        4x100m Heats
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
                                                const team = heat.teams.find((t) => t.lane === lane) || heat.teams[i];
                                                const laneDeleted = !team || team.lane !== lane;

                                                return (
                                                    <div key={laneDeleted ? `lane ${lane} heat ${heat.id}` : team.id} className={cn('p-3', i !== 8 ? 'border-b-2 border-gray-800' : '')}>
                                                        <div className='flex items-center justify-between'>
                                                            <div className='flex items-center gap-2 min-w-0'>
                                                                <div className='rounded-full border border-primary p-1 w-8 h-8 aspect-square flex items-center justify-center bg-primary-light text-white'>
                                                                    {laneDeleted ? lane : team.lane}
                                                                </div>
                                                                <div className='flex items-center gap-2 min-w-0'>
                                                                    <span className='font-bold text-black uppercase truncate'>
                                                                        {laneDeleted ? 'Empty' : team.name.replaceAll('_', ' ')}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {laneDeleted ? (
                                                                <PlusCircle
                                                                    onClick={() => setAddingTeam({ heatNumber: heat.number, laneNumber: lane })}
                                                                    className='text-green-500 hover:text-green-400 transition-all min-w-5 h-5 mr-2 cursor-pointer'
                                                                />
                                                            ) : (
                                                                <Trash2
                                                                    onClick={() => handleRemoveLane(heat.number, lane)}
                                                                    className='text-red-500 hover:text-red-400 transition-all min-w-5 h-5 mr-2 cursor-pointer'
                                                                />
                                                            )}
                                                        </div>
                                                        {/* <button
                                                            type='button'
                                                            disabled={!laneDeleted}
                                                            onClick={() => setUpdateBibModal({ heatNumber: heat.number, laneNumber: lane })}
                                                            className='flex items-center w-full disabled:pointer-events-none relative justify-center px-4 py-6 border border-gray-200 mt-2 rounded-[10px] hover:bg-background-secondary cursor-pointer transition-all'
                                                        >
                                                            <span className='font-nunito font-black tracking-wider text-5xl'>
                                                                {laneDeleted ? 'X' : team.youthAthlete?.bibNumber ? team.youthAthlete.bibNumber : 'N/A'}
                                                            </span>
                                                        </button> */}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <span className='text-center p-2 font-bold tracking-widest'>...</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {/* <button
                                onClick={() => handleAddHeat()}
                                className='rounded-[14px] border w-full px-2 py-2 text-primary text-lg border-primary flex justify-center items-center font-fredoka gap-2 font-semibold bg-background hover:bg-background-light transition-all cursor-pointer'
                            >
                                <PlusCircle className='w-6 h-6' />
                                <span>Add Heat</span>
                            </button> */}
                        </div>
                    </section>
                </div>
            </div>
            {addingTeam !== null && (
                <AddTeamModal
                    isOpen={!!addingTeam}
                    onClose={() => setAddingTeam(null)}
                    onSubmit={(teamName: RelayName) => {
                        handleAddTeam(addingTeam.heatNumber, addingTeam.laneNumber, teamName);
                        setAddingTeam(null);
                    }}
                />
            )}
        </>
    );
};

const AddTeamModal = ({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (teamName: RelayName) => void }) => {
    const teamNames: RelayName[] = [
        'terrific_tigers',
        'great_gazelles',
        'super_starfishes',
        'fast_falcons',
        'dancing_dolphins',
        'bright_bisons',
        'cheerful_cheetahs',
        'brave_bears',
        'lightning_leopards',
        'racing_ravens',
        'turbo_tucans',
        'rampaging_rhinos',
        'golden_geckos',
        'rapid_rabbits',
        'swift_swans',
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className={cn('bg-slate-900/10 backdrop-blur p-6 min-[450px]:p-8 fixed inset-0 z-70 grid place-items-center overflow-y-auto cursor-pointer')}
                >
                    <motion.div
                        initial={{ scale: 0, rotate: '12.5deg' }}
                        animate={{ scale: 1, rotate: '0deg' }}
                        exit={{ scale: 0, rotate: '0deg' }}
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                            'bg-background p-6 rounded-[18px] w-full max-w-xl shadow-xl cursor-default max-h-[93dvh] relative overflow-x-hidden overflow-y-auto! hide-scrollbar',
                        )}
                    >
                        <div className='flex justify-between items-center'>
                            <h2 className='text-[32px] leading-[1.1] font-semibold font-fredoka text-primary'>Update Team</h2>
                            <button onClick={onClose} className='absolute top-7 text-primary right-7 cursor-pointer'>
                                <X className='w-6 h-6' />
                            </button>
                        </div>
                        <div className='flex flex-col gap-2 mt-4'>
                            {teamNames.map((name) => (
                                <button
                                    onClick={() => onSubmit(name)}
                                    className='border font-fredoka cursor-pointer hover:bg-background-light border-primary rounded-[14px] px-4 py-2 w-full text-lg text-primary font-semibold'
                                >
                                    {name.replaceAll('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Heats;
