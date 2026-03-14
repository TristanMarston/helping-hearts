'use client';

import Navbar from '@/_components/_navbar/Navbar';
import { Toaster } from 'react-hot-toast';
import EditCollection from '../_components/EditCollection';

const schema = [
    { key: 'name', type: 'string', required: true },
    { key: 'grade', type: 'string', required: true },
    { key: 'year', type: 'number', required: true },
    { key: 'dob', type: 'date', required: true },
    { key: 'paid', type: 'string', required: true },
    { key: 'bibNumber', type: 'number', required: true },
    { key: 'events', type: 'array', required: true },
];

const page = () => {
    return (
        <>
            <Toaster />
            <div className='w-full h-fit flex flex-col items-center px-5'>
                <Navbar />
                <EditCollection collection='youth-athletes' schema={schema} />
            </div>
        </>
    );
};

export default page;
