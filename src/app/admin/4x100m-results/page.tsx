import Navbar from '@/_components/_navbar/Navbar';
import { Toaster } from 'react-hot-toast';
import Results from './4x100Results';

const page = () => {
    return (
        <>
            <Toaster />
            <div className='w-full h-full flex flex-col items-center px-5'>
                <Navbar />
                <Results />
            </div>
        </>
    );
};

export default page;
