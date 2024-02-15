import { CarouselDemo } from './Carousel';
import { Nunito, Jua } from 'next/font/google';
import Image from 'next/image';

const nunitoBold = Nunito({ weight: '800', subsets: ['latin'] });
const nunitoLight = Nunito({ weight: '400', subsets: ['latin'] });
const jua = Jua({ weight: '400', subsets: ['latin'] });

const Hero = () => {
    return (
        <>
            <div className='mt-6 tablet:mt-8 mx-6 flex justify-center'>
                {/* mobile/mablet */}
                <div className='block tablet:hidden'>
                    <CarouselDemo />
                    <p className={`${nunitoLight.className} text-md mt-6 mb-4`}>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cupiditate, soluta. Eum architecto enim mollitia soluta
                    </p>
                    <div className='flex justify-center gap-3 mb-10'>
                        <HeroButtons />
                    </div>
                </div>
                {/* tablet */}
                <div className='hidden tablet:flex flex-col laptop:hidden justify-center mb-12'>
                    <div className='grid grid-cols-[3fr_4fr] gap-5'>
                        <h1 className={`${jua.className} text-5xl leading-[1.15] flex items-center justify-center`}>
                            santa barbara<br></br>helping hearts
                        </h1>
                        <div className='flex justify-center items-center'>
                            <CarouselDemo />
                        </div>
                    </div>
                    <div className='flex flex-col justify-start items-center'>
                        <p className={`${nunitoLight.className} text-md my-4 flex text-center`}>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cupiditate, soluta. Eum architecto enim mollitia soluta
                        </p>
                        <div className='flex justify-center tablet:justify-start gap-3'>
                            <HeroButtons />
                        </div>
                    </div>
                </div>
                {/* laptop/desktop */}
                <div className='hidden laptop:grid grid-cols-[2.5fr_3fr] grid-rows-1 gap-x-6 max-w-[1280px] mb-16'>
                    <div className='flex flex-col items-right'>
                        <h1 className={`${jua.className} text-4xl leading-[1.15] text-center`}>
                            santa barbara<br></br>helping hearts
                        </h1>
                        <p className={`${nunitoLight.className} text-md my-4 flex`}>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cupiditate, soluta. Eum architecto enim mollitia soluta
                        </p>
                        <div className='flex justify-center tablet:justify-start gap-3'>
                            <HeroButtons />
                        </div>
                    </div>
                    <div className='flex justify-center items-center'>
                        <CarouselDemo />
                    </div>
                </div>
            </div>
        </>
    );
};

export const HeroButtons = () => {
    return (
        <>
            <button
                className={`${nunitoBold.className} max-h-9 px-3.5 py-1.5 bg-primary text-white rounded-xl flex items-center gap-2 tracking-wide shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.25)]`}
            >
                Learn More
                <Image
                    src='/arrow-circle-right.svg'
                    alt='arrow right icon'
                    width={20}
                    height={20}
                    className='filter invert-[100%] sepia-[0%] saturate-[7500%] hue-rotate-[131deg] brightness-[105%] contrast-[105%]'
                />
            </button>
            <button
                className={`${nunitoBold.className} max-h-9 px-5 py-1.5 bg-background text-black rounded-xl flex items-center gap-2 tracking-wide shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.25)]`}
            >
                Support Us
            </button>
        </>
    );
};

export default Hero;
