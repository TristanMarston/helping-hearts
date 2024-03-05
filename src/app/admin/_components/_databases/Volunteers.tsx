import { Skeleton } from '@/components/ui/skeleton';
import { Nunito } from 'next/font/google';
import { useState } from 'react';

const nunitoBold = Nunito({ weight: '800', subsets: ['latin'] });

type Volunteer = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    birthYear: string;
    birthMonth: string;
    birthDay: string;
    dateCreated: string;
};

const Volunteers = () => {
    const [hasFetched, setHasFetched] = useState<boolean>(false);
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    fetch(`${process.env.NEXT_PUBLIC_DB_HOST}/volunteers`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            setVolunteers(() => {
                setHasFetched(true);
                return [...data];
            });
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });

    const getAge = (birthYear: string, birthMonth: string, birthDay: string): number => {
        const today: Date = new Date();
        const birthDate: Date = new Date(`${birthMonth} ${birthDay}, ${birthYear}`);

        let age: number = today.getFullYear() - birthDate.getFullYear();
        const monthDifference: number = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className='mt-5'>
            {hasFetched ? (
                volunteers.length > 0 ? (
                    <div className='flex flex-col gap-3'>
                        {volunteers.map((data, index) => (
                            <div className='flex flex-col border rounded-lg w-full h-full p-4' key={data._id}>
                                <p>
                                    Name: {data.firstName} {data.lastName}
                                </p>
                                <p>Email: {data.email}</p>
                                <p>
                                    Birthday: {months.indexOf(data.birthMonth) + 1}/{data.birthDay}/{data.birthYear}
                                </p>
                                <p>Age: {getAge(data.birthYear, data.birthMonth, data.birthDay)}</p>
                                <p>Date Signed Up: {data.dateCreated}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <h1 className={`${nunitoBold.className} text-2xl`}>0 documents found. Try reloading?</h1>
                )
            ) : (
                <div className='flex flex-col gap-5'>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div className='flex flex-col space-y-3' key={index}>
                            <Skeleton className='h-[125px] w-full rounded-xl bg-background-secondary' />
                            <div className='space-y-2'>
                                <Skeleton className='h-4 w-[250px] bg-background-secondary' />
                                <Skeleton className='h-4 w-[200px] bg-background-secondary' />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Volunteers;
