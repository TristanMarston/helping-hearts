'use client';

import { Suspense, useEffect, useState } from 'react';
import { motion } from 'motion/react';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import YouthSignUp from './_sections/YouthSignUp';
import CommunitySignUp from './_sections/CommunitySignUp';
import VolunteerSignUp from './_sections/VolunteerSignUp';

type SignUpView = 'youth' | 'community' | 'volunteer';

const Fallback = () => {
    return <div>placeholder</div>;
};

const SignupContent = () => {
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const [signUpView, setSignUpView] = useState<SignUpView>(type === 'youth' || type === 'volunteer' || type === 'community' ? type : 'youth');

    useEffect(() => {
        const type = searchParams.get('type');
        if (type !== 'youth' && type !== 'volunteer' && type !== 'community') return;
        setSignUpView(type || 'youth');
    }, [searchParams]);

    return (
        <Suspense fallback={<Fallback />}>
            <div className={`font-fredoka font-normal flex flex-col gap-3`}>
                <p className='text-lg'>
                    {signUpView === 'youth' ? (
                        <span>
                            You are currently signing up for the <b>youth race.</b>
                        </span>
                    ) : signUpView === 'community' ? (
                        <span>
                            You are currently signing up for the <b>community race.</b>
                        </span>
                    ) : (
                        <span>
                            You are currently signing up to be a <b>volunteer.</b>
                        </span>
                    )}
                </p>
                <div className='pl-5 text-base'>
                    {signUpView === 'youth' ? (
                        <ul className='list-disc flex flex-col gap-2 text-[17px]'>
                            <li>The youth race is for children in 8th grade and below.</li>
                            <li>Please enter the information about your child below.</li>
                            <li>To sign up multiple kids at once, press the plus button below and enter their details.</li>
                            <li>
                                <strong className='tracking-wide'>Cost: $10 per participant.</strong> Please bring money in cash to the event.
                            </li>
                        </ul>
                    ) : signUpView === 'community' ? (
                        <ul className='list-disc flex flex-col gap-2 text-[17px]'>
                            <li>Anyone can take part in the community race!</li>
                            <li>It is a 1-mile race on the track.</li>
                            <li>Please enter the information about yourself below.</li>
                            <li>
                                <strong className='tracking-wide'>Cost: $10 to participate.</strong> Please bring money in cash to the event.
                            </li>
                        </ul>
                    ) : (
                        <ul className='list-disc flex flex-col gap-2 text-[17px]'>
                            <li>Volunteer jobs include timing, teaching kids how to compete, pacing kids in their races, raking long jump pits, tracking results, and more.</li>
                            <li>Jobs will be assigned in the days leading up to the event and on the day of the event.</li>
                            <li>Volunteering is free and greatly appreciated!</li>
                            <li>We will provide community service forms for DPHS students wishing to earn hours (you can earn 3-4 hours!).</li>
                        </ul>
                    )}
                </div>
                {signUpView === 'youth' ? (
                    <p className='text-[17px]'>
                        Registration will take place on <time dateTime='2026-03-15'>March 15th, 2026</time> at 8:00 AM at the <b>DPHS Track</b>. See the <Link href='/#order-of-events' className='font-semibold text-primary underline hover:text-primary-light transition-colors'>Order of Events</Link> for more details.
                    </p>
                ) : signUpView === 'community' ? (
                    <p className='text-[17px]'>
                        Registration will take place on <time dateTime='2026-03-15'>March 15th, 2026</time> at 7:30 AM at the <b>DPHS Track</b>. See the <Link href='/#order-of-events' className='font-semibold text-primary underline hover:text-primary-light transition-colors'>Order of Events</Link> for more details.
                    </p>
                ) : (
                    <p className='text-[17px]'>
                        We need volunteers to arrive on <time dateTime='2026-03-15'>March 15th, 2026</time> by 7:30 AM at the <b>DPHS Track</b>. See the <Link href='/#order-of-events' className='font-semibold text-primary underline hover:text-primary-light transition-colors'>Order of Events</Link> for more details on timing.
                    </p>
                )}
            </div>
            <div className='w-full rounded-full flex mt-4 bg-background shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] p-1'>
                {(['youth', 'community', 'volunteer'] as SignUpView[]).map((tab) => (
                    <Link
                        key={tab}
                        className={`relative flex-1 font-fredoka font-semibold rounded-full flex justify-center items-center text-sm mid-mobile:text-base p-1.5 transition-colors duration-300 z-10 transition-all ${
                            signUpView === tab ? 'text-white' : 'text-primary hover:text-primary-dark hover:bg-background-secondary'
                        }`}
                        onClick={() => setSignUpView(tab)}
                        href={`/signup?type=${tab}`}
                    >
                        {signUpView === tab && (
                            <motion.div layoutId='activeTab' className='absolute inset-0 bg-primary rounded-full -z-10' transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                        )}
                        <span className='capitalize'>{tab}</span>
                    </Link>
                ))}
            </div>

            {signUpView === 'youth' ? <YouthSignUp /> : signUpView === 'community' ? <CommunitySignUp /> : signUpView === 'volunteer' && <VolunteerSignUp />}
        </Suspense>
    );
};

const Signup = () => {
    return (
        <div className='w-full flex justify-center mt-16 mid-mobile:mt-20'>
            <div className='w-full max-w-[1280px] flex flex-col mx-6 my-8 min-[1320px]:px-5'>
                <h1 className={`font-sour-gummy font-extrabold text-black text-4xl mb-2`}>Register Today!</h1>
                <Suspense fallback={<Fallback />}>
                    <SignupContent />
                </Suspense>
            </div>
        </div>
    );
};

export default Signup;
