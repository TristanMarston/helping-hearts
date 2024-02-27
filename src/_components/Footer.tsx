import { Jua, Nunito } from 'next/font/google';
import Image from 'next/image';
import ContactUs from './ContactUs';
import Link from 'next/link';
import { LucideIcon, Instagram, Github } from 'lucide-react';

const jua = Jua({ weight: '400', subsets: ['latin'] });
const nunitoBold = Nunito({ weight: '800', subsets: ['latin'] });
const nunitoLight = Nunito({ weight: '600', subsets: ['latin'] });

type Props = {
    showVolunteerAd: boolean;
};

type Links = {
    text: string;
    href: string;
};

type IconLinks = {
    icon: LucideIcon;
    href: string;
};

const links: Links[] = [
    { text: 'Register', href: '/signup?isVolunteer=false' },
    { text: 'Volunteer', href: '/signup?isVolunteer=true' },
    { text: 'Donate', href: '/signup?isVolunteer=false' },
    { text: 'About', href: '/signup?isVolunteer=false' },
];

const iconLinks: IconLinks[] = [
    { icon: Instagram, href: '#' },
    { icon: Github, href: 'https://github.com/TristanMarston/helping-hearts' },
];

const Footer = (props: Props) => {
    return (
        <div className='flex flex-col items-center'>
            {props.showVolunteerAd && (
                <div className='bg-primary-pink relative top-12 taptop:top-16 w-[80vw] max-w-[1280px] min-w-[17rem] h-16 taptop:h-20 laptop:h-24 rounded-full shadow-lg flex items-center justify-center px-10 tablet:px-5 laptop:px-8'>
                    <h1 className={`${jua.className} text-background hidden tablet:block tablet:text-3xl taptop:text-5xl laptop:text-6xl w-full`}>Volunteer Today!</h1>
                    <div className='flex gap-3'>
                        <Link
                            href='/signup?isVolunteer=true'
                            className={`${nunitoBold.className} w-28 h-8 desktop:w-36 desktop:h-10 desktop:text-xl transition-all bg-background hover:bg-background-secondary text-primary-pink rounded-full flex items-center gap-2 justify-center tracking-wide shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.25)]`}
                        >
                            Volunteer
                        </Link>
                        <Link
                            href='/signup?isVolunteer=false'
                            className={`${nunitoBold.className} w-28 h-8 desktop:w-36 desktop:h-10 desktop:text-xl border border-background transition-all bg-primary-pink hover:bg-primary-pink-light text-background rounded-full flex items-center gap-2 justify-center tracking-wide shadow-[4.0px_4.0px_5.0px_rgba(0,0,0,0.1)]`}
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            )}
            <div className='max-h-16 w-full'>
                <img src='/helping-hearts-wave-footer.svg' className={`${!props.showVolunteerAd ? 'top-10' : 'top-1'} w-full max-h-[15rem] relative -z-40 object-contain`} />
            </div>
            <div className='bg-primary h-full w-full flex flex-col items-center pt-10 px-5 pb-3 gap-10'>
                <ContactUs />
                <div className='w-full max-w-[1280px] rounded-full bg-primary-dark h-[1px]' />
                <div className='w-full max-w-[1280px] flex flex-col items-start gap-5'>
                    <Link className='flex items-center justify-center gap-[5px]' href='/'>
                        <Image src='/helping-hearts-logo-default-white.png' className='hidden tablet:block' alt='logo' width={54} height={34} />
                        <Image src='/helping-hearts-logo-default-white.png' className='mablet:block tablet:hidden' alt='logo' width={38} height={24} />
                        <h1 className={`${jua.className} tablet:text-4xl text-[1.625rem] text-background`}>helping hearts</h1>
                    </Link>
                    {/* <div className='flex gap-10'>
                        {links.map((data, index) => (
                            <Link key={data.text + index} href={data.href} className={`${nunitoLight.className} text-background hover:text-background-light transition-all`}>
                                {data.text}
                            </Link>
                        ))}
                    </div>
                    <div className='flex gap-10'>
                        {iconLinks.map((data, index) => (
                            <Link key={index} href={data.href}>
                                <data.icon className='h-6 w-6 flex-none text-background hover:text-background-light transition-all' aria-hidden='true' />
                            </Link>
                        ))}
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default Footer;
