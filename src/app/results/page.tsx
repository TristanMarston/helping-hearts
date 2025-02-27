import Footer from '@/_components/_footer/Footer';
import Navbar from '@/_components/_navbar/Navbar';
import { Toaster } from 'react-hot-toast';
import ResultsHome from './ResultsHome';

const page = () => {
    return (
        <>
            <Toaster />
            <div className='w-full h-fit flex flex-col items-center px-2.5 mid-phone:px-5'>
                <Navbar />
                <ResultsHome />
            </div>
            <Footer showVolunteerAd={false} page='signup' />
        </>
    );
};

export default page;
