'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

const UpdateBibModal = ({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (bib: number) => void }) => {
    const [bib, setBib] = useState('');

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
                            <h2 className='text-[32px] leading-[1.1] font-semibold font-fredoka text-primary'>Update Bib #</h2>
                            <button onClick={onClose} className='absolute top-7 text-primary right-7 cursor-pointer'>
                                <X className='w-6 h-6' />
                            </button>
                        </div>
                        <span
                            className={cn(
                                'w-full mt-4 px-8 py-4 text-[88px] border border-gray-300 rounded-[14px] transition-all leading-[1.1] font-nunito font-black tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent flex items-center justify-center',
                                bib === '' ? 'text-gray-500' : 'text-black',
                            )}
                        >
                            {bib === '' ? '000' : bib}
                        </span>
                        <div className='grid grid-cols-3 grid-rows-4 gap-2 mt-6'>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((num, index) =>
                                index === 9 ? (
                                    <div key={num}></div>
                                ) : index === 11 ? (
                                    <button
                                        key={num}
                                        onClick={() => setBib(bib.slice(0, -1))}
                                        className='font-fredoka cursor-pointer font-semibold bg-white text-primary text-xl shadow-md shadow-primary-dark rounded-[18px] py-2 px-2 w-full hover:bg-background-light transition-all'
                                    >
                                        -
                                    </button>
                                ) : (
                                    <button
                                        key={num}
                                        onClick={() => setBib(bib + (index > 8 ? 0 : num).toString())}
                                        className='font-fredoka cursor-pointer font-semibold bg-primary text-white text-xl shadow-md shadow-primary-dark rounded-[18px] py-2 px-2 w-full hover:brightness-[1.1] transition-all'
                                    >
                                        {index > 8 ? 0 : num}
                                    </button>
                                ),
                            )}
                        </div>
                        <hr className='my-8 text-gray-200' />
                        <div className='w-full flex justify-center'>
                            <button
                                onClick={() => onSubmit(parseInt(bib))}
                                className='font-fredoka cursor-pointer font-semibold bg-primary text-white text-xl shadow-md shadow-primary-dark rounded-[18px] py-2 px-2 w-full hover:brightness-[1.1] transition-all'
                            >
                                Update Bib #
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UpdateBibModal;
