import { useState, useEffect, useRef, Fragment } from 'react';
import { useAnimate, stagger, motion, Variants, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { NavLink } from '@/app/page';
import { cn } from '@/lib/utils';

const MobileMenu = ({ isOpen, ref, setIsOpen, links }: { isOpen: boolean; ref: React.RefObject<HTMLDivElement | null>; setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; links: NavLink[] }) => {
    const [currentDropdown, setCurrentDropdown] = useState(-1);

    return (
        <div className='fixed top-26 4xl:top-28 w-full px-5 z-100'>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={dropdownVariants(0.2, 0.3)}
                        animate={isOpen ? 'open' : 'closed'}
                        exit='closed'
                        initial='closed'
                        ref={ref}
                        className='flex navbar-md:hidden overflow-y-auto flex-col gap-4 bg-background-very-light rounded-[18px] shadow-[0px_6px_9px_-1px_rgba(224,20,62,0.1),0px_3px_0px_0px_rgba(224,20,62,0.02),0px_0px_0px_3px_rgba(224,20,62,0.08)] p-6 w-full'
                    >
                        {links.map(({ title, href, isDropdown, dropdownOptions }, index) => (
                            <Fragment key={title}>
                                {isDropdown && dropdownOptions !== undefined ? (
                                    <DropdownLink
                                        key={title}
                                        name={title}
                                        dropdown={dropdownOptions}
                                        index={index}
                                        currentDropdown={currentDropdown}
                                        setCurrentDropdown={setCurrentDropdown}
                                    />
                                ) : (
                                    <Link
                                        key={title}
                                        href={href.indexOf('#') !== -1 ? '#' : href}
                                        onClick={(e) => {
                                            if (href.indexOf('#') === -1) return;
                                            setIsOpen(false);
                                            e.preventDefault();
                                            if (href.indexOf('#') !== -1) {
                                                const targetElement = document.getElementById(href.substring(1));
                                                if (targetElement) {
                                                    targetElement.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }
                                        }}
                                        className='text-primary hover:text-primary-light font-fredoka font-semibold text-2xl select-none w-full transition-all'
                                    >
                                        {title}
                                    </Link>
                                )}
                                {index !== 2 && <div className={cn('w-full h-[0.5px] bg-primary rounded-full', index === 0 ? 'flex navbar-sm:hidden' : '')} />}
                            </Fragment>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const DropdownLink = ({
    name,
    dropdown,
    currentDropdown,
    setCurrentDropdown,
    index,
}: {
    name: string;
    dropdown: () => React.ReactNode;
    currentDropdown: number;
    setCurrentDropdown: React.Dispatch<React.SetStateAction<number>>;
    index: number;
}) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);

    const toggleQuestion = (index: number) => {
        if (currentDropdown === index) setCurrentDropdown(-1);
        else setCurrentDropdown(index);
    };

    const answerVariants: Variants = {
        closed: {
            opacity: 0,
            height: 0,
            marginTop: 0,
            marginBottom: 0,
        },
        open: {
            opacity: 1,
            height: contentHeight,
            marginTop: '8px',
            marginBottom: '8px',
        },
    };

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, []);

    return (
        <motion.div
            key={index}
            animate={currentDropdown === index ? 'open' : 'closed'}
            initial='closed'
            className={cn('flex flex-col justify-center rounded-2xl cursor-pointer overflow-y-auto hide-scrollbar overflow-x-hidden', index === 0 ? 'flex navbar-sm:hidden' : '')}
        >
            <motion.div className='flex justify-between items-center rounded-xl' onClick={() => toggleQuestion(index)}>
                <div className='text-primary hover:text-primary-light font-fredoka font-semibold text-2xl select-none w-full transition-all'>{name}</div>

                <motion.div variants={flipVariants} initial='closed' animate={currentDropdown === index ? 'open' : 'closed'}>
                    <ChevronDown strokeWidth={1.8} className='text-primary' />
                </motion.div>
            </motion.div>

            <motion.div
                key='answer'
                ref={contentRef}
                variants={answerVariants}
                initial='closed'
                animate={currentDropdown === index ? 'open' : 'closed'}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='px-2 flex flex-col gap-2 relative overflow-x-hidden h-full text-base lg:text-[17px] max-h-[30vh] lg:max-h-[35vh]'
            >
                {dropdown()}
            </motion.div>
        </motion.div>
    );
};

export const dropdownVariants: (closeDuration: number, openDuration: number) => Variants = (closeDuration = 0.3, openDuration = 0.3) => ({
    closed: {
        opacity: 0,
        y: -10,
        transition: { duration: closeDuration, ease: 'easeInOut' },
    },
    open: {
        opacity: 1,
        y: 0,
        transition: { duration: openDuration, ease: 'easeInOut' },
    },
});

export const flipVariants: Variants = {
    closed: {
        rotate: '0deg',
        transition: { duration: 0.3, type: 'spring', bounce: 0.3 },
    },
    open: {
        rotate: '180deg',
        transition: { duration: 0.3, type: 'spring', bounce: 0.3 },
    },
};

export default MobileMenu;
