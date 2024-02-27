import AboutUs from '@/_components/AboutUs';
import Footer from '@/_components/Footer';
import Hero from '@/_components/Hero';
import Navbar from '@/_components/Navbar';
import Testimonial from '@/_components/Testimonial';
import { Toaster } from 'react-hot-toast';

const page = () => {
    return (
        <>
            <div className='min-h-full flex flex-col'>
                <Toaster />
                <Navbar />
                <Hero />
                {/* <AboutUs /> */}
                {/* <Testimonial /> */}
                <Footer showVolunteerAd={true} />
            </div>
        </>
    );
};

export default page;
