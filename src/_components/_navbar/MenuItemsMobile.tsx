import { NavLink } from '@/app/page';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Fredoka } from 'next/font/google';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const fredokaBold = Fredoka({ weight: '600', subsets: ['latin'] });

const HoverListItem = ({ title, href, className, setIsOpen }: { title: string; href: string; className?: string; setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <li onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <Link
                href={href || '#'}
                onClick={(e) => {
                    setIsOpen(false);
                    if (href.startsWith('#')) {
                        e.preventDefault();
                        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
                    }
                }}
                className={`font-bold text-xl min-[320px]:text-2xl min-[400px]:text-3xl w-full flex justify-end`}
            >
                <span className={`${fredokaBold.className} tracking-wide inline-block text-primary text-right ${className}`}>
                    {title}
                    <motion.div className='h-1 bg-secondary rounded-full' initial={{ width: '0%' }} animate={{ width: isHovered ? '100%' : '0%' }} transition={{ duration: 0.2 }} />
                </span>
            </Link>
        </li>
    );
};

const HoverListItemCollapsible = ({
    title,
    href,
    selectedDropdown,
    setSelectedDropdown,
    dropdownOptions,
    setIsOpen,
}: {
    title: string;
    href: string;
    selectedDropdown: string;
    setSelectedDropdown: React.Dispatch<React.SetStateAction<string>>;
    dropdownOptions: NavLink[] | undefined;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const parentVariants = {
        open: { height: '100%', transition: { duration: 0.5 } },
        closed: { height: '2.375rem', transition: { duration: 0.5 } },
    };

    const contentVariants = {
        open: { opacity: 1, transition: { duration: 0.3 } },
        closed: { opacity: 0, transition: { duration: 0.3 } },
    };

    return dropdownOptions ? (
        <motion.li
            className={`${fredokaBold.className} flex flex-col cursor-pointer text-primary`}
            variants={parentVariants}
            initial={false}
            animate={selectedDropdown === title ? 'open' : 'closed'}
        >
            <div className='flex gap-0.5 mid-mobile:gap-2 items-center justify-end mb-2' onClick={() => setSelectedDropdown((prev) => (prev === title ? 'null' : title))}>
                <Link href={href || '#'} className='font-bold text-xl min-[320px]:text-2xl min-[400px]:text-3xl select-none text-right'>
                    {title}
                </Link>
                <ChevronDown className={`${title === selectedDropdown ? 'rotate-180' : 'rotate-0'} w-6 h-6 mid-mobile:w-8 mid-mobile:h-8 transition-all`} />
            </div>
            <motion.ul variants={contentVariants} animate={selectedDropdown === title ? 'open' : 'closed'} className='flex flex-col gap-3'>
                {dropdownOptions.map(({ title, href }, index) => (
                    <HoverListItem title={title} href={href} key={title + index} setIsOpen={setIsOpen} className='text-base text-right' />
                ))}
            </motion.ul>
        </motion.li>
    ) : (
        <HoverListItem title={title} href={href} setIsOpen={setIsOpen} />
    );
};

const MenuItems = ({ links, isOpen, setIsOpen }: { links: NavLink[]; isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [selectedDropdown, setSelectedDropdown] = useState('null');

    useEffect(() => {
        if (!isOpen) {
            setSelectedDropdown('null');
        }
    }, [isOpen]);

    return (
        <nav className='fixed top-0 right-0 bottom-0 w-full min-h-full bg-background-light translate-x-[100%] will-change-transform pt-[88px] mid-mobile:pt-28 z-[50] overflow-y-auto tablet:hidden'>
            <ul className='flex flex-col items-end gap-3 mid-mobile:gap-7 pr-3 mr-5 overflow-y-auto'>
                {links.map(({ title, href, isDropdown, dropdownOptions }, index) =>
                    isDropdown ? (
                        <HoverListItemCollapsible
                            title={title}
                            href={href}
                            key={title + index}
                            selectedDropdown={selectedDropdown}
                            setSelectedDropdown={setSelectedDropdown}
                            dropdownOptions={dropdownOptions}
                            setIsOpen={setIsOpen}
                        />
                    ) : (
                        <HoverListItem title={title} href={href} key={title + index} setIsOpen={setIsOpen} />
                    )
                )}
            </ul>
        </nav>
    );
};

export default MenuItems;
