'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import { markPaid } from '@/app/actions/admin';
import { Collection } from './EditCollection';
import { parseUTCToLocal } from '@/lib/date-utils';
import { cn } from '@/lib/utils';

const FormattedView = ({ data, schema, collection, setData }: { data: any[]; schema: any[]; collection: Collection; setData: React.Dispatch<React.SetStateAction<any[]>> }) => {
    const [filteredData, setFilteredData] = useState(data);
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (schema.filter((key) => key.key === 'name').length === 1) {
            if (query.trim() === '') {
                setFilteredData(data);
            } else {
                setFilteredData(data.filter((athlete: any) => athlete.name.toLowerCase().includes(query.toLowerCase())));
            }
        }
    }, [query, data]);

    const markAsPaid = async (type: 'unpaid' | 'paid' | 'island_foxes', id: string) => {
        if (collection !== 'youth-athletes' && collection !== 'community-athletes') return;
        const toastID = toast.loading('Marking Payment...', {
            className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
            position: 'top-center',
        });
        if (id === '') {
            toast.error('No ID Passed; Reload Page.', {
                id: toastID,
                duration: 4000,
            });
            return;
        }
        const res = await markPaid(collection, id, type);
        if (res.success) {
            toast.success('Successfully marked payment!', {
                id: toastID,
                duration: 4000,
            });

            setData((prev) => prev.map((athlete) => (athlete.id === id ? { ...athlete, paid: type } : { ...athlete })));
        } else {
            toast.error('Could not mark payment. Reload page.', {
                id: toastID,
                duration: 4000,
            });
        }
    };

    return (
        <div className={collection === 'messages' ? 'mt-2' : ''}>
            {(collection === 'youth-athletes' || collection === 'community-athletes' || collection === 'volunteers') && (
                <>
                    <span className={`font-fredoka font-normal flex relative mt-4`}>
                        <input
                            placeholder={'Name'}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className={`placeholder:text-gray-500 mb-3 outline-none w-full bg-background text-secondary pl-10 pr-2 py-2 rounded-[14px] border border-gray-100 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                        />
                        <Search className={cn('absolute left-3 top-3 opacity-80 w-5 h-5', query.length > 0 ? 'text-black' : 'text-gray-500')} />
                    </span>
                    <hr className='mb-3 text-gray-200' />
                </>
            )}
            <section className='flex flex-col gap-4'>
                {filteredData.map((obj, index) => (
                    <div
                        key={obj.id || index}
                        className={`font-fredoka font-normal relative w-full flex flex-col gap-0.5 text-sm p-3 mobile:text-base mobile:p-4 mid-phone-wide:text-lg border border-gray-100 rounded-[18px] shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                    >
                        {(collection === 'youth-athletes' || collection === 'community-athletes') && (
                            <div className='absolute flex gap-2 right-4 top-4'>
                                <div
                                    onClick={() => markAsPaid(obj.paid === 'paid' ? 'unpaid' : 'paid', obj.id)}
                                    className='bg-background-light py-2 px-4 text-primary font-bold rounded-[14px] shadow-[0_4px_30px_rgba(0,0,0,.2)] cursor-pointer uppercase hover:scale-105 transition-all'
                                >
                                    {obj.paid === 'paid' ? 'UNPAID' : 'PAID'}
                                </div>
                                <div
                                    onClick={() => markAsPaid('island_foxes', obj.id)}
                                    className='bg-background-light py-2 px-4 text-primary font-bold rounded-[14px] shadow-[0_4px_30px_rgba(0,0,0,.2)] cursor-pointer uppercase hover:scale-105 transition-all'
                                >
                                    ISLAND FOXES
                                </div>
                            </div>
                        )}
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
                className={`${type === 'string' ? 'text-green-600' : type === 'number' ? 'text-purple-500' : type === 'boolean' ? 'text-orange-400' : type === 'date' ? 'text-teal-600' : 'text-black'}`}
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
                      : value.toString()}
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
