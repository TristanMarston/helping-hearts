import AboutUs from '@/_components/AboutUs';
import Footer from '@/_components/Footer';
import Hero from '@/_components/Hero';
import Navbar from '@/_components/Navbar';
import Testimonial from '@/_components/Testimonial';
import { Toaster } from 'react-hot-toast';

const page = () => {
    // const [users, setUsers] = useState<User[]>([]);

    // useEffect(() => {
    //     fetch('http://localhost:8000/users?page=1')
    //         .then((response) => response.json())
    //         .then((data) => {
    //             console.log(data);
    //             setUsers(data);
    //         });
    // }, []);

    return (
        <>
            <div className='min-h-full flex flex-col'>
                <Toaster />
                <Navbar />
                <Hero />
                <AboutUs />
                <Testimonial />
                <Footer showVolunteerAd={true} />
            </div>
        </>
    );
};

export default page;
