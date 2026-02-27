'use client';

import { syncSpreadsheets } from '@/app/actions/admin';

import Link from 'next/link';
import toast from 'react-hot-toast';

type CollectionDisplay = {
    name: string;
    collectionName: string;
};

const AdminDashboard = () => {
    const collections: CollectionDisplay[] = [
        { name: 'youth participants', collectionName: 'dpi-youth-participants' },
        { name: 'community participants', collectionName: 'dpi-community-participants' },
        { name: 'volunteers', collectionName: 'helping-hearts-volunteers' },
        { name: 'messages', collectionName: 'messages' },
    ];

    const syncSpreadsheet = () => {
        const toastID = toast.loading('Syncing Spreadsheets...', {
            className: `font-fredoka font-semibold !bg-background !text-black`,
            position: 'top-center',
        });

        syncSpreadsheets()
            .then((res) => {
                if (res.success) {
                    toast.success('Successfully Synced Spreadsheets.', {
                        id: toastID,
                        duration: 4000,
                    });
                } else {
                    toast.error('Could not sync spreadsheets. Reload page.', {
                        id: toastID,
                        duration: 4000,
                    });
                }
            })
            .catch((err) => {
                toast.error('Could not sync spreadsheets. Reload page.', {
                    id: toastID,
                    duration: 4000,
                });
            });
    };

    return (
        <div className='w-full flex justify-center mt-16 mid-mobile:mt-20'>
            <div className='w-full max-w-[1000px] flex flex-col mx-6 my-8'>
                <h1 className={`font-sour-gummy font-extrabold text-black text-3xl mid-phone-wide:text-4xl mb-2`}>Administration Dashboard</h1>
                <section className='flex flex-col gap-4'>
                    <div
                        onClick={syncSpreadsheet}
                        className='w-full gap-12 rounded-xl bg-background-very-light border-2 border-primary shadow-[5px_5px_0px_0px_rgba(237,58,95)] flex flex-col justify-between p-4 transition-all hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] hover:bg-background-light cursor-pointer'
                    >
                        <h4 className={`font-fredoka font-semibold text-primary capitalize text-lg`}>Sync Spreadsheets</h4>
                        <p className={`font-fredoka font-semibold text-base text-primary-light uppercase`}>action</p>
                    </div>
                    <Link
                        href={`/admin/publish-youth-results`}
                        className='w-full gap-12 rounded-xl bg-background-very-light border-2 border-primary shadow-[5px_5px_0px_0px_rgba(237,58,95)] flex flex-col justify-between p-4 transition-all hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] hover:bg-background-light cursor-pointer'
                    >
                        <h4 className={`font-fredoka font-semibold text-primary capitalize text-lg`}>Publish Youth Results</h4>
                        <p className={`font-fredoka font-semibold text-base text-primary-light uppercase`}>interface</p>
                    </Link>
                    <Link
                        href={`/admin/publish-community-results`}
                        className='w-full gap-12 rounded-xl bg-background-very-light border-2 border-primary shadow-[5px_5px_0px_0px_rgba(237,58,95)] flex flex-col justify-between p-4 transition-all hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] hover:bg-background-light cursor-pointer'
                    >
                        <h4 className={`font-fredoka font-semibold text-primary capitalize text-lg`}>Publish Community Results</h4>
                        <p className={`font-fredoka font-semibold text-base text-primary-light uppercase`}>interface</p>
                    </Link>
                    {collections.map(({ name, collectionName }) => (
                        <Link
                            key={name}
                            href={`/admin/${collectionName}`}
                            className='w-full gap-12 rounded-xl bg-background-very-light border-2 border-primary shadow-[5px_5px_0px_0px_rgba(237,58,95)] flex flex-col justify-between p-4 transition-all hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] hover:bg-background-light cursor-pointer'
                        >
                            <h4 className={`font-fredoka font-semibold text-primary capitalize text-lg`}>{name}</h4>
                            <p className={`font-fredoka font-semibold text-base text-primary-light uppercase`}>collection</p>
                        </Link>
                    ))}
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
