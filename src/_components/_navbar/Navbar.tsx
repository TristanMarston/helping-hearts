'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import MenuToggle from './MenuToggle';
import { NavLink } from '@/app/page';
import MobileMenu from './MobileMenu';
import { Goal, HandHeart, TrendingUp } from 'lucide-react';
import { useOnClickOutside } from '@/app/hooks/useOnClickOutside';

const links: NavLink[] = [
    {
        title: 'Sign Up',
        href: '#',
        isDropdown: true,
        dropdownOptions: () => (
            <>
                <Link href='/signup?type=youth' className='p-3 w-full rounded-4xl flex gap-3 hover:bg-background-light transition-colors cursor-pointer'>
                    <div className='rounded-full bg-primary-light shadow-md shadow-primary-dark primary-border p-2 w-14 h-14 aspect-square grid place-items-center'>
                        <Goal className='text-background w-7 h-7' />
                    </div>
                    <div className='font-fredoka'>
                        <h4 className='font-bold tracking-wide text-lg'>Youth Sign Up</h4>
                        <p className='text-[15px]'>Sign up a little one to try out some fun events!</p>
                    </div>
                </Link>
                <Link href='/signup?type=community' className='p-3 w-full rounded-4xl flex gap-3 hover:bg-background-light transition-colors cursor-pointer'>
                    <div className='rounded-full bg-primary-light shadow-md shadow-primary-dark primary-border p-2 w-14 h-14 aspect-square grid place-items-center'>
                        <TrendingUp className='text-background w-7 h-7' />
                    </div>
                    <div className='font-fredoka'>
                        <h4 className='font-bold tracking-wide text-lg'>Community Sign Up</h4>
                        <p className='text-[15px]'>Take part in our annual community 1-mile race!</p>
                    </div>
                </Link>
                <Link href='/signup?type=volunteer' className='p-3 w-full rounded-4xl flex gap-3 hover:bg-background-light transition-colors cursor-pointer'>
                    <div className='rounded-full bg-primary-light shadow-md shadow-primary-dark primary-border p-2 w-14 h-14 aspect-square grid place-items-center'>
                        <HandHeart className='text-background w-7 h-7' />
                    </div>
                    <div className='font-fredoka'>
                        <h4 className='font-bold tracking-wide text-lg'>Volunteer Sign Up</h4>
                        <p className='text-[15px]'>Make a difference by helping us run this special event.</p>
                    </div>
                </Link>
            </>
        ),
    },
    { title: 'Results', href: '/results', isDropdown: false },
    { title: 'Contact Us', href: '#contact-us', isDropdown: false },
];

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const mobileButtonRef = useRef<HTMLButtonElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(mobileMenuRef, [mobileButtonRef], () => setMenuOpen(false));

    return (
        <>
            <section className={`w-full max-w-[1320px] fixed top-0 backdrop-blur-sm px-5 z-[60]`}>
                <nav className='w-full sticky mt-5 bg-background-very-light h-[60px] rounded-full text-secondary shadow-[0_4px_30px_rgba(0,0,0,.4)] pl-2 pr-3 flex items-center justify-between'>
                    <Link className='flex items-center justify-center gap-[5px] ml-2' href='/'>
                        <Image src='/helping-hearts-logo-default.png' alt='logo' width={54} height={34} />
                        <h1 className={`font-jua hidden navbar-xs:block text-[33px] navbar-lg:text-4xl text-primary font-light`}>helping hearts</h1>
                    </Link>
                    {/* laptop/desktop view */}
                    <div className='gap-6 mr-2.5 flex items-center'>
                        <Link
                            href='/results'
                            className='font-fredoka font-medium hidden navbar-md:flex text-primary-dark hover:text-primary-light cursor-pointer transition-all ease-in-out duration-300 items-center justify-center tracking-wide'
                        >
                            Results
                        </Link>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                const targetElement = document.getElementById('contact-us');
                                if (targetElement) {
                                    targetElement.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            className='font-fredoka font-medium hidden navbar-md:flex text-primary-dark hover:text-primary-light cursor-pointer transition-all ease-in-out duration-300 items-center justify-center tracking-wide'
                        >
                            Contact
                        </button>
                        <Link
                            href='/signup'
                            className={`font-fredoka hidden navbar-sm:flex cursor-pointer -mr-3 navbar-md:m-0 font-semibold h-fit px-5 py-1.5 bg-primary text-white rounded-[14px] shadow-md shadow-primary-dark tablet:text-base hover:bg-primary-light hover:shadow-sm transition-all tracking-wider`}
                        >
                            Sign Up
                        </Link>
                        <MenuToggle ref={mobileButtonRef} toggle={() => setMenuOpen((prev) => !prev)} isOpen={menuOpen} color={menuOpen ? '#ed3a5f' : '#ed3a5f'} />
                    </div>
                </nav>
            </section>
            <MobileMenu ref={mobileMenuRef} isOpen={menuOpen} setIsOpen={setMenuOpen} links={links} />
        </>
    );
};

export default Navbar;
