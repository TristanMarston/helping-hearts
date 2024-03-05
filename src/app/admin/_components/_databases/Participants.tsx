import { Skeleton } from '@/components/ui/skeleton';
import { Nunito } from 'next/font/google';
import { useState } from 'react';

const nunitoBold = Nunito({ weight: '800', subsets: ['latin'] });

type Participant = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    birthYear: string;
    birthMonth: string;
    birthDay: string;
    gradeLevel: string;
    events: Event[];
    parentId: string;
    isParent: boolean;
    dateCreated: string;
};

type Parent = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    birthYear: string;
    birthMonth: string;
    birthDay: string;
    isParent: boolean;
    dateCreated: string;
};

type Event = {
    name: string;
    isSelected: boolean;
};

const Messages = () => {
    const [hasFetched, setHasFetched] = useState<boolean>(false);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [parents, setParents] = useState<Parent[]>([]);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    fetch(`${process.env.NEXT_PUBLIC_DB_HOST}/participants`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            setParticipants(() => data.filter((participants: Participant | Parent) => !participants.isParent));
            setParents(() => data.filter((participants: Participant | Parent) => participants.isParent));
            setHasFetched(true);
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
                participants.length > 0 ? (
                    <div className='flex flex-col gap-3'>
                        {participants.map((data) => (
                            <div className='flex flex-col border rounded-lg w-full h-full p-4' key={data._id}>
                                <p>
                                    Name: {data.firstName} {data.lastName}
                                </p>
                                <p>Email: {data.email}</p>
                                <p>
                                    Birthday: {months.indexOf(data.birthMonth) + 1}/{data.birthDay}/{data.birthYear}
                                </p>
                                <p>Age: {getAge(data.birthYear, data.birthMonth, data.birthDay)}</p>
                                <p>Grade Level: {data.gradeLevel}</p>
                                <p>
                                    Events:{' '}
                                    {data.events
                                        .filter((event: Event) => event.isSelected)
                                        .map((event, index) => (
                                            <span key={index + event.name}>
                                                {event.name}
                                                {index != data.events.filter((event: Event) => event.isSelected).length - 1 ? ',' : ''}{' '}
                                            </span>
                                        ))}
                                </p>
                                <p>Date Created: {data.dateCreated}</p>
                                <p>Has Parent: {(data.parentId.length > 0).toString()}</p>
                                <div>
                                    <p>Parent:</p>
                                    <div className='flex flex-col ml-6'>
                                        {parents
                                            .filter((parent: Parent) => parent._id == data.parentId)
                                            .map((parent, index) => (
                                                <>
                                                    <p>
                                                        Name: {parent.firstName} {parent.lastName}
                                                    </p>
                                                    <p>Email: {parent.email}</p>
                                                    <p>
                                                        Birthday: {months.indexOf(parent.birthMonth) + 1}/{parent.birthDay}/{parent.birthYear}
                                                    </p>
                                                    <p>Age: {getAge(parent.birthYear, parent.birthMonth, parent.birthDay)}</p>
                                                    <p>Date Created: {data.dateCreated}</p>
                                                </>
                                            ))}
                                    </div>
                                </div>
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

export default Messages;
