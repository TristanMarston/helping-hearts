'use client';

import Image from 'next/image';
import { Fredoka, Jua, Nunito, Nunito_Sans } from 'next/font/google';
// import DropDownMenu from './DropDownMenu';
// import Drawer from './Drawer';
import Link from 'next/link';
import { useState } from 'react';
import MenuToggle from './MenuToggle';
import { NavLink } from '@/app/page';
import MobileMenu from './MobileMenu';
import { motion } from 'framer-motion';

const jua = Jua({ weight: '400', subsets: ['latin'] });
const fredokaBold = Fredoka({ weight: '600', subsets: ['latin'] });
const fredokaSemibold = Fredoka({ weight: '500', subsets: ['latin'] });

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const links: NavLink[] = [
        {
            title: 'Sign Up',
            href: '#',
            isDropdown: true,
            dropdownOptions: [
                { title: 'Youth Race', href: '/signup?type=youth', isDropdown: false },
                { title: 'Community Race', href: '/signup?type=community', isDropdown: false },
                { title: 'Volunteer', href: '/signup?type=volunteer', isDropdown: false },
            ],
        },
        { title: 'Results', href: '/results', isDropdown: false },
        { title: 'Contact Us', href: '#contact-us', isDropdown: false },
    ];

    return (
        <>
            <motion.section
                // initial={{ backgroundColor: '#FFFDF5' }}
                // animate={{ backgroundColor: menuOpen ? 'FFF8DE' : '#FFFDF5' }}
                // transition={{ duration: 0.5 }}
                className={` w-screen fixed top-0 backdrop-blur-sm px-5 taptop:px-7 z-[60]`}
            >
                <nav className='w-full sticky mt-5 bg-background-very-light h-[50px] mid-mobile:h-[60px] rounded-full text-secondary shadow-[0_4px_30px_rgba(0,0,0,.4)] pl-2 pr-3 flex items-center justify-between'>
                    <Link className='flex items-center justify-center gap-[5px] ml-2' href='/'>
                        <Image src='/helping-hearts-logo-default.png' className='hidden mid-mobile:block' alt='logo' width={54} height={34} />
                        <Image src='/helping-hearts-logo-default.png' className='block mid-mobile:hidden' alt='logo' width={38} height={24} />
                        <h1 className={`${jua.className} hidden mid-tablet:block tablet:text-4xl text-[1.625rem] text-primary font-black`}>helping hearts</h1>
                    </Link>
                    {/* laptop/desktop view */}
                    <div className='gap-6 mr-2.5 hidden tablet:flex'>
                        <Link
                            href='/results'
                            className={`${fredokaSemibold.className} text-primary-very-dark hover:text-primary-dark transition-all ease-in-out duration-300 font-medium flex items-center justify-center tracking-wide`}
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
                            className={`${fredokaSemibold.className} text-primary-very-dark hover:text-primary-dark transition-all ease-in-out duration-300 font-medium flex items-center justify-center tracking-wide`}
                        >
                            Contact
                        </button>
                        <button
                            className={`${fredokaBold.className} tablet:px-5 mablet:px-4 py-1.5 bg-primary text-white rounded-[10px] tablet:text-base hover:bg-primary-light transition-all tracking-wider`}
                        >
                            <Link href='/signup'>Sign Up</Link>
                        </button>
                    </div>
                    <MenuToggle toggle={() => setMenuOpen((prev) => !prev)} isOpen={menuOpen} color={menuOpen ? '#ed3a5f' : '#ed3a5f'} />
                </nav>
            </motion.section>
            <MobileMenu isOpen={menuOpen} setIsOpen={setMenuOpen} links={links} />
        </>
    );
};

export default Navbar;
