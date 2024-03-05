import { Skeleton } from '@/components/ui/skeleton';
import { Nunito } from 'next/font/google';
import { useState } from 'react';

const nunitoBold = Nunito({ weight: '800', subsets: ['latin'] });

type Message = {
    _id: string;
    firstName?: string;
    lastName?: string;
    subject?: string;
    email: string;
    message: string;
    dateCreated: string;
};

const Messages = () => {
    const [hasFetched, setHasFetched] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);

    fetch(`${process.env.NEXT_PUBLIC_DB_HOST}/messages`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            setMessages(() => {
                setHasFetched(true);
                return [...data];
            });
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });

    return (
        <div className='mt-5'>
            {hasFetched ? (
                messages.length > 0 ? (
                    <div className='flex flex-col gap-3'>
                        {messages.map((data) => (
                            <div className='flex flex-col border rounded-lg w-full h-full p-4' key={data._id}>
                                {data.firstName != undefined && data.lastName != undefined && (
                                    <p>
                                        Name: {data.firstName} {data.lastName}
                                    </p>
                                )}
                                <p>Email: {data.email}</p>
                                {data.subject != undefined && <p>Subject: {data.subject}</p>}
                                <p>Date Sent: {data.dateCreated}</p>
                                <p>Message: {data.message}</p>
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
