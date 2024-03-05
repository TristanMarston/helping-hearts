'use client';

import Navbar from '@/_components/Navbar';
import Authentication from './_components/Authentication';
import { Toaster } from 'react-hot-toast';
import { useState, createContext } from 'react';
import Admin from './_components/Admin';

type Context = {
    signedIn: boolean;
    setSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AuthenticationContext = createContext<undefined | Context>(undefined);

const page = () => {
    const [signedIn, setSignedIn] = useState<boolean>(false);

    return (
        <>
            <div className='min-h-full flex flex-col'>
                <AuthenticationContext.Provider value={{ signedIn, setSignedIn }}>
                    <Toaster />
                    <Navbar />
                    {signedIn ? <Admin /> : <Authentication />}
                </AuthenticationContext.Provider>
            </div>
        </>
    );
};

export default page;
