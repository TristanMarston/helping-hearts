'use client';

import { Jua, Nunito } from 'next/font/google';
import ShiftingCountdown from '@/components/ui/countdown';

const jua = Jua({ weight: '400', subsets: ['latin'] });
const nunitoBlack = Nunito({ weight: '900', subsets: ['latin'] });
const nunitoLight = Nunito({ weight: '400', subsets: ['latin'] });

const AboutUs = () => {
    return (
        <>
            <div className='bg-background-light'>
                <img src='/helping-hearts-wave-hero-3.svg' className='w-full h-full' />
                <div className='bg-background-light w-full h-full flex items-start justify-center py-5'>
                    <div className='max-w-[1280px] mx-6'>
                        {/* <h1 className={`${jua.className} text-center text-4xl`}>about us</h1> */}
                        <div className='w-full h-full flex flex-col justify-center items-center'>
                            <h1 className={`${nunitoBlack.className} text-2xl tablet:text-3xl text-center`}>Sign up for our track meet today to support us!</h1>
                            <h3 className={`${nunitoLight.className} tablet:text-lg`}>Starts at 8:00 A.M. on March 16th, 2024.</h3>
                            <div className='mt-5 w-full'>
                                <h2 className={`${jua.className} text-center text-xl tablet:text-2xl mb-2`}>time until we help hearts</h2>
                                <ShiftingCountdown />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <img src='/helping-hearts-wave-aboutus.svg' className='w-full h-full' />
        </>
    );
};

export default AboutUs;
