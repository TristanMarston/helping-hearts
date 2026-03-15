import Navbar from '@/_components/_navbar/Navbar';
import { Toaster } from 'react-hot-toast';
import Heats from './Heats';



const page = () => {
    return (
        <>
            <Toaster />
            <div className='w-full h-full flex flex-col items-center px-5'>
                <Navbar />
                <Heats />
            </div>
        </>
    );
};

export default page;
