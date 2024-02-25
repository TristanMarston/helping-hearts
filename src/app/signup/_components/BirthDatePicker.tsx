'use client';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Nunito } from 'next/font/google';

const nunitoLight = Nunito({ weight: '400', subsets: ['latin'] });

const BirthDatePicker = () => {
    const [date, setDate] = React.useState<Date>();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                        `${nunitoLight.className} px-4 py-3 w-full h-11 bg-background appearance-none rounded-md border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] flex justify-start items-center text-base`,
                        !date && 'text-muted-foreground text-gray-500'
                    )}
                >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {date ? format(date, 'PPP') : <span>Birth Date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className='flex w-auto flex-col space-y-2 p-2'>
                <Select onValueChange={(value) => setDate(addDays(new Date(), parseInt(value)))}>
                    <SelectTrigger>
                        <SelectValue placeholder='Select' />
                    </SelectTrigger>
                    <SelectContent position='popper'>
                        <SelectItem value='0'>Today</SelectItem>
                        <SelectItem value='1'>Tomorrow</SelectItem>
                        <SelectItem value='3'>In 3 days</SelectItem>
                        <SelectItem value='7'>In a week</SelectItem>
                    </SelectContent>
                </Select>
                <div className='rounded-md border'>
                    <Calendar mode='single' selected={date} onSelect={setDate} />
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default BirthDatePicker;
