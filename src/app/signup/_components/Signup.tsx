'use client';

import { Suspense, useEffect, useLayoutEffect, useState } from 'react';
import { Jua, Nunito } from 'next/font/google';
import ParticipantSignUp from './ParticipantSignUp';
import VolunteerSignUp from './VolunteerSignUp';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const jua = Jua({ weight: '400', subsets: ['latin'] });
const nunitoLight = Nunito({ weight: '400', subsets: ['latin'] });
const nunitoBold = Nunito({ weight: '800', subsets: ['latin'] });

function Fallback() {
    return <div>placeholder</div>;
}

const Signup = () => {
    const searchParams = useSearchParams();
    const isVolunteer = searchParams.get('isVolunteer');
    const [showVolunteer, setShowVolunteer] = useState(isVolunteer == 'true');

    useEffect(() => {
        const isVolunteer = searchParams.get('isVolunteer');
        setShowVolunteer(isVolunteer == 'true');
    }, [searchParams]);

    return (
        <div className='w-full flex justify-center'>
            <div className='w-full max-w-[1280px] flex flex-col mx-6 my-8'>
                <h1 className={`${jua.className} text-4xl`}>Register Today!</h1>
                <Suspense fallback={<Fallback />}>
                    <div className={`${nunitoLight.className} flex flex-col gap-1 mt-1`}>
                        <p>
                            You are currently signing up {showVolunteer ? 'as a' : 'for a'} <b>{showVolunteer ? 'volunteer' : 'participant'}</b>.
                        </p>
                        <p>
                            {showVolunteer
                                ? 'Please enter the following information about yourself to volunteer.'
                                : 'Please enter the following information for the child participant(s) and corresponding emergency contact information (parent or guardian).'}
                        </p>
                    </div>
                    <div className='w-full h-10 rounded-full grid grid-cols-2 mt-4 bg-background shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
                        <Link
                            className={`${nunitoBold.className} ${showVolunteer ? 'bg-background text-black' : 'bg-primary text-white'} rounded-full flex justify-center items-center`}
                            onClick={() => setShowVolunteer((prev) => !prev)}
                            href='/signup?isVolunteer=false'
                        >
                            Participant(s)
                        </Link>
                        <Link
                            className={`${nunitoBold.className} ${!showVolunteer ? 'bg-background text-black' : 'bg-primary text-white'} rounded-full flex justify-center items-center`}
                            onClick={() => setShowVolunteer((prev) => !prev)}
                            href='/signup?isVolunteer=true'
                        >
                            Volunteer
                        </Link>
                    </div>
                    {!showVolunteer ? <ParticipantSignUp /> : <VolunteerSignUp />}
                </Suspense>
            </div>
        </div>
    );
};

export default Signup;
