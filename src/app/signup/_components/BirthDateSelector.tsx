import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Nunito } from 'next/font/google';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const nunitoBold = Nunito({ weight: '800', subsets: ['latin'] });
const nunitoLight = Nunito({ weight: '400', subsets: ['latin'] });

type MapArray = {
    name: 'birthYear' | 'birthMonth' | 'birthDay';
    label: string;
    ref?: any;
    selections?: string[];
    state?: string;
    setState?: React.Dispatch<React.SetStateAction<string>>;
};

type Props = {
    birthYear: string;
    setBirthYear: React.Dispatch<React.SetStateAction<string>>;
    birthMonth: string;
    setBirthMonth: React.Dispatch<React.SetStateAction<string>>;
    birthDay: string;
    setBirthDay: React.Dispatch<React.SetStateAction<string>>;
    date: Date | undefined;
    setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

const BirthDateSelector = ({ birthYear, setBirthYear, birthMonth, setBirthMonth, birthDay, setBirthDay, date, setDate }: Props) => {
    const currentYear = new Date().getFullYear();
    const yearsArray: string[] = [];

    for (let year = currentYear; year >= 1960; year--) yearsArray.push(year.toString());
    const monthsArray: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const birthDateInputMapArray: MapArray[] = [
        { name: 'birthYear', label: 'Year', selections: yearsArray, state: birthYear, setState: setBirthYear },
        { name: 'birthMonth', label: 'Month', selections: monthsArray, state: birthMonth, setState: setBirthMonth },
        { name: 'birthDay', label: 'Day' },
    ];

    return (
        <div className='flex flex-col gap-y-4 tablet:gap-y-0 tablet:grid tablet:grid-rows-2 tablet:grid-cols-[2fr_3fr_2fr] tablet:gap-x-2'>
            <h2 className={`${nunitoBold.className} text-xl row-span-1 col-span-3`}>Date of Birth</h2>
            {birthDateInputMapArray.map((data, index) => (
                <FormField
                    key={data.name + index}
                    name={data.name}
                    render={({ field }) => (
                        <FormItem className='relative min-w-[80px]'>
                            <>
                                <FormControl>
                                    {data.name != 'birthDay' ? (
                                        <Select onValueChange={(value) => data.setState != undefined && data.setState(value)}>
                                            <SelectTrigger
                                                className={`${nunitoLight.className} px-4 py-3 w-full h-11 text-base bg-background hover:bg-background-secondary transition-all text-gray-500 appearance-none rounded-md border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                                            >
                                                <SelectValue {...field} placeholder={data.label} className='text-black overflow-ellipsis'>
                                                    <span className='min-w-[50px] truncate overflow-ellipsis'>
                                                        {data.name == 'birthYear' && birthYear != '2027'
                                                            ? data.state
                                                            : data.name == 'birthYear'
                                                            ? 'Year'
                                                            : data.name == 'birthMonth' && birthMonth != ''
                                                            ? data.state
                                                            : data.name == 'birthMonth'
                                                            ? 'Month'
                                                            : ''}
                                                    </span>
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent className='bg-background'>
                                                <SelectGroup>
                                                    {data.selections != undefined &&
                                                        data.selections.map((timeMeasure, index) => (
                                                            <SelectItem key={timeMeasure + index} value={timeMeasure} className='hover:bg-background-dark'>
                                                                {timeMeasure}
                                                            </SelectItem>
                                                        ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={'outline'}
                                                        className={cn(
                                                            `${nunitoLight.className} px-4 py-3 w-full min-w-[87px] truncate h-11 text-base flex justify-start bg-background hover:bg-background-secondary transition-all text-gray-500 appearance-none rounded-md border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`,
                                                            !date && 'text-muted-foreground'
                                                        )}
                                                    >
                                                        <CalendarIcon className='mr-2 h-4 w-4 min-h-4 min-w-4 text-gray-500' />
                                                        {date && birthDay != '' ? (
                                                            format(new Date(0, 0, parseInt(birthDay), 0, 0, 0), 'do')
                                                        ) : (
                                                            <span className='text-gray-500 truncate'>Day</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className='w-auto p-0'>
                                                    <Calendar
                                                        mode='single'
                                                        showYear={birthYear}
                                                        showMonth={birthMonth}
                                                        showArrows={false}
                                                        selected={date}
                                                        onSelect={setDate}
                                                        showOutsideDays={false}
                                                        className='bg-background'
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                    )}
                                </FormControl>
                            </>
                        </FormItem>
                    )}
                />
            ))}
        </div>
    );
};

export default BirthDateSelector;
