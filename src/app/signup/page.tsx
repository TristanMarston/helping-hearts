import AboutUs from '@/_components/AboutUs';
import Footer from '@/_components/_footer/Footer';
import Hero from '@/_components/Hero';
import Navbar from '@/_components/_navbar/Navbar';
import Testimonial from '@/_components/Testimonial';
import toast, { Toaster } from 'react-hot-toast';
import Signup from './_signup_components/Signup';
import { Fredoka } from 'next/font/google';

const fredokaBold = Fredoka({ weight: '600', subsets: ['latin'] });

export const toastMessage = (text: string, status: boolean, duration: number, toastId: any) => {
    if (status) {
        toast.success(text, {
            duration: duration,
            position: 'top-center',
            className: `${fredokaBold.className} text-white`,
            style: {
                background: '#FFFDF5',
            },
            id: toastId,
        });
    } else {
        toast.error(text, {
            duration: duration,
            position: 'top-center',
            className: `${fredokaBold.className} text-white`,
            style: {
                background: '#FFFDF5',
            },
            id: toastId,
        });
    }
};

const page = () => {
    return (
        <>
            <Toaster />
            <div className='w-full h-fit flex flex-col items-center px-5'>
                <Navbar />
                <Signup />
            </div>
            <Footer showVolunteerAd={true} />
        </>
    );
};

export default page;
