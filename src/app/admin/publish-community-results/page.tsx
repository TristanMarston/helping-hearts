import Navbar from '@/_components/_navbar/Navbar';
import { Toaster } from 'react-hot-toast';
import PublishResultsScreen from './_components/CommunityPublishResultsScreen';

const page = () => {
    return (
        <>
            <Toaster />
            <div className='w-full h-full flex flex-col items-center px-5'>
                <Navbar />
                <PublishResultsScreen />
            </div>
        </>
    );
};

export default page;
