import Footer from '@/_components/_footer/Footer';
import EventInfo from '@/_components/_hero/EventInfo';
import Hero from '@/_components/_hero/Hero';
import Navbar from '@/_components/_navbar/Navbar';
import { Toaster } from 'react-hot-toast';

export type NavLink = {
    title: string;
    href: string;
    isDropdown: boolean;
    dropdownOptions?: NavLink[];
    description?: string;
};

const page = () => {
    return (
        <>
            {/* <div className='min-h-full flex flex-col'> */}
            <Toaster />
            <div className='w-full h-fit flex flex-col items-center px-5'>
                <Navbar />
                <Hero />
            </div>
            <EventInfo />
            <Footer showVolunteerAd={true} page='home' />
        </>
    );
};

export default page;
