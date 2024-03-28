'use client';

import { Input } from '@/components/ui/input';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { Circle, Dot, Search, User, X } from 'lucide-react';
import { Jua, Nunito } from 'next/font/google';
import { useEffect, useRef, useState } from 'react';
import { useAthletesContext } from '../context';
import Link from 'next/link';

const jua = Jua({ weight: '400', subsets: ['latin'] });
const nunitoLight = Nunito({ weight: '400', subsets: ['latin'] });
const nunitoBold = Nunito({ weight: '800', subsets: ['latin'] });

// type Event = {
//     name: string;
//     performance: string;
// };

// type Athlete = {
//     _id: string;
//     firstName: string;
//     lastName: string;
//     grade: string;
//     events: Event[];
// };

// type Props = {
//     athletes: Athlete[];
//     setAthletes: React.Dispatch<React.SetStateAction<Athlete[]>>;
// };

const Results = () => {
    // const context = useAthletesContext();
    // if (context === undefined) {
    //     throw new Error('useContext(AthletesContext) must be used within a AthletesContext.Provider');
    // }
    // const [athletes, setAthletes] = useState<Athlete[]>(context.athletesData);
    // const [selectedEvents, setSelectedEvents] = useState([
    //     { name: '1600', selected: 'false' },
    //     { name: '400', selected: 'false' },
    //     { name: '100', selected: 'false' },
    //     { name: 'long jump', selected: 'false' },
    //     { name: 'high jump', selected: 'false' },
    // ]);

    // useEffect(() => {
    //     setAthletes(context.athletesData);
    // }, []);

    return (
        <div className='w-full flex justify-center'>
            <div className='w-full max-w-[1280px] flex flex-col mx-6 my-8'>
                <h1 className={`${jua.className} text-4xl`}>View the Results!</h1>
                <div className={`${nunitoLight.className} flex flex-col gap-1 mt-1`}>
                    <div>
                        On March 16th, 2024, our team hosted a track event. We apologize for the long wait on the results. If you see that your information is missing, please send us a
                        message{' '}
                        <Link
                            className='underline text-primary-light'
                            href='#'
                            onClick={(e) => {
                                e.preventDefault();
                                const targetElement = document.getElementById('contact-us');
                                if (targetElement) {
                                    targetElement.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                        >
                            here
                        </Link>
                        . Thank you.
                    </div>
                    <iframe
                        className='shadow-lg h-[844px] bg-background'
                        src='https://docs.google.com/spreadsheets/d/e/2PACX-1vTJd6v1XY-yICguxz5CnEuQ-XVtptRs3qH5pARxpWG52xj6EsGGFTad2uds3RH4cHcGa6bdek_nSMqE/pubhtml?gid=0&amp;single=true&amp;headers=false&amp;chrome=false&amp;range=A1:G58'
                    ></iframe>
                </div>
                {/* <div className='w-full h-[75vh]'>
                    <div className={'min-h-full min-w-full mt-5 rounded-lg grid grid-rows-[1fr_4fr] grid-cols-1 tablet:grid-cols-[1fr_4fr] tablet:grid-rows-1'}>
                        <div className='w-full h-full flex'>
                            <div className={'flex w-full h-full justify-center p-0.5 tablet:pr-4 tablet:pl-0.5'}>
                                <SearchBar athletes={athletes} setAthletes={setAthletes} />
                                <div className='flex'></div>
                            </div>
                            <div className={'bg-background-dark w-full rounded-lg h-0.5 tablet:w-0.5 tablet:h-full'} />
                        </div>
                        <div className='w-full h-full'>
                            <div className='flex h-full items-center justify-center'>
                                <span className='font-semibold'>Content</span>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

// const SearchBar = ({ athletes, setAthletes }: Props) => {
//     const ref = useRef(null);
//     const [renderedAthletes, setRenderedAthletes] = useState(10);
//     const [selectedAthlete, setSelectedAthlete] = useState<Athlete>();
//     const [query, setQuery] = useState('');
//     const athletesData: Athlete[] = [...athletes];

//     const onChange = () => {
//         setQuery((prev) => {
//             setAthletes(filterAndSortAthletes(prev));
//             return (ref.current !== null ? ref.current : { value: '' })!.value;
//         });

//         function filterAndSortAthletes(query: string): Athlete[] {
//             return query.trim()
//                 ? athletesData
//                       .filter((u) => u.firstName.toLowerCase().includes(query.toLowerCase()) || u.lastName.toLowerCase().includes(query.toLowerCase()))
//                       .sort((a, b) => {
//                           const nameA = a.firstName.toUpperCase();
//                           const nameB = b.firstName.toUpperCase();
//                           if (nameA < nameB) {
//                               return -1;
//                           }
//                           if (nameA > nameB) {
//                               return 1;
//                           }
//                           return 0;
//                       })
//                 : athletesData;
//         }
//     };

//     return (
//         <>
//             <Dialog>
//                 <DialogTrigger className='flex w-full h-8 items-center justify-end'>
//                     <button
//                         className={`${nunitoLight.className} px-3 w-full h-8 flex justify-start items-center text-gray-500 text-base outline-none bg-background appearance-none rounded-md border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
//                     >
//                         Search...
//                     </button>
//                     <Search className='absolute rotate-270 scale-x-[-1] mr-3 text-gray-400' size={20} strokeWidth={2} onClick={onChange} />
//                 </DialogTrigger>
//                 <DialogContent
//                     className={`${nunitoLight.className} flex p-0 flex-col gap-0 rounded-lg pt-2 h-96 bg-background shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
//                     id='hidex'
//                 >
//                     <div className='flex w-full h-10 items-center justify-start gap-2 px-4'>
//                         <Search className='text-gray-400 w-6 h-6' strokeWidth={2} onClick={onChange} />
//                         <Input
//                             className={`${nunitoLight.className} w-full h-10 flex justify-start items-center text-base outline-none bg-background appearance-none`}
//                             placeholder='Search for athletes...'
//                             autoCapitalize='false'
//                             autoComplete='false'
//                             ref={ref}
//                             onChange={onChange}
//                         ></Input>
//                         <DialogClose className='flex items-center'>
//                             <X className='h-5 w-5 text-gray-400' />
//                         </DialogClose>
//                     </div>
//                     <div className='w-full h-0.5 bg-background-secondary' />
//                     <div className='flex flex-col mx-2 mt-2 gap-1 overflow-y-scroll overflow-x-hidden w-[calc(100%-12px)]'>
//                         {athletes.slice(0, renderedAthletes).map((data, index) => (
//                             <DialogClose
//                                 key={data.firstName + index}
//                                 className={cn(
//                                     'w-[98%] pl-4 min-h-10 flex items-center rounded-lg hover:cursor-default text-gray-600 hover:bg-background-secondary gap-2',
//                                     selectedAthlete?._id == data._id && 'bg-background-secondary'
//                                 )}
//                                 onClick={() => setSelectedAthlete(data)}
//                             >
//                                 <Circle className='h-4 w-4' />
//                                 <p className='select-none'>
//                                     {data.firstName} {data.lastName}
//                                 </p>
//                             </DialogClose>
//                         ))}
//                         {athletes.length - renderedAthletes > 0 && <p className={`${nunitoLight.className} text-gray-600`}>And {athletes.length - renderedAthletes} more...</p>}
//                     </div>
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// };

export default Results;
