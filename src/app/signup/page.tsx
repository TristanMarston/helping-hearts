import Footer from '@/_components/Footer';
import Signup from './_components/Signup';
import Navbar from '@/_components/Navbar';
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
                <Signup />
                <Footer showVolunteerAd={false} />
            </div>
        </>
    );
};

export default page;
