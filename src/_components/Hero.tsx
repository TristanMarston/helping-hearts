'use client';

import { CarouselDemo } from './Carousel';
import { Nunito, Jua, Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

const nunitoBold = Nunito({ weight: '800', subsets: ['latin'] });
const nunitoBlack = Nunito({ weight: '900', subsets: ['latin'] });
const nunitoLight = Nunito({ weight: '400', subsets: ['latin'] });
const inter = Inter({ weight: '700', subsets: ['latin'] });
const jua = Jua({ weight: '400', subsets: ['latin'] });

const Hero = () => {
    return (
        <>
            <div className='w-full flex justify-center'>
                <div className='mt-6 tablet:mt-8 mx-6 flex justify-center mb-12 max-w-[1280px]'>
                    {/* mobile/mablet */}
                    <div className='flex tablet:hidden flex-col gap-2'>
                        <h1 className={`${nunitoBlack.className} text-3xl min-[379px]:text-4xl mablet:text-[40px] text-center w-full`}>help a heart today!</h1>
                        <p className={`${nunitoLight.className} text-sm min-[379px]:text-base mablet:text-[17px] text-center mt-2`}>
                            Helping Hearts is a nonprofit committed to spreading joy and supporting children's healthcare. Join us in making a difference through our upcoming track &
                            field event.
                        </p>
                        <div className='flex justify-center gap-3 mt-3 mb-5'>
                            <HeroButtons />
                        </div>
                        <CarouselDemo />
                    </div>
                    {/* tablet */}
                    <div className='hidden tablet:flex flex-col laptop:hidden justify-center'>
                        <div className='grid grid-cols-[3fr_4fr] gap-5'>
                            <div>
                                <h1 className={`${nunitoBlack.className} text-3xl mablet:text-4xl text-center w-full`}>
                                    let's make a <br />
                                    heart happy!
                                </h1>
                                <div className='flex flex-col justify-start items-center'>
                                    <p className={`${nunitoLight.className} text-md my-4 flex text-center`}>
                                        Helping Hearts is a nonprofit committed to spreading joy and supporting children's healthcare. Join us in making a difference through our
                                        upcoming track & field event.
                                    </p>
                                    <div className='flex justify-center tablet:justify-start gap-3'>
                                        <HeroButtons />
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-center items-center'>
                                <CarouselDemo />
                            </div>
                        </div>
                    </div>
                    {/* laptop/desktop */}
                    <div className='hidden laptop:grid grid-cols-[6fr_7fr] desktop:grid-cols-[5fr_6fr] gap-5'>
                        <div>
                            <h1 className={`${nunitoBlack.className} text-[44px] leading-none text-center w-full block desktop:hidden`}>
                                let's make a <br />
                                heart happy!
                            </h1>
                            <h1 className={`${nunitoBlack.className} text-[44px] leading-none text-center w-full hidden desktop:block`}>
                                let's make a heart <br /> happy today!
                            </h1>
                            <div className='flex flex-col justify-start items-center'>
                                <p className={`${nunitoLight.className} text-md my-4 flex text-center`}>
                                    Helping Hearts is a nonprofit dedicated to spreading joy by supporting children's healthcare. Join us in our mission to make a difference through our
                                    upcoming track & field event, where every step counts towards brighter futures.
                                </p>
                                <div className='flex justify-center tablet:justify-start gap-3'>
                                    <HeroButtons />
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-center items-center'>
                            <CarouselDemo />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const HeroButtons = () => {
    return (
        <>
            <Link
                href='/signup?isVolunteer=false'
                className={`${nunitoBold.className} max-h-9 w-[8.375rem] px-3.5 py-1.5 transition-all bg-primary hover:bg-primary-light text-white rounded-xl flex items-center justify-center gap-2 tracking-wide shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.25)]`}
            >
                Sign Up
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
                className={`${nunitoBold.className} max-h-9 w-[8.375rem] px-5 py-1.5 transition-all bg-background hover:bg-background-secondary text-black rounded-xl flex items-center justify-center gap-2 tracking-wide shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.25)]`}
            >
                Contact Us
            </button>
        </>
    );
};

export default Hero;
