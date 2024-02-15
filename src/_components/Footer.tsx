import { Jua, Nunito } from 'next/font/google';

const jua = Jua({ weight: '400', subsets: ['latin'] });
const nunito = Nunito({ weight: '800', subsets: ['latin'] });

const Footer = () => {
    return (
        <div className='flex flex-col items-center'>
            <img src='/helping-hearts-wave-footer.svg' className='w-full h-full' />
            <div className='bg-primary-pink absolute w-[80%] h-[15%] rounded-full shadow-lg flex items-center justify-center gap-32 px-10'>
                <h1 className={`${jua.className} text-white text-7xl`}>Volunteer Today!</h1>
                <div className='flex gap-3'>
                    <button
                        className={`${nunito.className} h-12 w-32 py-1 bg-white text-primary-pink rounded-full flex items-center gap-2 justify-center tracking-wide shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.25)]`}
                    >
                        Volunteer
                    </button>
                    <button
                        className={`${nunito.className} h-12 w-32 py-1 border border-white bg-primary-pink text-white rounded-full flex items-center gap-2 justify-center tracking-wide shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.1)]`}
                    >
                        Sign Up
                    </button>
                </div>
            </div>
            <div className='bg-primary h-56 w-full'></div>
        </div>
    );
};

export default Footer;
