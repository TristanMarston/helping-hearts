import AboutUs from '@/_components/AboutUs';
import Footer from '@/_components/_footer/Footer';
import Hero from '@/_components/Hero';
import Navbar from '@/_components/_navbar/Navbar';
import Testimonial from '@/_components/Testimonial';
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
            {/*     <AboutUs />*/}
                <Footer showVolunteerAd={true} /> 
            {/* </div> */}
        </>
    );
};

export default page;
