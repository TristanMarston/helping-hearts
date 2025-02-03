'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Fredoka } from 'next/font/google';

const fredoka = Fredoka({ weight: '400', subsets: ['latin'] });

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
    showYear: string;
    showMonth: string;
    showArrows: boolean;
};

function Calendar({ className, classNames, showOutsideDays = true, showYear, showMonth, showArrows, ...props }: CalendarProps) {
    const monthsArray: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const customDisplay = showYear === '' || showMonth === '';

    return customDisplay ? (
        <div className={`${fredoka.className} p-2 rounded-lg bg-background`}>Please select a year and a month.</div>
    ) : (
        <div className={fredoka.className}>
            <DayPicker
                showOutsideDays={showOutsideDays}
                className={cn('p-3', className)}
                defaultMonth={new Date(parseInt(showYear), monthsArray.indexOf(showMonth))}
                classNames={{
                    months: 'flex flex-col',
                    month: 'space-y-4 bg-background',
                    month_caption: cn('justify-center pt-1 relative items-center', customDisplay ? 'hidden' : 'flex'),
                    caption_label: 'text-base font-medium',
                    nav: 'space-x-1 flex items-center',
                    month_grid: cn('w-full border-collapse space-y-1', customDisplay ? 'margin-top-0' : ''),
                    weekdays: cn(customDisplay ? 'hidden' : 'flex'),
                    weekday: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
                    week: 'flex w-full mt-2',
                    // day: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                    day: cn(buttonVariants({ variant: 'ghost' }), 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-background-dark'),
                    range_end: 'day-range-end',
                    selected: 'bg-background-dark text-primary-foreground hover:bg-background-dark hover:text-primary-foreground focus:bg-background-dark focus:text-primary-foreground',
                    today: 'bg-accent text-accent-foreground',
                    outside: 'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
                    disabled: 'text-muted-foreground opacity-50',
                    range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
                    hidden: 'invisible',
                    ...classNames,
                }}
                components={{
                    PreviousMonthButton: ({ ...props }) => <ChevronLeft className={cn('h-4 w-4', showArrows ? 'hidden' : 'hidden')} />,
                    NextMonthButton: ({ ...props }) => <ChevronRight className={cn('h-4 w-4', showArrows ? 'hidden' : 'hidden')} />,
                }}
                {...props}
            />
        </div>
    );
}
Calendar.displayName = 'Calendar';

export { Calendar };
