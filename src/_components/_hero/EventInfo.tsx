import { Fredoka, Sour_Gummy } from 'next/font/google';
import Image from 'next/image';
import ShiftingCountdown from './ShiftingCountdown';

const sourGummyBold = Sour_Gummy({ weight: '800', subsets: ['latin'] });
const fredokaBold = Fredoka({ weight: '600', subsets: ['latin'] });
const fredokaLight = Fredoka({ weight: '400', subsets: ['latin'] });

const EventInfo = () => {
    return (
        <section className='relative w-full'>
            {/* Wave Image */}
            <div className='w-full overflow-hidden'>
                <Image
                    src='/helping-hearts-wave-hero.svg'
                    alt='Decorative wave divider'
                    width={1920} // Ensuring a large enough width for quality
                    height={200} // Adjust based on actual image height
                    className='w-full h-auto'
                    priority
                />
            </div>

            {/* Content Section */}
            <div className={`${fredokaLight.className} bg-background-light pt-6 px-8 pb-32 wide:pb-40 text-center flex flex-col items-center justify-center gap-4 phone:gap-6 w-full`}>
                <h2 className={`${sourGummyBold.className} text-3xl phone:text-4xl mid-column:text-5xl font-bold text-gray-900`}>In exactly...</h2>
                <ShiftingCountdown />
                <div className='max-w-4xl flex flex-col items-center gap-2'>
                    <p className='text-sm mid-mobile:text-base tablet:text-lg text-gray-700'>
                        ...we will bring the community together for a youth and community track event to raise money for <b>Cottage Children&apos;s Medical Center</b>! Working in tandem
                        with DPHS' Medical Club, we have hosted 2 events just like this in the past two years and fostered a welcoming environment for young kids to discover their
                        interests in track &amp; field.
                    </p>
                    <Image
                        src='/helping-hearts-2024-home-photo.jpg'
                        alt='2024 Event Photo'
                        width={870}
                        height={397}
                        className='w-full my-3 h-auto rounded-[40px] shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
                    />
                    <p className='text-sm mid-mobile:text-base tablet:text-lg text-gray-700'>
                        This year, we will also be hosting a community 1 mile race! <b>Anyone</b> is welcome to participate in this event, and we encourage everyone to come out and
                        race! We are also looking for volunteers, so please click the link below to sign up!
                    </p>
                    <p className='text-sm mid-mobile:text-base tablet:text-lg text-gray-700'>
                        The event will take place on <b>March 1st, 2025, at 7:30 A.M.</b> at the DPHS Track. Registration opens at 7:00 A.M., and the event will officially begin at 8:30
                        A.M., so we recommend that athletes arrive between 7:30 A.M. and 8:00 A.M. to warm up and prepare. We hope to see you there!
                    </p>
                </div>
            </div>
        </section>
    );
};

export default EventInfo;
