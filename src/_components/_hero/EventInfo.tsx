'use client';

import { Fredoka, Sour_Gummy } from 'next/font/google';
import Image from 'next/image';
import ShiftingCountdown from './ShiftingCountdown';

const sourGummyBold = Sour_Gummy({ weight: '800', subsets: ['latin'] });
const fredokaBold = Fredoka({ weight: '600', subsets: ['latin'] });
const fredokaLight = Fredoka({ weight: '400', subsets: ['latin'] });

const EventInfo = () => {
    // const isDatePast = new Date() > new Date('2025-03-01');
    const currentDate = new Date();
    const date: 'before' | 'event-day' | 'after' = currentDate > new Date(2025, 2, 2, 0, 0) ? 'after' : currentDate > new Date(2025, 2, 1, 6, 0) ? 'event-day' : 'before';

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
                {date === 'after' ? (
                    <>
                        <h2 className={`${sourGummyBold.className} text-3xl phone:text-4xl mid-column:text-5xl font-bold text-gray-900`}>On March 1st, 2025,</h2>
                        {/* <ShiftingCountdown /> */}
                        <div className='max-w-4xl flex flex-col items-center gap-2'>
                            <p className='text-sm mid-mobile:text-base tablet:text-lg text-gray-700'>
                                ...we brought the community together for a youth and community track event to raise money for <b>Cottage Children&apos;s Medical Center</b>! Working in
                                tandem with DPHS' Medical Club, we have hosted 2 other events just like it in the past two years and fostered a welcoming environment for young kids to
                                discover their interests in track &amp; field.
                            </p>
                            <Image
                                src='/helping-hearts-2024-home-photo.jpg'
                                alt='2024 Event Photo'
                                width={870}
                                height={397}
                                className='w-full my-3 h-auto rounded-[40px] shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
                            />
                            <p className='text-sm mid-mobile:text-base tablet:text-lg text-gray-700'>This year's event was a huge success! We had dozens of athletes go and compete, and they had a blast.</p>
                            <p className='text-sm mid-mobile:text-base tablet:text-lg text-gray-700'>
                                You can view all the results from the event{' '}
                                <a className='text-primary underline' href='/results'>
                                    here
                                </a>
                                .
                            </p>
                        </div>
                    </>
                ) : date === 'before' ? (
                    <>
                        <h2 className={`${sourGummyBold.className} text-3xl phone:text-4xl mid-column:text-5xl font-bold text-gray-900`}>In exactly...</h2>
                        <ShiftingCountdown />
                        <div className='max-w-4xl flex flex-col items-center gap-2'>
                            <p className='text-sm mid-mobile:text-base tablet:text-lg text-gray-700'>
                                ...we will bring the community together for a youth and community track event to raise money for <b>Cottage Children&apos;s Medical Center</b>! Working
                                in tandem with DPHS' Medical Club, we have hosted 2 events just like this in the past two years and fostered a welcoming environment for young kids to
                                discover their interests in track &amp; field.
                            </p>
                            <Image
                                src='/helping-hearts-2024-home-photo.jpg'
                                alt='2024 Event Photo'
                                width={870}
                                height={397}
                                className='w-full my-3 h-auto rounded-[40px] shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
                            />
                            <p className='text-sm mid-mobile:text-base tablet:text-lg text-gray-700'>
                                This year, we will also be hosting a community 1 mile race! <b>Anyone</b> is welcome to participate in this event, and we encourage everyone to come out
                                and race! We are also looking for volunteers, so please click the link below to sign up!
                            </p>
                            <p className='text-sm mid-mobile:text-base tablet:text-lg text-gray-700'>The order of events on the day is as follows:</p>
                            <OrderOfEvents />
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className={`${sourGummyBold.className} text-3xl phone:text-4xl mid-column:text-5xl font-bold text-gray-900`}>Today,</h2>
                        <div className='max-w-4xl flex flex-col items-center gap-2'>
                            <p className='text-sm mid-mobile:text-base tablet:text-lg text-gray-700'>
                                ...we will bring the community together for a youth and community track event to raise money for <b>Cottage Children&apos;s Medical Center</b>! Working
                                in tandem with DPHS' Medical Club, we have hosted 2 events just like this in the past two years and fostered a welcoming environment for young kids to
                                discover their interests in track &amp; field.
                            </p>
                            <Image
                                src='/helping-hearts-2024-home-photo.jpg'
                                alt='2024 Event Photo'
                                width={870}
                                height={397}
                                className='w-full my-3 h-auto rounded-[40px] shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
                            />
                            <p className='text-sm mid-mobile:text-base tablet:text-lg text-gray-700'>
                                Results will be uploaded live to the website as the event progresses. You can view the results{' '}
                                <a className='text-primary underline' href='/results'>
                                    here
                                </a>
                                .
                            </p>
                            <p className='text-sm mid-mobile:text-base tablet:text-lg text-gray-700'>The order of events on the day is as follows:</p>
                            <OrderOfEvents />
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

const OrderOfEvents = () => {
    const events: { time: string; description: string }[] = [
        { time: '7:00 AM', description: 'Registration opens' },
        { time: '7:45 AM', description: 'Warmup for community 1-mile race' },
        { time: '8:00 AM', description: 'Community 1 Mile' },
        { time: '8:15 AM', description: 'Youth athletes warm up' },
        { time: '8:30 AM', description: '1st Event - 100 meters' },
        { time: '8:50 AM', description: '2nd Event - 400 meters' },
        { time: '9:10 AM', description: '3rd Event - 800 meters' },
        { time: '9:25 AM', description: '4th Event - 1600 meters' },
        { time: '9:35 AM', description: '5th Event - softball throw' },
        { time: '9:55 AM', description: '6th Event - long jump' },
        { time: '10:15 AM', description: 'Event Concluded' },
    ];

    // 100 meters: 34
    // 400 meters: 35
    // 800 meters: 6
    // 1600 meters: 9
    // long jump: 33
    // long jump: 21

    return (
        <div className='w-full flex flex-col border border-gray-700 rounded-lg text-[13px] mid-mobile:text-[15px] tablet:text-[17px] mid-tablet:text-lg'>
            {events.map((event, i) => (
                <div key={event.time} className='grid grid-cols-2 place-items-center'>
                    <p
                        className={`${
                            i !== events.length - 1 ? 'border-b' : ''
                        } border-r border-gray-700 text-gray-700 w-full p-2 h-full grid place-items-center`}
                    >
                        {event.time}
                    </p>
                    <p
                        className={`${
                            i !== events.length - 1 ? 'border-b' : ''
                        } border-l border-gray-700 text-gray-700 w-full p-2 h-full grid place-items-center`}
                    >
                        {event.description}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default EventInfo;
