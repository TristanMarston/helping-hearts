'use client';

import Navbar from '@/_components/_navbar/Navbar';
import { Toaster } from 'react-hot-toast';
import EditCollection from './EditCollection';
import * as React from 'react';
import { useParams } from 'next/navigation';

const page = () => {
    const params = useParams<{ collection: string }>;

    return (
        <>
            <Toaster />
            <div className='w-full h-fit flex flex-col items-center px-5'>
                <Navbar />
                <EditCollection collection={params().collection} />
            </div>
        </>
    );
};

export default page;
