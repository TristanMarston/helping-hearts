import { Jua, Nunito } from 'next/font/google';
import Image from 'next/image';
import ContactUs from './ContactUs';

const jua = Jua({ weight: '400', subsets: ['latin'] });
const nunito = Nunito({ weight: '800', subsets: ['latin'] });

const Footer = () => {
    return (
        <div className='flex flex-col items-center'>
            <div className='bg-primary-pink relative top-12 w-[80vw] min-w-[17rem] h-16 laptop:h-[15%] rounded-full shadow-lg flex items-center justify-center gap-32 px-10'>
                <h1 className={`${jua.className} text-white hidden laptop:block text-7xl`}>Volunteer Today!</h1>
                <div className='flex gap-3'>
                    <button
                        className={`${nunito.className} w-28 h-8 bg-white text-primary-pink rounded-full flex items-center gap-2 justify-center tracking-wide shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.25)]`}
                    >
                        Volunteer
                    </button>
                    <button
                        className={`${nunito.className} w-28 h-8 border border-white bg-primary-pink text-white rounded-full flex items-center gap-2 justify-center tracking-wide shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.1)]`}
                    >
                        Sign Up
                    </button>
                </div>
            </div>
            <img src='/helping-hearts-wave-footer.svg' className='w-full h-full relative top-1 -z-40' />
            <div className='bg-primary h-56 w-full flex flex-col flex-start items-start pt-10 px-5'>
                <ContactUs />
                <div className='flex items-center justify-center gap-[5px]'>
                    <Image src='/helping-hearts-logo-default-white.png' className='hidden tablet:block' alt='logo' width={54} height={34} />
                    <Image src='/helping-hearts-logo-default-white.png' className='mablet:block tablet:hidden' alt='logo' width={38} height={24} />
                    <h1 className={`${jua.className} tablet:text-4xl text-[1.625rem] text-background`}>helping hearts</h1>
                </div>
            </div>
        </div>
    );
};

export default Footer;
