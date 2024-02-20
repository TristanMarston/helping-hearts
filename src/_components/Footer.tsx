import { Jua, Nunito } from 'next/font/google';
import Image from 'next/image';
import ContactUs from './ContactUs';

const jua = Jua({ weight: '400', subsets: ['latin'] });
const nunito = Nunito({ weight: '800', subsets: ['latin'] });

type Props = {
    showVolunteerAd: boolean;
};

const Footer = (props: Props) => {
    return (
        <div className='flex flex-col items-center'>
            {props.showVolunteerAd && (
                <div className='bg-primary-pink relative top-12 taptop:top-16 w-[80vw] max-w-[1280px] min-w-[17rem] h-16 taptop:h-20 laptop:h-24 rounded-full shadow-lg flex items-center justify-center px-10 tablet:px-5 laptop:px-8'>
                    <h1 className={`${jua.className} text-white hidden tablet:block tablet:text-3xl taptop:text-5xl laptop:text-6xl w-full`}>Volunteer Today!</h1>
                    <div className='flex gap-3'>
                        <button
                            className={`${nunito.className} w-28 h-8 desktop:w-36 desktop:h-10 desktop:text-xl bg-white text-primary-pink rounded-full flex items-center gap-2 justify-center tracking-wide shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.25)]`}
                        >
                            Volunteer
                        </button>
                        <button
                            className={`${nunito.className} w-28 h-8 desktop:w-36 desktop:h-10 desktop:text-xl border border-white bg-primary-pink text-white rounded-full flex items-center gap-2 justify-center tracking-wide shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.1)]`}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            )}
            <div className='max-h-16 w-full'>
                <img src='/helping-hearts-wave-footer.svg' className='w-full max-h-[15rem] relative top-1 -z-40 object-contain' />
            </div>
            <div className='bg-primary h-full w-full flex flex-col items-center pt-10 px-5'>
                <ContactUs />
                <div className='w-full max-w-[1280px] flex'>
                    <div className='flex items-center justify-center gap-[5px]'>
                        <Image src='/helping-hearts-logo-default-white.png' className='hidden tablet:block' alt='logo' width={54} height={34} />
                        <Image src='/helping-hearts-logo-default-white.png' className='mablet:block tablet:hidden' alt='logo' width={38} height={24} />
                        <h1 className={`${jua.className} tablet:text-4xl text-[1.625rem] text-background`}>helping hearts</h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
