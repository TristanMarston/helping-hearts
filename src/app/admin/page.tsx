'use client';

import Navbar from '@/_components/Navbar';
import Authentication from './_components/Authentication';
import { Toaster } from 'react-hot-toast';
import Admin from './_components/Admin';
import { useAuthenticationContext, MyProvider } from './context';

const Page = () => {
    return (
        <>
            <div className='min-h-full flex flex-col'>
                <MyProvider>
                    <Toaster />
                    <Navbar />
                    {/* {signedIn ? <Admin /> : <Authentication />} */}
                    <AuthenticationOrAdmin />
                </MyProvider>
            </div>
        </>
    );
};

const AuthenticationOrAdmin = () => {
    const context = useAuthenticationContext();
    if (context === undefined) {
        throw new Error('useContext(AuthenticationContext) must be used within a AuthenticationContext.Provider');
    }
    const { signedIn } = context;

    return signedIn ? <Admin /> : <Authentication />;
};

export default Page;
