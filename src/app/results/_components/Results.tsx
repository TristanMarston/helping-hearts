'use client';

import { Input } from '@/components/ui/input';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { Circle, Dot, Search, User, X } from 'lucide-react';
import { Jua, Nunito } from 'next/font/google';
import { useEffect, useRef, useState } from 'react';
import { useAthletesContext } from '../context';

const jua = Jua({ weight: '400', subsets: ['latin'] });
const nunitoLight = Nunito({ weight: '400', subsets: ['latin'] });
const nunitoBold = Nunito({ weight: '800', subsets: ['latin'] });

type Event = {
    name: string;
    performance: string;
};

type Athlete = {
    firstName: string;
    lastName: string;
    grade: string;
    events: Event[];
};

type Props = {
    athletes: Athlete[];
};

const Results = () => {
    const [direction, setDirection] = useState<'horizontal' | 'vertical'>('vertical');
    const [selectedEvents, setSelectedEvents] = useState([
        { name: '1600', selected: 'false' },
        { name: '400', selected: 'false' },
        { name: '100', selected: 'false' },
        { name: 'long jump', selected: 'false' },
        { name: 'high jump', selected: 'false' },
    ]);
    const context = useAthletesContext();

    if (context === undefined) {
        throw new Error('useContext(AthletesContext) must be used within a AthletesContext.Provider');
    }

    const { athletes } = context;

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth >= 650) {
                setDirection('horizontal');
            } else {
                setDirection('vertical');
            }
        }
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className='w-full flex justify-center'>
            <div className='w-full max-w-[1280px] flex flex-col mx-6 my-8'>
                <h1 className={`${jua.className} text-4xl`}>View the Results!</h1>
                <div className={`${nunitoLight.className} flex flex-col gap-1 mt-1`}>On March 16th, 2024, our team hosted a track event. Here are the results.</div>
                <div className='w-full h-[75vh]'>
                    <ResizablePanelGroup direction={direction} className='min-h-full w-full mt-5 rounded-lg'>
                        <ResizablePanel minSize={25}>
                            <div className={cn('flex h-full justify-center', direction == 'vertical' ? 'p-0.5' : 'pr-4 pl-0.5')}>
                                <SearchBar athletes={athletes} />
                                <div className='flex'></div>
                            </div>
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={75} minSize={50}>
                            <div className='flex h-full items-center justify-center'>
                                <span className='font-semibold'>Content</span>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
            </div>
        </div>
    );
};

const SearchBar = ({ athletes }: Props) => {
    const ref = useRef(null);

    const onChange = () => {
        const value = (ref.current !== null ? ref.current : { value: '' })!.value;
    };

    return (
        <>
            <Dialog>
                <DialogTrigger className='flex w-full h-8 items-center justify-end'>
                    <button
                        className={`${nunitoLight.className} px-3 w-full h-8 flex justify-start items-center text-gray-500 text-base outline-none bg-background appearance-none rounded-md border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                    >
                        Search...
                    </button>
                    <Search className='absolute rotate-270 scale-x-[-1] mr-3 text-gray-400' size={20} strokeWidth={2} onClick={onChange} />
                </DialogTrigger>
                <DialogContent
                    className={`${nunitoLight.className} flex p-0 flex-col gap-0 rounded-lg pt-2 h-96 bg-background shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                    id='hidex'
                >
                    <div className='flex w-full h-10 items-center justify-start gap-2 px-4'>
                        <Search className='text-gray-400 w-6 h-6' strokeWidth={2} onClick={onChange} />
                        <Input
                            className={`${nunitoLight.className} w-full h-10 flex justify-start items-center text-base outline-none bg-background appearance-none`}
                            placeholder='Search for athletes...'
                            autoCapitalize='false'
                            autoComplete='false'
                            ref={ref}
                            onChange={onChange}
                        ></Input>
                        <DialogClose className='flex items-center'>
                            <X className='h-5 w-5 text-gray-400' />
                        </DialogClose>
                    </div>
                    <div className=' w-full h-0.5 bg-background-secondary' />
                    <div className='flex flex-col mx-2 mt-2 gap-1 overflow-y-scroll overflow-x-hidden w-full'>
                        {athletes.map((data, index) => (
                            <div
                                key={data.firstName + index}
                                className='w-full px-4 h-10 flex items-center rounded-lg hover:cursor-default text-gray-600 hover:bg-background-secondary gap-2'
                            >
                                <Circle className='h-4 w-4' />
                                <p className='select-none'>
                                    {data.firstName} {data.lastName}
                                </p>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Results;
