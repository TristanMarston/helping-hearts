import { Fredoka } from 'next/font/google';
import { APIResponse } from './EditCollection';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const fredokaBold = Fredoka({ weight: '600', subsets: ['latin'] });
const fredokaSemibold = Fredoka({ weight: '500', subsets: ['latin'] });
const fredokaLight = Fredoka({ weight: '400', subsets: ['latin'] });

const FormattedView = ({ response, collection }: { response: APIResponse; collection: string }) => {
    const { data, schema } = response;
    const [filteredData, setFilteredData] = useState(data);
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (schema.filter((key) => key.key === 'firstName' || key.key === 'lastName').length === 2) {
            if (query.trim() === '') {
                setFilteredData(data);
            } else {
                setFilteredData(data.filter((athlete) => `${athlete.firstName} ${athlete.lastName}`.toLowerCase().includes(query.toLowerCase())));
            }
        }
    }, [query, data]);

    const markAsPaid = (type: 'paid' | 'island foxes', id: string) => {
        if (collection !== 'dpi-youth-participants' && collection !== 'dpi-community-participants') return;

        const toastID = toast.loading('Marking Payment...', {
            className: `${fredokaBold.className} !bg-background !text-black`,
            position: 'top-center',
        });

        if (id === '') {
            toast.error('No ID Passed; Reload Page.', {
                id: toastID,
                duration: 4000,
            });

            return;
        }

        const sendData = {
            paymentStatus: type,
        };

        console.log(sendData);

        axios
            .post(
                `/api/admin/${collection === 'dpi-youth-participants' ? 'mark-paid-youth' : collection === 'dpi-community-participants' ? 'mark-paid-community' : ''}/${id}`,
                JSON.stringify(sendData)
            )
            .then((res) => {
                if (res.status === 200) {
                    toast.success('Successfully Marked Payment.', {
                        id: toastID,
                        duration: 4000,
                    });
                }
            })
            .catch((err) => {
                toast.error('Could not mark payment. Reload page.', {
                    id: toastID,
                    duration: 4000,
                });
            });
    };

    return (
        <div className={collection === 'dpi-youth-participants' || collection === 'dpi-community-participants' ? '' : 'mt-2'}>
            {(collection === 'dpi-youth-participants' || collection === 'dpi-community-participants') && (
                <span className={`${fredokaLight.className} flex relative mt-4`}>
                    <input
                        placeholder={'Name'}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className={`placeholder:text-gray-500 mb-4 outline-none w-full bg-background text-secondary pl-10 pr-2 py-2 rounded-xl border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                    />
                    <Search className='absolute left-3 top-3 opacity-80 w-5 h-5' />
                </span>
            )}
            <section className='flex flex-col gap-4'>
                {filteredData.map((obj, index) => (
                    <div
                        key={obj._id || index}
                        className={`${fredokaLight.className} relative w-full flex flex-col gap-0.5 text-sm p-3 mobile:text-base mobile:p-4 mid-phone-wide:text-lg border rounded-lg shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                    >
                        {(collection === 'dpi-youth-participants' || collection === 'dpi-community-participants') && (
                            <div className='absolute flex gap-2 right-4 top-4'>
                                <div
                                    onClick={() => markAsPaid('paid', obj._id)}
                                    className='bg-background-light p-2 text-primary font-bold rounded-xl shadow-[0_4px_30px_rgba(0,0,0,.2)] cursor-pointer uppercase hover:scale-105 transition-all'
                                >
                                    PAID
                                </div>
                                <div
                                    onClick={() => markAsPaid('island foxes', obj._id)}
                                    className='bg-background-light p-2 text-primary font-bold rounded-xl shadow-[0_4px_30px_rgba(0,0,0,.2)] cursor-pointer uppercase hover:scale-105 transition-all'
                                >
                                    ISLAND FOXES
                                </div>
                            </div>
                        )}
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
