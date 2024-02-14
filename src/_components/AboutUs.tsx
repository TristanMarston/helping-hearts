import { Jua } from 'next/font/google';

const jua = Jua({ weight: '400', subsets: ['latin'] });

const AboutUs = () => {
    return (
        <>
            <img src='/helping-hearts-wave-hero.svg' className='w-full h-full' />
            <div className='bg-background-light w-full h-96'>
                <h1 className={`${jua.className} text-center text-4xl`}>about us</h1>
            </div>
            <img src='/helping-hearts-wave-aboutus.svg' className='w-full h-full' />
        </>
    );
};

export default AboutUs;
