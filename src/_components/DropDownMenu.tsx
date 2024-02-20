'use client';

import { Fragment, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import LinkOptions from './LinkOptions';

type Props = {
    title: string;
};

const DropDownMenu = (props: Props) => {
    return (
        <Popover className='relative flex items-center'>
            <Popover.Button className='flex items-center gap-x-1 font-medium mablet:text-sm tablet:text-base text-gray-900'>
                {props.title}
                <ChevronDown className={`h-5 w-5 flex-none text-gray-400`} aria-hidden='true' />
            </Popover.Button>
            <Transition
                as={Fragment}
                enter='transition ease-out duration-200'
                enterFrom='opacity-0 translate-y-1'
                enterTo='opacity-100 translate-y-0'
                leave='transition ease-in duration-150'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 translate-y-1'
            >
                <Popover.Panel className='absolute w-[21.5rem] -left-52 top-full z-10 mt-2.5 overflow-hidden rounded-3xl bg-background shadow-lg ring-1 ring-gray-900/5'>
                    <LinkOptions />
                </Popover.Panel>
            </Transition>
        </Popover>
    );
};

export default DropDownMenu;
