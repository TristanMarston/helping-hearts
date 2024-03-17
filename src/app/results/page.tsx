'use client';

import Navbar from '@/_components/Navbar';
import { Toaster } from 'react-hot-toast';
import Results from './_components/Results';
import Footer from '@/_components/Footer';
import { MyProvider } from './context';

const Page = () => {
    return (
        <>
            <div className='min-h-full flex flex-col'>
                <MyProvider>
                    <Toaster />
                    <Navbar />
                    <Results />
                    <Footer showVolunteerAd={false} />
                </MyProvider>
            </div>
        </>
    );
};

export default Page;
