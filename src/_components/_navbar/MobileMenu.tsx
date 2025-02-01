import { useState, useEffect } from 'react';
import { useAnimate, stagger, motion } from 'framer-motion';
import MenuToggle from './MenuToggle';
import { NavLink } from '@/app/page';
import MenuItems from './MenuItemsMobile';

const useMenuAnimation = (isOpen: boolean) => {
    const [scope, animate] = useAnimate();

    useEffect(() => {
        const menuAnimations: any = isOpen
            ? [
                  ['nav', { transform: 'translateX(0%)' }, { ease: [0.08, 0.65, 0.53, 0.96], duration: 0.8 }],
                  ['li', { transform: 'scale(1)', opacity: 1, filter: 'blur(0px)' }, { delay: stagger(0.02), at: '-0.1' }],
              ]
            : [
                  ['li', { transform: 'scale(0.5)', opacity: 0, filter: 'blur(10px)' }],
                  ['nav', { transform: 'translateX(100%)' }, { at: '-0.1' }],
              ];

        animate([...menuAnimations]);
    }, [isOpen]);

    return scope;
};

const MobileMenu = ({ isOpen, setIsOpen, links }: { isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; links: NavLink[] }) => {
    const scope = useMenuAnimation(isOpen);

    return (
        <>
            <div ref={scope}>
                <MenuItems links={links} isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
        </>
    );
};

export default MobileMenu;
