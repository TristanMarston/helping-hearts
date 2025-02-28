'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Fredoka, Sour_Gummy } from 'next/font/google';
import ActionBar from './ActionBar';
import FormattedView from './FormattedView';

const sourGummyBold = Sour_Gummy({ weight: '800', subsets: ['latin'] });
const fredokaLight = Fredoka({ weight: '400', subsets: ['latin'] });
const fredokaBold = Fredoka({ weight: '600', subsets: ['latin'] });

export type APIResponse = {
    data: any[];
    schema: any[];
};

const EditCollection = ({ collection }: { collection: string }) => {
    const [fetchState, setFetchState] = useState<'loading' | 'failed' | 'success'>('loading');
    const [response, setResponse] = useState<APIResponse>({ data: [], schema: [] });

    const fetchCollection = async () => {
        axios
            .get(`/api/admin/get/${collection}`)
            .then((res) => {
                if (res.status === 200) {
                    setFetchState('success');
                    console.log(res.data.schema);
                    setResponse({ data: res.data.data, schema: res.data.schema });
                } else setFetchState('failed');
            })
            .catch((err) => {
                setFetchState('failed');
            });
    };

    useEffect(() => {
        fetchCollection();
    }, []);

    return (
        <div className='mt-24 mid-mobile:mt-28 mb-8 w-full flex flex-col items-center gap-6 px-3 phone:px-6 max-w-[1400px]'>
            {fetchState === 'loading' ? (
                <div className='w-full h-screen flex justify-center items-center -mt-28'>
                    <div className='loader w-24 h-24'></div>
                </div>
            ) : fetchState === 'failed' ? (
                <h3 className={`${sourGummyBold.className} text-6xl`}>Something went wrong. Try refreshing?</h3>
            ) : (
                fetchState === 'success' && (
                    <div className='w-full flex flex-col gap-4'>
                        <section className=''>
                            <h1
                                className={`${sourGummyBold.className} text-black leading-none text-center text-3xl mid-mobile:text-4xl mid-tablet-small:text-left mid-phone-wide:text-5xl uppercase`}
                            >
                                {collection.toLowerCase().replaceAll('-', ' ').replaceAll('dpi', '').replaceAll('helping hearts', '').trim()}
                            </h1>
                            {/* <h3
                                className={`${sourGummyBold.className} text-base mt-3 max-w-[700px] text-center font-bold text-secondary tracking-wide`}
                            >
                                This is the {collection} collection, you may edit any of the fields below.
                            </h3> */}
                        </section>
                        <ActionBar collection={collection} response={response} setResponse={setResponse} />
                        <FormattedView response={response} />
                    </div>
                )
            )}
        </div>
    );
};

export default EditCollection;
