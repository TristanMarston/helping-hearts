import AboutUs from '@/_components/AboutUs';
import Footer from '@/_components/Footer';
import Hero from '@/_components/Hero';
import Navbar from '@/_components/Navbar';
import Testimonial from '@/_components/Testimonial';

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
                <Navbar />
                <Hero />
                <AboutUs />
                <Testimonial />
                <Footer />
            </div>
        </>
    );
};

export default page;
