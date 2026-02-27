'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LucideIcon, Instagram, Github } from 'lucide-react';
import ContactUs from './ContactUs';
import { useState } from 'react';
import ConfirmMessageModal from './ConfirmMessageModal';
import toast from 'react-hot-toast';
import { sendMessage } from '@/app/actions/messages';

type Props = {
    showVolunteerAd: boolean;
    page: string;
};

type Links = {
    text: string;
    href: string;
};

type IconLinks = {
    icon: LucideIcon;
    href: string;
};

export type ContactFormData = {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
};

const links: Links[] = [
    { text: 'Register', href: '/signup' },
    { text: 'Volunteer', href: '/signup?type=volunteer' },
    { text: 'DPHS', href: 'https://dphs.sbunified.org/' },
    // { text: 'About', href: '/signup?isVolunteer=false' },
];

const iconLinks: IconLinks[] = [{ icon: Instagram, href: 'https://www.instagram.com/sbhelpinghearts/' }];

const Footer = (props: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<ContactFormData>({ firstName: '', lastName: '', email: '', subject: '', message: '' });

    const handleSubmit = async () => {
        const sendObject: any = {};
        sendObject.name = `${formData.firstName} ${formData.lastName}`.trim();
        sendObject.email = formData.email.trim().toLowerCase();
        sendObject.subject = formData.subject.trim();
        sendObject.message = formData.message.trim();

        if (!sendObject.email || !sendObject.message) {
            toast.error('Please fill out all the fields', {
                className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
                position: 'top-center',
                duration: 4000,
            });

            return;
        }

        const toastID = toast.loading('Posting message...', {
            className: `font-fredoka font-semibold !rounded-[14px] !px-4 !bg-background !text-black text-xl`,
            position: 'top-center',
        });

        const res = await sendMessage(sendObject);
        console.log(res);
        if (res.success) {
            toast.success('Successfully sent message!', {
                id: toastID,
                duration: 4000,
            });

            setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
        } else {
            toast.error(`Couldn't send message. Please use the email address.`, {
                id: toastID,
                duration: 4000,
            });
        }
    };

    return (
        <>
            <section className={`${props.page === 'home' ? 'bottom-28' : 'bottom-0'} relative overflow-x-hidden`}>
                <div className='flex flex-col items-center'>
                    {props.showVolunteerAd && (
                        <div className='bg-primary-pink z-10 relative top-10 laptop:top-14 w-[80vw] max-w-[1280px] min-w-[17rem] py-3 mid-column:py-4 rounded-full shadow-lg flex items-center justify-center px-10 tablet:px-5 laptop:px-8'>
                            <h1
                                className={`font-sour-gummy font-extrabold text-background hidden tablet:block tablet:text-3xl mid-column:text-4xl min-[900px]:text-5xl laptop:text-6xl w-full tracking-[0.01em]`}
                            >
                                Volunteer Today!
                            </h1>
                            <div className='flex gap-3'>
                                <Link
                                    href='/signup?type=volunteer'
                                    className={`font-fredoka font-semibold w-28 h-8 min-[900px]:w-32 min-[900px]:h-9 min-[900px]:text-lg laptop:w-36 laptop:h-10 laptop:text-xl transition-all bg-background hover:bg-background-secondary text-primary-pink rounded-full flex items-center gap-2 justify-center tracking-wide shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.25)]`}
                                >
                                    Volunteer
                                </Link>
                                <Link
                                    href='/signup'
                                    className={`font-fredoka font-semibold w-28 h-8 min-[900px]:w-32 min-[900px]:h-9 min-[900px]:text-lg laptop:w-36 laptop:h-10 laptop:text-xl border border-background transition-all bg-primary-pink hover:bg-primary-pink-light text-background rounded-full flex items-center gap-2 justify-center tracking-wide shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.1)]`}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    )}
                    <div className='max-h-16 w-full bg-transparent hidden mid-tablet:block z-[1]'>
                        <img src='/helping-hearts-wave-footer.svg' className={`${!props.showVolunteerAd ? 'top-10' : 'top-1'} w-full max-h-[15rem] relative -z-40 object-contain`} />
                    </div>
                    <div className='bg-primary h-full w-full flex flex-col items-center pt-10 px-5 pb-3 z-[2] tablet:gap-10 gap-5 mt-4 mid-tablet:mt-0'>
                        <ContactUs setConfirmMessageModalOpen={setIsOpen} formData={formData} setFormData={setFormData} />
                        <div className='w-full max-w-[1280px] rounded-full bg-primary-dark h-[1px]' />
                        <div className='w-full max-w-[1280px] flex flex-col items-center gap-5'>
                            <Link className='flex items-center justify-center gap-[5px]' href='/'>
                                <Image src='/helping-hearts-logo-default-white.png' className='hidden tablet:block' alt='logo' width={54} height={34} />
                                <Image src='/helping-hearts-logo-default-white.png' className='mablet:block tablet:hidden' alt='logo' width={38} height={24} />
                                <h1 className={`font-jua tablet:text-4xl text-[1.625rem] text-background`}>helping hearts</h1>
                            </Link>
                            <div className='flex gap-10'>
                                {links.map((data, index) => (
                                    <Link
                                        key={data.text + index}
                                        href={data.href}
                                        target={data.text === 'DPHS' ? '_blank' : '_self'}
                                        className={`font-fredoka font-light text-background hover:text-background-light transition-all`}
                                    >
                                        {data.text}
                                    </Link>
                                ))}
                            </div>
                            <p className='font-fredoka text-background'>Website created by Tristan Marston.</p>
                            <div className='flex gap-10'>
                                {iconLinks.map((data, index) => (
                                    <Link key={index} href={data.href} target='_blank'>
                                        <data.icon className='h-6 w-6 flex-none text-background hover:text-background-light hover:scale-105 transition-all' aria-hidden='true' />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ConfirmMessageModal open={isOpen} setOpen={setIsOpen} formData={formData} handleSubmit={handleSubmit} />
        </>
    );
};

export default Footer;
