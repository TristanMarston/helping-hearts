'use client';

import { Suspense, useEffect, useLayoutEffect, useState } from 'react';
import { Fredoka, Jua, Nunito, Sour_Gummy } from 'next/font/google';
// import ParticipantSignUp from './ParticipantSignUp';
// import VolunteerSignUp from './VolunteerSignUp';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import YouthSignUp from './_sections/YouthSignUp';
import SubmitModal from './SubmitModal';
import CommunitySignUp from './_sections/CommunitySignUp';
import VolunteerSignUp from './_sections/VolunteerSignUp';

const sourGummyBold = Sour_Gummy({ weight: '800', subsets: ['latin'] });
const sourGummySemibold = Sour_Gummy({ weight: '700', subsets: ['latin'] });
const fredokaBold = Fredoka({ weight: '600', subsets: ['latin'] });
const fredokaLight = Fredoka({ weight: '400', subsets: ['latin'] });

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

    const handleSubmit = () => {};

    return (
        <Suspense fallback={<Fallback />}>
            <div className={`${fredokaLight.className} flex flex-col gap-1`}>
                <p>
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
                <p>
                    {signUpView === 'youth'
                        ? 'Please enter the following information about your child to sign up. The youth race is for children in 8th grade and below. If you would like to sign up multiple kids at once, press the plus button below and type in the information for the other child. Please note that it costs $10 for each participant to take part.'
                        : signUpView === 'community'
                        ? 'Please enter the following information about yourself to sign up. Anyone can take part in the community race! It costs $10 to take part in this 1 mile race.'
                        : 'Please enter the following information to sign up as a volunteer.'}
                </p>
                <p>
                    The event will take place on <time dateTime='2025-03-01'>March 1st, 2025</time> at 8:30 AM at the <b>DPHS Track</b>.
                </p>
            </div>
            <div className='w-full rounded-full grid grid-cols-3 mt-4 bg-background shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
                <Link
                    className={`${fredokaBold.className} ${
                        signUpView === 'youth' ? 'bg-primary text-white' : ' bg-background text-primary hover:bg-background-secondary'
                    } rounded-full flex justify-center items-center text-sm mid-mobile:text-base p-1.5`}
                    onClick={() => setSignUpView('youth')}
                    href='/signup?type=youth'
                >
                    Youth
                </Link>
                <Link
                    className={`${fredokaBold.className} ${
                        signUpView === 'community' ? 'bg-primary text-white' : ' bg-background text-primary hover:bg-background-secondary'
                    } rounded-full flex justify-center items-center text-sm mid-mobile:text-base p-1.5`}
                    onClick={() => setSignUpView('community')}
                    href='/signup?type=community'
                >
                    Community
                </Link>
                <Link
                    className={`${fredokaBold.className} ${
                        signUpView === 'volunteer' ? 'bg-primary text-white' : ' bg-background text-primary hover:bg-background-secondary'
                    } rounded-full flex justify-center items-center text-sm mid-mobile:text-base p-1.5`}
                    onClick={() => setSignUpView('volunteer')}
                    href='/signup?type=volunteer'
                >
                    Volunteer
                </Link>
            </div>
            
            {signUpView === 'youth' ? <YouthSignUp /> : signUpView === 'community' ? <CommunitySignUp /> : signUpView === 'volunteer' && <VolunteerSignUp />}
        </Suspense>
    );
};

const Signup = () => {
    return (
        <div className='w-full flex justify-center mt-16 mid-mobile:mt-20'>
            <div className='w-full max-w-[1280px] flex flex-col mx-6 my-8'>
                <h1 className={`${sourGummyBold.className} text-black text-4xl mb-2`}>Register Today!</h1>
                <Suspense fallback={<Fallback />}>
                    <SignupContent />
                </Suspense>
            </div>
        </div>
    );
};

export default Signup;
