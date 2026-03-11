'use client';

import Navbar from '@/_components/_navbar/Navbar';
import { Toaster } from 'react-hot-toast';
import EditCollection from '../_components/EditCollection';

/*
id            String   @id @default(uuid())
    name          String
    email         String
    dob           DateTime
    year          Int      @default(2026)
    raceId        String?  @unique
    race          Event?   @relation(fields: [raceId], references: [id], onDelete: Cascade)
*/

const schema = [
    { key: 'name', type: 'string', required: true },
    { key: 'email', type: 'string', required: true },
    { key: 'year', type: 'number', required: true },
    { key: 'dob', type: 'date', required: true },
    // {
    //     key: 'race',
    //     type: [
    //         { key: 'name', type: 'string', required: true },
    //         { key: 'performance', type: 'string', required: true },
    //         { key: 'unit', type: 'string', required: true },
    //         { key: 'year', type: 'number', required: true },
    //     ],
    //     required: true,
    // },
];

const page = () => {
    return (
        <>
            <Toaster />
            <div className='w-full h-fit flex flex-col items-center px-5'>
                <Navbar />
                <EditCollection collection='community-athletes' schema={schema} />
            </div>
        </>
    );
};

export default page;
