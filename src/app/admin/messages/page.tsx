'use client';

import Navbar from '@/_components/_navbar/Navbar';
import { Toaster } from 'react-hot-toast';
import EditCollection from '../_components/EditCollection';

const schema = [
    { key: 'name', type: 'string', required: false },
    { key: 'email', type: 'string', required: true },
    { key: 'subject', type: 'string', required: false },
    { key: 'message', type: 'string', required: true },
];

const page = () => {
    return (
        <>
            <Toaster />
            <div className='w-full h-fit flex flex-col items-center px-5'>
                <Navbar />
                <EditCollection collection='messages' schema={schema} />
            </div>
        </>
    );
};

export default page;
