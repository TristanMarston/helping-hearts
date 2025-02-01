import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Fredoka, Nunito } from 'next/font/google';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

const fredokaBold = Fredoka({ weight: '600', subsets: ['latin'] });
const fredokaLight = Fredoka({ weight: '400', subsets: ['latin'] });

type Props = {
    birthDate: { day: string; month: string; year: string };
    changeBirthDay: (day: string) => void;
    changeBirthMonth: (month: string) => void;
    changeBirthYear: (year: string) => void;
};

const BirthDateSelector = ({ birthDate, changeBirthDay, changeBirthMonth, changeBirthYear }: Props) => {
    const currentYear = new Date().getFullYear();
    const yearsArray: string[] = [];
    const [date, setDate] = useState<Date>();

    for (let year = currentYear; year >= 1960; year--) yearsArray.push(year.toString());
    const monthsArray: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    function ordinalNumber(number: string) {
        let num = parseInt(number);

        const lastDigit = num % 10;
        const lastTwoDigits = num % 100;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
            return `${num}th`;
        }

        switch (lastDigit) {
            case 1:
                return `${num}st`;
            case 2:
                return `${num}nd`;
            case 3:
                return `${num}rd`;
            default:
                return `${num}th`;
        }
    }

    useEffect(() => {
        if (date) changeBirthDay(String(date?.getDate()));
    }, [date]);

    return (
        <div className='flex flex-col gap-y-4 tablet:gap-y-0 tablet:grid tablet:grid-rows-2 tablet:grid-cols-[2fr_3fr_2fr] tablet:gap-x-2'>
            <h2 className={`${fredokaBold.className} text-xl row-span-1 col-span-3`}>Date of Birth</h2>

            <Select onValueChange={(value: string) => changeBirthYear(value)}>
                <SelectTrigger
                    className={`${fredokaLight.className} px-4 py-3 w-full h-11 text-base bg-background hover:bg-background-secondary transition-all text-gray-500 appearance-none rounded-md border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                >
                    <SelectValue placeholder='Year' className='text-black overflow-ellipsis'>
                        <span className={`min-w-[50px] truncate overflow-ellipsis`}>{birthDate.year !== '' ? birthDate.year : 'Year'}</span>
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className='bg-background'>
                    <SelectGroup>
                        {yearsArray.map((year, index) => (
                            <SelectItem key={year + index} value={year} className='hover:bg-background-dark'>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Select onValueChange={(value: string) => changeBirthMonth(value)}>
                <SelectTrigger
                    className={`${fredokaLight.className} px-4 py-3 w-full h-11 text-base bg-background hover:bg-background-secondary transition-all text-gray-500 appearance-none rounded-md border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                >
                    <SelectValue placeholder='Month' className='text-black overflow-ellipsis'>
                        <span className={`min-w-[50px] truncate overflow-ellipsis`}>{birthDate.month !== '' ? birthDate.month : 'Month'}</span>
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className='bg-background'>
                    <SelectGroup>
                        {monthsArray.map((month, index) => (
                            <SelectItem key={month + index} value={month} className='hover:bg-background-dark'>
                                {month}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Popover>
                <PopoverTrigger asChild>
                    <button
                        className={cn(
                            `${fredokaLight.className} px-4 py-3 w-full min-w-[87px] truncate h-11 text-base flex justify-start items-center bg-background hover:bg-background-secondary transition-all text-gray-500 appearance-none rounded-md border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`,
                            !date && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon className='text-gray-500 mr-2 h-4 w-4 min-h-4 min-w-4' />
                        {date && birthDate.day !== '' ? ordinalNumber(birthDate.day) : <span className='text-gray-500 truncate'>Day</span>}
                    </button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                    <Calendar
                        mode='single'
                        showYear={birthDate.year}
                        showMonth={birthDate.month}
                        showArrows={false}
                        selected={date}
                        onSelect={setDate}
                        showOutsideDays={false}
                        className='bg-background'
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default BirthDateSelector;
