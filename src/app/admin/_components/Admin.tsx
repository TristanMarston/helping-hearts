import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Jua, Nunito } from 'next/font/google';
import { useEffect, useState } from 'react';
import Participants from './_databases/Participants';
import Volunteers from './_databases/Volunteers';
import Messages from './_databases/Messages';

const jua = Jua({ weight: '400', subsets: ['latin'] });
const nunitoLight = Nunito({ weight: '400', subsets: ['latin'] });

type DBType = 'participants' | 'volunteers' | 'messages';

const Admin = () => {
    const [selectedDB, setSelectedDB] = useState<DBType>('participants');
    const selectItemValues: DBType[] = ['participants', 'volunteers', 'messages'];

    return (
        <div className='w-full flex justify-center'>
            <div className='w-full max-w-[1280px] flex flex-col mx-6 my-8'>
                <h1 className={`${jua.className} text-4xl`}>Admin Page</h1>
                <div className={`${nunitoLight.className} flex flex-col gap-1 mt-1`}>
                    On this page, you may view all of the documents for each database. Please select a database to view using the dropdown below.
                </div>
                <Select onValueChange={(value: DBType) => setSelectedDB(value)}>
                    <SelectTrigger
                        className={`${nunitoLight.className} px-4 py-3 w-full mablet:w-48 mt-2 h-11 text-base bg-background hover:bg-background-secondary transition-all text-gray-500 appearance-none rounded-md border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]`}
                    >
                        <SelectValue placeholder='Participants'></SelectValue>
                    </SelectTrigger>
                    <SelectContent className='bg-background'>
                        {selectItemValues.map((value, index) => (
                            <SelectItem value={value.toLowerCase()} key={value + index} className={`${nunitoLight.className}`}>
                                {value[0].toUpperCase() + value.substring(1, value.length)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {selectedDB == 'participants' ? <Participants /> : selectedDB == 'volunteers' ? <Volunteers /> : selectedDB == 'messages' && <Messages />}
            </div>
        </div>
    );
};

export default Admin;
