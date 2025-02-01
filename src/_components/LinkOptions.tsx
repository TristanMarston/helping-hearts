'use client';

import { CircleDollarSign, HeartHandshake, Users, HandHeart, ArrowUpRightFromSquare, Phone, LucideIcon, NotebookText } from 'lucide-react';
import Link from 'next/link';

type LinksArray = {
    name: string;
    description: string;
    href: string;
    icon: LucideIcon;
};

type ActionsArray = {
    name: string;
    href: string;
    onClick?: any;
    icon: LucideIcon;
};

const links: LinksArray[] = [
    // { name: 'Donate', description: 'Support us in our mission.', href: '#', icon: CircleDollarSign },
    // { name: 'Volunteer', description: 'Join us and make an impact.', href: '/signup?isVolunteer=true', icon: HeartHandshake },
    // { name: 'About Us', description: 'Learn who we are and why.', href: '#', icon: Users },
    { name: 'Results', description: 'View the results of the event.', href: '/results', icon: NotebookText },
    { name: 'Contact Us', description: 'Connect with us for support.', href: '#', icon: Phone },
    // { name: 'Our Mission', description: 'Discover our purpose and goals.', href: '#', icon: HandHeart },
];

const callsToAction: ActionsArray[] = [
    // { name: 'Sign Up', href: '/signup?isVolunteer=false', icon: ArrowUpRightFromSquare },
    // { name: 'Contact Us', href: '#', icon: Phone },
];

const LinkOptions = () => {
    const scrollToContactUs = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        const targetElement = document.getElementById('contact-us');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <div className='p-3'>
                {links.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={(e) => (item.name == 'Contact Us' ? scrollToContactUs(e) : {})}
                        className='group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-background-secondary'
                    >
                        <div className='flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-background-secondary group-hover:bg-background'>
                            <item.icon className='h-6 w-6 text-gray-600 group-hover:text-primary' aria-hidden='true' />
                        </div>
                        <div className='flex-auto'>
                            <p className='block font-semibold text-gray-900'>
                                {item.name}
                                <span className='absolute inset-0' />
                            </p>
                            <p className='mt-1 text-gray-600'>{item.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
            {/* <div className='grid grid-cols-2 divide-x divide-gray-900/5 bg-background-secondary'>
                {callsToAction.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={(e) => {
                            e.preventDefault();
                            const targetElement = document.getElementById('contact-us');
                            if (targetElement) {
                                targetElement.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                        className='flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-background-dark'
                    >
                        <item.icon className='h-5 w-5 flex-none text-gray-400' aria-hidden='true' />
                        {item.name}
                    </Link>
                ))}
            </div> */}
        </>
    );
};

export default LinkOptions;
