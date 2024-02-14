import Image from 'next/image';
import { Jua, Nunito } from 'next/font/google';
import DropDownMenu from './DropDownMenu';
import Drawer from './Drawer';

const jua = Jua({ weight: '400', subsets: ['latin'] });
const nunito = Nunito({ weight: '800', subsets: ['latin'] });

const Navbar = () => {
    const linkClasses = 'hover:text-primary-dark transition-all ease-in-out duration-300 font-medium';

    return (
        <div className='z-50 bg-background sticky top-0 flex items-center w-full tablet:h-[3.75rem] h-[3.125rem] shadow-md justify-between px-3.5'>
            <div className='flex items-center justify-center gap-[5px]'>
                <Image src='/helping-hearts-logo-default.png' className='hidden tablet:block' alt='logo' width={54} height={34} />
                <Image src='/helping-hearts-logo-default.png' className='mablet:block tablet:hidden' alt='logo' width={38} height={24} />
                <h1 className={`${jua.className} tablet:text-4xl text-[1.625rem] text-primary font-black`}>helping hearts</h1>
            </div>
            {/* laptop/desktop view */}
            <div className='gap-10 mr-2.5 hidden laptop:flex'>
                <button className={linkClasses}>Donate</button>
                <button className={linkClasses}>Volunteer</button>
                <button className={linkClasses}>About Us</button>
                <button className={linkClasses}>Our Mission</button>
                <button
                    className={`${nunito.className} tablet:px-5 mablet:px-4 py-1.5 bg-primary text-white rounded-[10px] tablet:text-base hover:bg-primary-light transition-all tracking-wide`}
                >
                    Sign up
                </button>
            </div>
            {/* tablet/mablet view */}
            <div className='tablet:gap-10 mablet:gap-6 mr-2.5 hidden mablet:flex laptop:hidden'>
                <DropDownMenu title='Support Us' />
                <button
                    className={`${nunito.className} tablet:px-5 mablet:px-4 py-1.5 bg-primary text-white rounded-[10px] mablet:text-sm tablet:text-base hover:bg-primary-light transition-all tracking-wide`}
                >
                    Sign up
                </button>
            </div>
            {/* mobile view */}
            <div className='flex mablet:hidden'>
                <Drawer />
            </div>
        </div>
    );
};

export default Navbar;
