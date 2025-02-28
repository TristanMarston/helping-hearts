import { Fredoka } from 'next/font/google';
import { APIResponse } from './EditCollection';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const fredokaSemibold = Fredoka({ weight: '500', subsets: ['latin'] });
const fredokaLight = Fredoka({ weight: '400', subsets: ['latin'] });

const FormattedView = ({ response }: { response: APIResponse }) => {
    const { data, schema } = response;

    return (
        <div className='mt-2'>
            <section className='flex flex-col gap-4'>
                {data.map((obj, index) => (
                    <div
                        key={obj._id || index}
                        className={`${fredokaLight.className} w-full flex flex-col gap-0.5 text-sm p-3 mobile:text-base mobile:p-4 mid-phone-wide:text-lg border rounded-lg shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                    >
                        {obj._id && (
                            <div>
                                <span className={fredokaSemibold.className}>id: </span>
                                <span className='text-primary'>{obj._id}</span>
                            </div>
                        )}
                        {schema.map(
                            ({ key, type, required }) =>
                                ((obj[key] !== undefined && obj[key] !== null) || required) &&
                                (type === 'object' || type === 'array' ? (
                                    <NestedObject key={key} objKey={key} type={type} required={required} obj={obj} />
                                ) : (
                                    <RegularObject key={key} objKey={key} type={type} required={required} obj={obj} />
                                ))
                        )}
                        {obj.createdAt && (
                            <div>
                                <span className={fredokaSemibold.className}>createdAt: </span>
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
                                <span className={fredokaSemibold.className}>updatedAt: </span>
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
    const value = obj[objKey];
    const objectEmpty = value.toString().trim().length === 0 || value === null || value === undefined;

    return objectEmpty && !required ? (
        <></>
    ) : (
        <div>
            <span className={fredokaSemibold.className}>{objKey}: </span>
            <span className={`${type === 'string' ? 'text-green-600' : type === 'number' ? 'text-purple-500' : type === 'boolean' ? 'text-orange-400' : 'text-black'}`}>
                {type === 'string' && `"`}
                {value}
                {type === 'string' && `"`}
            </span>
        </div>
    );
};

const NestedObject = ({ objKey, type, required, obj }: { objKey: string; type: string; required: boolean; obj: any }) => {
    const [open, setOpen] = useState(false);
    const value = obj[objKey];

    return (
        <div className={`${open ? 'items-start' : 'items-center'} flex gap-2`}>
            <span className={fredokaSemibold.className}>{objKey}: </span>
            {type === 'array' && (
                <span className='flex flex-col text-teal-600'>
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
                        <div className='flex flex-col ml-10 mobile:ml-[52px]'>
                            {value.map((val: string, index: number) => (
                                <span key={val + index} className='text-green-600'>
                                    "{val}"{index !== value.length - 1 ? ',' : ''}
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
