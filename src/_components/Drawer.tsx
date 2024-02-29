import * as React from 'react';
import { HeartHandshake, LucideIcon, Menu, Users, Phone } from 'lucide-react';
import LinkOptions from './LinkOptions';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import Link from 'next/link';

type LinksArray = {
    name: string;
    description: string;
    href: string;
    icon: LucideIcon;
};

const links: LinksArray[] = [
    // { name: 'Donate', description: 'Support us in our mission.', href: '#', icon: CircleDollarSign },
    { name: 'Sign Up', description: 'Get involved and join our cause.', href: '/signup?isVolunteer=false', icon: Users },
    { name: 'Volunteer', description: 'Join us and make an impact.', href: '/signup?isVolunteer=true', icon: HeartHandshake },
    // { name: 'About Us', description: 'Learn who we are and why.', href: '#', icon: Users },
    { name: 'Contact Us', description: 'Connect with us for support.', href: '#', icon: Phone },
    // { name: 'Our Mission', description: 'Discover our purpose and goals.', href: '#', icon: HandHeart },
];

export default function DrawerMenu() {
    const scrollToContactUs = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setTimeout(() => {
            e.preventDefault();
            const targetElement = document.getElementById('contact-us');
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 350);
    };

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Menu color='#ed3a5f' strokeWidth={2.5} />
            </DrawerTrigger>
            <DrawerContent>
                <div className='mx-auto w-full max-w-[500px] bg-background h-[192px]'>
                    {/* <LinkOptions isDrawer={true} /> */}
                    <div className='p-3'>
                        {links.map((item, index) => (
                            <DrawerClose key={item.name + index} className='w-full' onClick={(e) => (item.name == 'Contact Us' ? scrollToContactUs(e) : {})}>
                                <a href={item.href} className='group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-background-secondary'>
                                    <div className='flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-background-secondary group-hover:bg-background'>
                                        <item.icon className='h-6 w-6 text-gray-600 group-hover:text-primary' aria-hidden='true' />
                                    </div>
                                    <div className='flex flex-col justify-start'>
                                        <p className='block font-semibold text-gray-900 text-left'>{item.name}</p>
                                        <p className='mt-1 text-gray-600'>{item.description}</p>
                                    </div>
                                </a>
                            </DrawerClose>
                        ))}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
