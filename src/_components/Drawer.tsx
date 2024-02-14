import * as React from 'react';
import { Menu } from 'lucide-react';
import LinkOptions from './LinkOptions';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

export default function DrawerMenu() {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Menu color='#ed3a5f' strokeWidth={2.5} />
            </DrawerTrigger>
            <DrawerContent>
                <div className='mx-auto w-full max-w-sm bg-background'>
                    <LinkOptions />
                </div>
            </DrawerContent>
        </Drawer>
    );
}
