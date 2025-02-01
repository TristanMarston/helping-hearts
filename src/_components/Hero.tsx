'use client';

import { Sour_Gummy, Fredoka } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

const sourGummyBold = Sour_Gummy({ weight: '800', subsets: ['latin'] });
const fredokaBold = Fredoka({ weight: '600', subsets: ['latin'] });
const fredokaLight = Fredoka({ weight: '400', subsets: ['latin'] });

const Hero = () => {
    return (
        <>
            <div className='w-full flex justify-center mt-16 mid-mobile:mt-20'>
                <div className='mt-8 tablet:mt-10 mx-6 flex justify-center flex-col mb-12 max-w-[1280px]'>
                    <div className='flex flex-col gap-2 two-column:grid two-column:grid-cols-2 two-column:grid-rows-1 two-column:gap-4'>
                        <HeartImages />
                        <div className='flex flex-col justify-normal gap-2 two-column:col-[1] two-column:row-[1]'>
                            <h1
                                className={`${sourGummyBold.className} max-w-[260px] text-4xl mobile:max-w-[300px] mobile:text-5xl mid-phone-wide:max-w-[400px] mid-phone-wide:text-6xl mid-tablet-small:max-w-none mid-tablet-small:text-[7vw] two-column:text-6xl two-column:max-w-[400px] text-center mx-auto leading-tight`}
                            >
                                let&apos;s help a heart today!
                            </h1>
                            <p className={`${fredokaLight.className} text-sm mobile:text-base mid-phone-wide:text-lg text-center mt-2 tracking-wide text-gray-700`}>
                                Helping Hearts is a nonprofit created by the DPHS Medical Club committed to spreading joy and supporting children&#39;s healthcare. Join us in making a
                                difference through our upcoming track & field event.
                            </p>
                            <HeroButtons />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const HeartImages = () => {
    return (
        <div className='relative w-full h-full two-column:col-[2] two-column:row-[1]'>
            {/* <div className='scale-[1.2] w-24 h-24 heart-clip overflow-hidden rotate-[-10deg]'> */}
            <section className='flex justify-center gap-2 items-center'>
                <div className='relative w-36 h-36 mobile:w-40 mobile:h-40 mid-phone:w-48 mid-phone:h-48 tablet:w-52 tablet:h-52 min-[1200px]:w-56 min-[1200px]:h-56 heart-image rotate-[-10deg] overflow-hidden bg-primary p-1.5 shadow-xl'>
                    <div className='relative w-full h-full heart-image'>
                        <img
                            src='/helping-hearts-hero2.png'
                            alt='Heart Image 1'
                            className='heart-shadow object-cover aspect-square transform scale-[1.7] pt-7 mobile:scale-[1.5] mobile:pt-6 mid-phone:scale-[1.5] mid-phone:pt-7'
                        />
                    </div>
                </div>
                <div className='relative w-36 h-36 mobile:w-40 mobile:h-40 mid-phone:w-48 mid-phone:h-48 tablet:w-52 tablet:h-52 min-[1200px]:w-56 min-[1200px]:h-56 heart-image rotate-[10deg] overflow-hidden bg-primary p-1.5 shadow-xl'>
                    <div className='relative w-full h-full heart-image'>
                        <img src='/helping-hearts-hero1.png' alt='Heart Image 1' className='heart-shadow object-cover aspect-square transform scale-[1.55] object-left' />
                    </div>
                </div>
            </section>
            <section className='flex w-full justify-center items-center'>
                <div className='relative w-36 h-36 mobile:w-40 mobile:h-40 mid-phone:w-48 mid-phone:h-48 tablet:w-52 tablet:h-52 min-[1200px]:w-56 min-[1200px]:h-56 heart-image rotate-[10deg] overflow-hidden bg-primary p-1.5 shadow-xl'>
                    <div className='relative w-full h-full heart-image'>
                        <img src='/helping-hearts-hero3.png' alt='Heart Image 1' className='heart-shadow object-cover aspect-square transform scale-[2.2] pb-10' />
                    </div>
                </div>
            </section>
            {/* </div> */}
        </div>
    );
};

const HeroButtons = () => {
    return (
        <section className='w-full grid place-items-center'>
            <div className='grid grid-cols-2 w-full max-w-xs justify-center items-center gap-3 mt-4'>
                <Link
                    href='/signup'
                    className={`${fredokaBold.className} text-base py-1.5 mid-phone-wide:text-lg transition-all bg-primary hover:bg-primary-light text-white rounded-xl flex items-center justify-center gap-2 tracking-wider shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.25)]`}
                >
                    Signup
                    <Image
                        src='/arrow-circle-right.svg'
                        alt='arrow right icon'
                        width={20}
                        height={20}
                        className='filter invert-[100%] sepia-[0%] saturate-[7500%] hue-rotate-[131deg] brightness-[105%] contrast-[105%]'
                    />
                </Link>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        const targetElement = document.getElementById('contact-us');
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                        }
                    }}
                    className={`${fredokaBold.className} text-base py-1.5 mid-phone-wide:text-lg transition-all bg-background hover:bg-background-secondary text-black rounded-xl flex items-center justify-center gap-2 tracking-wider shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.25)]`}
                >
                    Contact Us
                </button>
            </div>
        </section>
    );
};

export default Hero;
