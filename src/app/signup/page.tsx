import Footer from '@/_components/_footer/Footer';
import Navbar from '@/_components/_navbar/Navbar';
import { Toaster } from 'react-hot-toast';
import Signup from './_signup_components/Signup';

const page = () => {
    return (
        <>
            <Toaster />
            <div className='w-full h-fit flex flex-col items-center px-2.5 mid-phone:px-5'>
                <Navbar />
                <Signup />
            </div>
            <Footer showVolunteerAd={false} page='signup' />
        </>
    );
};

export default page;
