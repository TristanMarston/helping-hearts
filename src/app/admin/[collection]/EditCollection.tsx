'use client';

import { getCollection } from '@/app/actions/admin';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import ActionBar from './ActionBar';
import FormattedView from './FormattedView';

export type APIResponse = {
    data: any[];
    schema: any[];
};

const EditCollection = ({ collection }: { collection: string }) => {
    const [fetchState, setFetchState] = useState<'loading' | 'failed' | 'success'>('loading');
    const [response, setResponse] = useState<APIResponse>({ data: [], schema: [] });

    const fetchCollection = async () => {
        const res = await getCollection(collection);
        console.log(res);
        if (res.success) {
            setFetchState('success');
            setResponse({ data: res.data || [], schema: res.schema || [] });
        } else setFetchState('failed');
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
                <h3 className={`font-sour-gummy font-extrabold text-6xl`}>Something went wrong. Try refreshing?</h3>
            ) : (
                fetchState === 'success' && (
                    <div className='w-full flex flex-col gap-4 max-w-[1240px]'>
                        <section className=''>
                            <h1
                                className={`font-sour-gummy font-extrabold text-black leading-none text-center text-3xl mid-mobile:text-4xl mid-tablet-small:text-left mid-phone-wide:text-5xl uppercase`}
                            >
                                {collection.toLowerCase().replaceAll('-', ' ').replaceAll('dpi', '').replaceAll('helping hearts', '').trim()}
                            </h1>
                        </section>
                        <ActionBar collection={collection} response={response} setResponse={setResponse} />
                        <FormattedView response={response} collection={collection} />
                    </div>
                )
            )}
        </div>
    );
};

export default EditCollection;
