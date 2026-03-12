'use client';

import Navbar from '@/_components/_navbar/Navbar';
import { Toaster } from 'react-hot-toast';
import EditCollection from '../_components/EditCollection';

const schema = [
    { key: 'name', type: 'string', required: true },
    { key: 'email', type: 'string', required: true },
    { key: 'dphsStudent', type: 'boolean', required: true },
    { key: 'dob', type: 'date', required: true },
];

const page = () => {
    return (
        <>
            <Toaster />
            <div className='w-full h-fit flex flex-col items-center px-5'>
                <Navbar />
                <EditCollection collection='volunteers' schema={schema} />
            </div>
        </>
    );
};

export default page;
