import Navbar from '@/_components/_navbar/Navbar';
import { Toaster } from 'react-hot-toast';
import AdminDashboard from './_components/AdminDashboard';

const page = () => {
    return (
        <>
            <Toaster />
            <div className='w-full h-fit flex flex-col items-center px-5'>
                <Navbar />
                <AdminDashboard />
            </div>
            {/* <Footer /> */}
        </>
    );
};

export default page;