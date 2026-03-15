'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Pencil, PlusCircle, Search, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import toast from 'react-hot-toast';
import { editAthlete, markPaidWithBib } from '@/app/actions/admin';
import { Collection } from './EditCollection';
import { parseUTCToLocal } from '@/lib/date-utils';
import { cn } from '@/lib/utils';

const FormattedView = ({ data, schema, collection, setData }: { data: any[]; schema: any[]; collection: Collection; setData: React.Dispatch<React.SetStateAction<any[]>> }) => {
    const [filteredData, setFilteredData] = useState(data);
    const [assignBibModal, setAssignBibModal] = useState<any | null>(null);
    const [query, setQuery] = useState('');
    const [bibNumberSearch, setBibNumberSearch] = useState('');
    const [editAthlete, setEditAthlete] = useState<any | null>(null);

    useEffect(() => {
        if (bibNumberSearch.trim() === '' && schema.filter((key) => key.key === 'name').length === 1) {
            if (query.trim() === '') {
                setFilteredData(data);
            } else {
                setFilteredData(data.filter((athlete: any) => athlete.name.toLowerCase().includes(query.toLowerCase())));
            }
        }

        if (query.trim() === '' && schema.filter((key) => key.key === 'bibNumber').length === 1) {
            if (bibNumberSearch.trim() === '') {
                setFilteredData(data);
            } else {
                setFilteredData(data.filter((athlete: any) => athlete.bibNumber && athlete.bibNumber.toString() === bibNumberSearch.trim()));
            }
        }

        if (bibNumberSearch.trim() === '' && query.trim() === '') setFilteredData(data);
    }, [query, bibNumberSearch, data]);

    // const markAsPaid = async (type: 'unpaid' | 'paid' | 'island_foxes', id: string) => {
    //     if (collection !== 'youth-athletes' && collection !== 'community-athletes') return;
    //     const toastID = toast.loading('Marking Payment...', {
    //         className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
    //         position: 'top-center',
    //     });
    //     if (id === '') {
    //         toast.error('No ID Passed; Reload Page.', {
    //             id: toastID,
    //             duration: 4000,
    //         });
    //         return;
    //     }
    //     const res = await markPaid(collection, id, type);
    //     if (res.success) {
    //         toast.success('Successfully marked payment!', {
    //             id: toastID,
    //             duration: 4000,
    //         });

    //         setData((prev) => prev.map((athlete) => (athlete.id === id ? { ...athlete, paid: type } : { ...athlete })));
    //     } else {
    //         toast.error('Could not mark payment. Reload page.', {
    //             id: toastID,
    //             duration: 4000,
    //         });
    //     }
    // };

    return (
        <>
            <div className={collection === 'messages' ? 'mt-2' : ''}>
                {(collection === 'youth-athletes' || collection === 'community-athletes' || collection === 'volunteers') && (
                    <>
                        <span className={cn(`font-fredoka font-normal flex relative mt-4`, bibNumberSearch.trim() !== '' ? 'opacity-50 cursor-not-allowed' : '')}>
                            <input
                                placeholder={'Name'}
                                value={query}
                                disabled={bibNumberSearch.trim() !== ''}
                                onChange={(e) => setQuery(e.target.value)}
                                className={`placeholder:text-gray-500 outline-none w-full bg-background text-secondary pl-10 pr-2 py-2 rounded-[14px] border border-gray-100 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                            />
                            <Search className={cn('absolute left-3 top-3 opacity-80 w-5 h-5', query.length > 0 ? 'text-black' : 'text-gray-500')} />
                        </span>
                        {collection !== 'volunteers' && (
                            <span className={cn(`font-fredoka font-normal flex relative mt-2`, query.trim() !== '' ? 'opacity-50 cursor-not-allowed' : '')}>
                                <input
                                    placeholder={'Bib #'}
                                    value={bibNumberSearch}
                                    disabled={query.trim() !== ''}
                                    onChange={(e) => setBibNumberSearch(e.target.value)}
                                    className={`placeholder:text-gray-500 outline-none w-full bg-background text-secondary pl-10 pr-2 py-2 rounded-[14px] border border-gray-100 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                                />
                                <Search className={cn('absolute left-3 top-3 opacity-80 w-5 h-5', bibNumberSearch.length > 0 ? 'text-black' : 'text-gray-500')} />
                            </span>
                        )}
                        <hr className='my-3 text-gray-200' />
                    </>
                )}
                <section className='flex flex-col gap-4'>
                    {filteredData.map((obj, index) => (
                        <div
                            key={obj.id || index}
                            className={`font-fredoka font-normal relative w-full flex flex-col gap-0.5 text-sm p-3 mobile:text-base mobile:p-4 mid-phone-wide:text-lg border border-gray-100 rounded-[18px] shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                        >
                            <div className='absolute flex gap-2 right-4 top-4'>
                                {(collection === 'youth-athletes' || collection === 'community-athletes') && (
                                    <div
                                        onClick={() => setEditAthlete(obj)}
                                        className='bg-background-light min-h-11 px-4 py-2 text-primary flex items-center justify-center rounded-[14px] shadow-[0_4px_30px_rgba(0,0,0,.2)] cursor-pointer uppercase hover:scale-105 transition-all'
                                    >
                                        <Pencil className='w-5 h-5 text-primary' strokeWidth={2.5} />
                                    </div>
                                )}
                                {(collection === 'youth-athletes' || collection === 'community-athletes') && obj.paid === 'unpaid' && (
                                    <>
                                        <div
                                            onClick={() => {
                                                // markAsPaid(obj.paid === 'paid' ? 'unpaid' : 'paid', obj.id);
                                                setAssignBibModal({ ...obj, regularPayment: true });
                                            }}
                                            className='bg-background-light py-2 px-4 text-primary font-bold rounded-[14px] shadow-[0_4px_30px_rgba(0,0,0,.2)] cursor-pointer uppercase hover:scale-105 transition-all'
                                        >
                                            PAID
                                        </div>
                                        <div
                                            onClick={() => {
                                                // markAsPaid('island_foxes', obj.id);
                                                setAssignBibModal({ ...obj, regularPayment: false });
                                            }}
                                            className='bg-background-light py-2 px-4 text-primary font-bold rounded-[14px] shadow-[0_4px_30px_rgba(0,0,0,.2)] cursor-pointer uppercase hover:scale-105 transition-all'
                                        >
                                            ISLAND FOXES
                                        </div>
                                    </>
                                )}
                            </div>
                            {obj.id && (
                                <div>
                                    <span className={'font-fredoka font-medium'}>id: </span>
                                    <span className='text-primary'>{obj.id}</span>
                                </div>
                            )}
                            {schema.map(
                                ({ key, type, required }) =>
                                    ((obj[key] !== undefined && obj[key] !== null) || required) &&
                                    (typeof type === 'object' || type === 'array' ? (
                                        <NestedObject key={key} objKey={key} type={type} required={required} obj={obj} />
                                    ) : (
                                        <RegularObject key={key} objKey={key} type={type} required={required} obj={obj} />
                                    )),
                            )}
                            {obj.createdAt && (
                                <div>
                                    <span className={'font-fredoka font-medium'}>createdAt: </span>
                                    <span className='text-blue-400'>
                                        {new Date(obj.createdAt).toLocaleString('en-US', {
                                            year: '2-digit',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                            hour12: true,
                                        })}
                                    </span>
                                </div>
                            )}
                            {obj.updatedAt && (
                                <div>
                                    <span className={'font-fredoka font-medium'}>updatedAt: </span>
                                    <span className='text-blue-400'>
                                        {new Date(obj.updatedAt).toLocaleString('en-US', {
                                            year: '2-digit',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                            hour12: true,
                                        })}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </section>
            </div>
            <AnimatePresence>
                {assignBibModal && collection !== 'volunteers' && collection !== 'messages' && (
                    <AssignBibModal
                        key='assign-bib'
                        athlete={assignBibModal}
                        isOpen={assignBibModal}
                        onClose={() => setAssignBibModal(null)}
                        regularPayment={assignBibModal.regularPayment}
                        collection={collection}
                        setData={setData}
                    />
                )}
                {editAthlete && collection !== 'volunteers' && collection !== 'messages' && (
                    <EditAthleteModal key='edit-athlete' athlete={editAthlete} isOpen={editAthlete} onClose={() => setEditAthlete(null)} collection={collection} setData={setData} />
                )}
            </AnimatePresence>
        </>
    );
};

const EditAthleteModal = ({
    athlete,
    isOpen,
    onClose,
    collection,
    setData,
}: {
    athlete: any;
    isOpen: boolean;
    onClose: () => void;
    collection: 'youth-athletes' | 'community-athletes';
    setData: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
    const [bib, setBib] = useState<string>(athlete.bibNumber ? athlete.bibNumber.toString() : '');
    const [events, setEvents] = useState<string[]>(athlete.events || []);
    const allEvents = ['1600 meters', '400 meters', '100 meters', '4x100 meter relay', 'long jump', 'shot put', 'softball throw'];

    const handleSubmit = async () => {
        const toastID = toast.loading('Making changes...', {
            className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
            position: 'top-center',
        });

        const sendBib = bib !== athlete.bibNumber && bib !== '' ? parseInt(bib) : null;
        let removingEvents: string[] | null = null;
        let addingEvents: string[] | null = null;
        if (collection === 'youth-athletes' && athlete.events) {
            removingEvents = athlete.events.filter((e: string) => !events.includes(e));
            addingEvents = events.filter((e: string) => !athlete.events.includes(e));
        }

        const res = await editAthlete(collection, athlete.id, sendBib, removingEvents, addingEvents);
        if (res.success) {
            toast.success('Successfully updated athlete!', {
                id: toastID,
                duration: 6000,
            });

            window.location.reload();
            onClose();
        } else {
            toast.error(res.error, {
                id: toastID,
                duration: 6000,
            });
        }
    };

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
                            <h2 className='text-[40px] leading-[1.1] font-semibold font-fredoka text-primary'>Edit Athlete</h2>
                            <button onClick={onClose} className='absolute top-6 right-6 cursor-pointer'>
                                <X className='w-6 h-6' />
                            </button>
                        </div>
                        <p className='text-left font-fredoka mt-1 text-gray-500 text-lg mb-6'>Edit the bib #{collection === 'youth-athletes' ? ' or events' : ''}.</p>
                        <span className='font-fredoka font-semibold text-primary text-lg mb-2'>BIB NUMBER</span>
                        <input
                            type='text'
                            value={bib}
                            onChange={(e) => setBib(e.target.value.replace(/^[^0-9]*$/, ''))}
                            placeholder='000'
                            className='font-fredoka font-normal px-4 py-2 w-full h-11 text-lg bg-background appearance-none rounded-[10px] border border-gray-100 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] focus:outline-none focus:ring-0 focus:border-primary-light peer transition-all'
                        />
                        {collection === 'youth-athletes' && athlete.events !== null && athlete.events.length > 0 && (
                            <div className='grid grid-cols-2 gap-x-4 mt-4'>
                                <div>
                                    <span className='font-fredoka font-semibold text-primary text-lg'>SELECTED EVENTS</span>
                                    <div className='flex flex-col gap-2 mt-2'>
                                        {events.map((event: string) => (
                                            <div
                                                key={event + 'already-selected'}
                                                className='rounded-[10px] flex justify-between items-center px-3 py-2 text-gray-700 font-fredoka border border-gray-100 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'
                                            >
                                                <span>{event}</span>
                                                <Trash2
                                                    onClick={() => {
                                                        setEvents((prev) => prev.filter((e) => e !== event));
                                                    }}
                                                    className='text-red-500 w-5 h-5 cursor-pointer hover:text-red-400 transition-all'
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <span className='font-fredoka font-semibold text-primary text-lg'>AVAILABLE EVENTS</span>
                                    <div className='flex flex-col gap-2 mt-2'>
                                        {allEvents
                                            .filter((eventName) => !events.includes(eventName))
                                            .map((event: string) => (
                                                <div
                                                    key={event + 'available'}
                                                    onClick={() => {
                                                        setEvents((prev) => [...prev, event]);
                                                    }}
                                                    className={cn(
                                                        'rounded-[10px] flex justify-between items-center px-3 py-2 text-gray-700 font-fredoka border border-gray-100 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]',
                                                        (event === 'shot put' && events.includes('softball throw')) || (event === 'softball throw' && events.includes('shot put'))
                                                            ? 'opacity-50 pointer-events-none'
                                                            : '',
                                                    )}
                                                >
                                                    <span>{event}</span>
                                                    <PlusCircle className='text-green-500 w-5 h-5 cursor-pointer hover:text-green-400 transition-all' />
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className='w-full flex justify-center mt-8'>
                            <button
                                onClick={handleSubmit}
                                className='font-fredoka cursor-pointer font-semibold bg-primary text-white text-xl shadow-md shadow-primary-dark rounded-[18px] py-2 px-24 hover:brightness-[1.1] transition-all'
                            >
                                Submit Changes
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const AssignBibModal = ({
    athlete,
    isOpen,
    onClose,
    regularPayment,
    collection,
    setData,
}: {
    athlete: any;
    isOpen: boolean;
    onClose: () => void;
    regularPayment: boolean;
    collection: 'youth-athletes' | 'community-athletes';
    setData: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
    const [bib, setBib] = useState<string>('');

    const handleSubmit = async () => {
        const toastID = toast.loading('Marking Payment...', {
            className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
            position: 'top-center',
        });
        if (!athlete || !athlete.id) {
            toast.error('No ID Passed; Reload Page.', {
                id: toastID,
                duration: 6000,
            });
            return;
        }

        if (bib.length === 0) {
            toast.error('No bib written.', {
                id: toastID,
                duration: 6000,
            });
        }
        const res = await markPaidWithBib(collection, athlete.id, regularPayment ? 'paid' : 'island_foxes', parseInt(bib));
        if (res.success) {
            toast.success('Successfully marked payment!', {
                id: toastID,
                duration: 6000,
            });

            onClose();
            setData((prev) => prev.map((a) => (a.id === athlete.id ? { ...a, paid: regularPayment ? 'paid' : 'island_foxes', bibNumber: parseInt(bib) } : { ...a })));
        } else {
            toast.error(res.error, {
                id: toastID,
                duration: 6000,
            });
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn('bg-slate-900/10 backdrop-blur p-6 min-[450px]:p-8 fixed inset-0 z-70 grid place-items-center overflow-y-auto')}
                >
                    <motion.div
                        initial={{ scale: 0, rotate: '12.5deg' }}
                        animate={{ scale: 1, rotate: '0deg' }}
                        exit={{ scale: 0, rotate: '0deg' }}
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                            'bg-background p-6 rounded-[18px] w-full max-w-lg shadow-xl cursor-default max-h-[93dvh] relative overflow-x-hidden overflow-y-auto! hide-scrollbar',
                        )}
                    >
                        <h2 className='text-[40px] leading-[1.1] font-semibold font-fredoka text-primary'>Assign Bib</h2>
                        <p className='text-left font-fredoka mt-1 text-gray-500 text-lg mb-6'>Don&apos;t worry about leading zeroes!</p>
                        <input
                            type='text'
                            value={bib}
                            onChange={(e) => setBib(e.target.value.replace(/^[^0-9]*$/, ''))}
                            placeholder='000'
                            className='w-full px-8 py-12 text-[88px] border border-gray-300 rounded-[14px] transition-all leading-[1.1] font-nunito font-black tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent flex items-center justify-center'
                        />
                        <div className='w-full flex justify-center mt-8'>
                            <button
                                onClick={handleSubmit}
                                className='font-fredoka cursor-pointer font-semibold bg-primary text-white text-xl shadow-md shadow-primary-dark rounded-[18px] py-2 px-24 hover:brightness-[1.1] transition-all'
                            >
                                Mark as {regularPayment ? 'Paid' : 'Island Foxes'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const RegularObject = ({ objKey, type, required, obj }: { objKey: string; type: string; required: boolean; obj: any }) => {
    let value = obj[objKey];
    let objectEmpty = value === null || value === undefined || value.toString().trim().length === 0;

    if (objKey === 'payment' && objectEmpty) {
        value = 'not paid';
        objectEmpty = false;
    }

    return objectEmpty && !required ? (
        <></>
    ) : (
        <div>
            <span className={'font-fredoka font-medium text-black'}>{objKey}: </span>
            <span
                className={`${!value ? 'text-gray-400' : type === 'string' ? 'text-green-600' : type === 'number' ? 'text-purple-500' : type === 'boolean' ? 'text-orange-400' : type === 'date' ? 'text-teal-600' : 'text-black'}`}
            >
                {type === 'string' && `"`}
                {type === 'date'
                    ? parseUTCToLocal(new Date(value)).toLocaleString('en-US', {
                          year: '2-digit',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true,
                      })
                    : typeof value === 'string'
                      ? value.replaceAll('_', ' ')
                      : value
                        ? value.toString()
                        : 'null'}
                {type === 'string' && `"`}
            </span>
        </div>
    );
};

const NestedObject = ({ objKey, type: schema, required, obj }: { objKey: string; type: string | any[]; required: boolean; obj: any }) => {
    const [open, setOpen] = useState(false);
    const values = obj[objKey];
    // const [openObjects, setOpenObjects] = useState<boolean[]>(Array.isArray(values) ? values.map(() => false) : []);

    return (
        <div className={`${open ? 'items-start' : 'items-center'} flex gap-2`}>
            <span className={'font-fredoka font-medium'}>{objKey}: </span>
            {Array.isArray(schema) && !Array.isArray(values) ? (
                <span className='flex flex-col text-amber-600'>
                    <div className='flex items-center gap-2'>
                        <motion.span
                            initial={{ rotate: 0 }}
                            animate={{ rotate: open ? 90 : 0 }}
                            onClick={() => setOpen((prev) => !prev)}
                            className='flex h-full items-center cursor-pointer'
                        >
                            <ChevronRight className='w-4 h-4 mobile:w-5 mobile:h-5 mid-phone-wide:w-6 mid-phone-wide:h-6' />
                        </motion.span>
                        {open ? (
                            <span className='flex flex-col'>
                                <span>{`{`}</span>
                            </span>
                        ) : (
                            <span className=''>{`{...}`}</span>
                        )}
                    </div>
                    {open && (
                        <div className='flex flex-col ml-8 mobile:ml-13'>
                            <span className='text-amber-600'>
                                {schema.map(
                                    ({ key, type, required }) =>
                                        ((values[key] !== undefined && values[key] !== null) || required) &&
                                        (type === 'object' || type === 'array' ? (
                                            <NestedObject key={key} objKey={key} type={type} required={required} obj={values} />
                                        ) : (
                                            <RegularObject key={key} objKey={key} type={type} required={required} obj={values} />
                                        )),
                                )}
                            </span>
                        </div>
                    )}
                    {open && <span className='ml-6 mobile:ml-7 mid-phone-wide:ml-8'>{`}`}</span>}
                </span>
            ) : (
                <span className='flex flex-col text-amber-600'>
                    <div className='flex items-center gap-2'>
                        <motion.span
                            initial={{ rotate: 0 }}
                            animate={{ rotate: open ? 90 : 0 }}
                            onClick={() => setOpen((prev) => !prev)}
                            className='flex h-full items-center cursor-pointer'
                        >
                            <ChevronRight className='w-4 h-4 mobile:w-5 mobile:h-5 mid-phone-wide:w-6 mid-phone-wide:h-6' />
                        </motion.span>
                        {open ? (
                            <span className='flex flex-col'>
                                <span>{`[`}</span>
                            </span>
                        ) : (
                            <span className=''>{`[...]`}</span>
                        )}
                    </div>
                    {open && (
                        <div className='flex flex-col ml-8 mobile:ml-[52px]'>
                            {values.map((val: string, index: number) => (
                                <span key={val + index} className='text-green-600 flex gap-2 items-start'>
                                    {`"`}
                                    {val}
                                    {`"`}
                                    {index !== values.length - 1 ? ',' : ''}
                                </span>
                            ))}
                        </div>
                    )}
                    {open && <span className='ml-6 mobile:ml-7 mid-phone-wide:ml-8'>{`]`}</span>}
                </span>
            )}
        </div>
    );
};

export default FormattedView;
