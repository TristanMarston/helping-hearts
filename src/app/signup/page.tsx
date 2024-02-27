import Footer from '@/_components/Footer';
import Signup from './_components/Signup';
import Navbar from '@/_components/Navbar';
import { Toaster } from 'react-hot-toast';

const page = () => {
    return (
        <>
            <div className='min-h-full flex flex-col'>
                <Toaster />
                <Navbar />
                <Signup />
                <Footer showVolunteerAd={false} />
            </div>
        </>
    );
};

export default page;
